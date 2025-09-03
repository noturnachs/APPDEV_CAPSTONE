const quotationRepository = require('../repositories/quotationRepository');
const permitRequestRepository = require('../repositories/permitRequestRepository');
const agencyRepository = require('../repositories/agencyRepository');
const permitTypeRepository = require('../repositories/permitTypeRepository');
const quickbooksService = require('./quickbooksService');
const emailService = require('../utils/emailService');
const { NotFoundError, BusinessLogicError } = require('../utils/validation');

class QuotationService {
  // Map service type to database enum values
  mapServiceType(serviceType) {
    switch (serviceType) {
      case 'permit-acquisition':
        return 'permit_acquisition';
      case 'compliance-monitoring':
        return 'monitoring';
      default:
        return 'permit_acquisition';
    }
  }

  // Build description based on service type
  buildDescription(quotationData) {
    if (quotationData.serviceType === 'compliance-monitoring') {
      return `Compliance Monitoring Request\nCurrent Permits: ${quotationData.currentPermits || 'Not specified'}\nMonitoring Frequency: ${quotationData.monitoringFrequency || 'Not specified'}\nDescription: ${quotationData.complianceDescription || 'No description provided'}`;
    }
    return quotationData.projectDescription || quotationData.complianceDescription;
  }

  // Handle permit selections for permit acquisition service
  async handlePermitSelections(quotationId, quotationData) {
    if (quotationData.serviceType !== 'permit-acquisition') {
      return;
    }

    // Handle selected permits from multiple agencies
    if (quotationData.permitTypes && quotationData.permitTypes.length > 0) {
      const allAgencies = await agencyRepository.findAll();
      
      for (const permitName of quotationData.permitTypes) {
        let permitType = null;
        
        // Search for permit across all agencies
        for (const agency of allAgencies) {
          permitType = await permitTypeRepository.findByNameAndAgency(permitName, agency.id);
          if (permitType) {
            break;
          }
        }
        
        if (permitType) {
          await permitRequestRepository.create({
            quotation_id: quotationId,
            permit_type_id: permitType.id,
            custom_name: null
          });
        }
      }
    }

    // Handle custom permits
    if (quotationData.customPermits && quotationData.customPermits.trim()) {
      await permitRequestRepository.create({
        quotation_id: quotationId,
        permit_type_id: null,
        custom_name: quotationData.customPermits.trim()
      });
    }
  }

  // Create project details
  async createProjectDetails(quotationId, quotationData) {
    const prisma = require('../config/database');
    
    const projectData = {
      quotation_id: quotationId,
      project_type: quotationData.projectType || '',
      project_description: quotationData.projectDescription || ''
    };

    // Add optional fields if provided
    if (quotationData.lotArea && quotationData.lotArea !== '') {
      projectData.lot_area = parseFloat(quotationData.lotArea);
    }
    
    if (quotationData.annualCapacity && quotationData.annualCapacity !== '') {
      projectData.annual_capacity = quotationData.annualCapacity;
    }

    
    return await prisma.project.create({
      data: projectData
    });
  }

  // Create quotation with all related data
  async createQuotation(quotationData) {
    // Create the quotation
    const quotation = await quotationRepository.create({
      first_name: quotationData.firstName,
      last_name: quotationData.lastName,
      email: quotationData.email,
      phone_number: quotationData.phone,
      company_name: quotationData.company,
      service_type: this.mapServiceType(quotationData.serviceType),
      description: this.buildDescription(quotationData),
      status: 'pending',
      client_id: null // No client account yet - will be created when accepted
    });

    // Create project details if provided
    if (quotationData.projectType || quotationData.projectDescription) {
      await this.createProjectDetails(quotation.id, quotationData);
    }

    // Handle permit selections
    await this.handlePermitSelections(quotation.id, quotationData);

    // Get complete quotation with permit requests and project
    const completeQuotation = await quotationRepository.findWithPermitRequestsAndProject(quotation.id);

    // Create QuickBooks estimate
    try {
      const quickbooksResult = await quickbooksService.createEstimate(completeQuotation);
      
      // Update quotation with QuickBooks estimate ID
      await quotationRepository.update(quotation.id, {
        quickbooks_estimate_id: quickbooksResult.estimateId,
        quickbooks_estimate_amount: quickbooksResult.totalAmount,
        is_synced: true,
        synced_at: new Date()
      });
      
      // Return updated quotation with QuickBooks ID
      const updatedQuotation = await quotationRepository.findWithPermitRequestsAndProject(quotation.id);
      
      // Send confirmation email to customer
      try {
        await this.sendConfirmationEmail(updatedQuotation);
        console.log(`✉️ Confirmation email sent to ${updatedQuotation.email} for quotation #${updatedQuotation.id}`);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue even if email fails - don't block the quotation creation
      }
      
      return {
        quotation: updatedQuotation,
        quickbooksEstimate: {
          estimateId: quickbooksResult.estimateId,
          estimateNumber: quickbooksResult.estimateNumber,
          totalAmount: quickbooksResult.totalAmount
        }
      };
    } catch (quickbooksError) {
      // Even if QuickBooks integration fails, try to send confirmation email
      try {
        await this.sendConfirmationEmail(completeQuotation);
        console.log(`✉️ Confirmation email sent to ${completeQuotation.email} for quotation #${completeQuotation.id}`);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue even if email fails
      }
      
      return {
        quotation: completeQuotation,
        quickbooksError: quickbooksError.message
      };
    }
  }

  // Send quotation via QuickBooks
  async sendQuotation(id) {
    const quotation = await quotationRepository.findById(id);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    if (!quotation.quickbooks_estimate_id) {
      throw new BusinessLogicError('No QuickBooks estimate found for this quotation. Please create an estimate first.');
    }

    if (quotation.status === 'sent') {
      throw new BusinessLogicError('This quotation has already been sent to the client.');
    }

    // Send existing estimate via QuickBooks
    const result = await quickbooksService.sendExistingEstimate(
      quotation.quickbooks_estimate_id, 
      quotation.email
    );
    
    // Update quotation status to sent
    await quotationRepository.update(id, { 
      status: 'sent',
      is_synced: true,
      synced_at: new Date()
    });

    return {
      estimateId: result.estimateId,
      sentTo: result.sentTo
    };
  }

  // Get all quotations
  async getAllQuotations() {
    return await quotationRepository.findAll({
      include: { 
        permit_requests: {
          include: {
            permit_type: {
              include: {
                agency: true
              }
            }
          }
        },
        project: true
      }
    });
  }

  // Get quotation by ID
  async getQuotationById(id) {
    const quotation = await quotationRepository.findWithPermitRequestsAndProject(id);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    return quotation;
  }

  // Update quotation with comprehensive editing including permits
  async updateQuotation(id, data) {
    const quotation = await quotationRepository.findById(id);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    // Use Prisma transaction for atomic updates
    const prisma = require('../config/database');
    
    return await prisma.$transaction(async (tx) => {
      // Update basic quotation data
      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        company_name: data.company_name,
        service_type: data.service_type,
        description: data.description,
        status: data.status
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await tx.quotation.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      // Handle permit requests if provided
      if (data.permit_requests !== undefined) {
        // Delete existing permit requests
        await tx.permit_request.deleteMany({
          where: { quotation_id: parseInt(id) }
        });
        
        // Create new permit requests
        if (data.permit_requests && data.permit_requests.length > 0) {
          for (const permitRequest of data.permit_requests) {
            await tx.permit_request.create({
              data: {
                quotation_id: parseInt(id),
                permit_type_id: permitRequest.permit_type_id ? parseInt(permitRequest.permit_type_id) : null,
                custom_name: permitRequest.custom_name || null
              }
            });
          }
        }
      }

      // Handle project updates if provided
      if (data.project !== undefined) {
        // Check if project exists
        const existingProject = await tx.project.findUnique({
          where: { quotation_id: parseInt(id) }
        });

        if (existingProject) {
          // Update existing project
          await tx.project.update({
            where: { quotation_id: parseInt(id) },
            data: {
              project_type: data.project.project_type,
              lot_area: data.project.lot_area ? parseFloat(data.project.lot_area) : null,
              annual_capacity: data.project.annual_capacity || null,
              project_description: data.project.project_description
            }
          });
        } else if (data.project.project_type || data.project.project_description) {
          // Create new project if it doesn't exist
          await tx.project.create({
            data: {
              quotation_id: parseInt(id),
              project_type: data.project.project_type || '',
              lot_area: data.project.lot_area ? parseFloat(data.project.lot_area) : null,
              annual_capacity: data.project.annual_capacity || null,
              project_description: data.project.project_description || ''
            }
          });
        }
      }

      // Get updated quotation with permit requests and project
      const updatedQuotation = await tx.quotation.findUnique({
        where: { id: parseInt(id) },
        include: {
          permit_requests: {
            include: {
              permit_type: {
                include: {
                  agency: true
                }
              }
            }
          },
          project: true,
          client: true
        }
      });

      // Update QuickBooks estimate if quotation has one
      if (quotation.quickbooks_estimate_id) {
        try {
          // Update QuickBooks estimate
          await quickbooksService.updateEstimate(quotation.quickbooks_estimate_id, updatedQuotation);
          
          // Update sync status
          await tx.quotation.update({
            where: { id: parseInt(id) },
            data: {
              is_synced: true,
              synced_at: new Date()
            }
          });
        } catch (quickbooksError) {
          // Continue with the update even if QuickBooks fails
        }
      }

      return updatedQuotation;
    });
  }

  // Delete quotation
  async deleteQuotation(id) {
    const quotation = await quotationRepository.findById(id);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    // Delete QuickBooks estimate if it exists
    if (quotation.quickbooks_estimate_id) {
      try {
        await quickbooksService.deleteEstimate(quotation.quickbooks_estimate_id);
      } catch (quickbooksError) {
        // Continue with quotation deletion even if QuickBooks deletion fails
      }
    }

    return await quotationRepository.delete(id);
  }

  // Add permit to quotation
  async addPermitToQuotation(quotationId, permitData) {
    const quotation = await quotationRepository.findById(quotationId);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    // Validate that only predefined permits can be added (no custom permits)
    if (!permitData.permit_type_id) {
      throw new BusinessLogicError('Only predefined permits can be added. Custom permits are not allowed.');
    }

    // Verify the permit type exists
    const permitType = await permitTypeRepository.findById(permitData.permit_type_id);
    if (!permitType) {
      throw new NotFoundError('Permit type not found');
    }

    // Create permit request (only predefined permits)
    const permitRequestData = {
      quotation_id: parseInt(quotationId),
      permit_type_id: parseInt(permitData.permit_type_id),
      custom_name: null // Always null for predefined permits
    };
    
    const permitRequest = await permitRequestRepository.create(permitRequestData);

    // Update QuickBooks estimate if exists
    if (quotation.quickbooks_estimate_id) {
      try {
        const updatedQuotation = await quotationRepository.findWithPermitRequestsAndProject(quotationId);
        const quickbooksResult = await quickbooksService.updateEstimate(quotation.quickbooks_estimate_id, updatedQuotation);
        
        // Update sync status and estimate amount
        await quotationRepository.update(quotationId, {
          quickbooks_estimate_amount: quickbooksResult.totalAmount,
          is_synced: true,
          synced_at: new Date()
        });
      } catch (quickbooksError) {
        // Continue even if QuickBooks update fails
      }
    }

    return await quotationRepository.findWithPermitRequestsAndProject(quotationId);
  }

  // Remove permit from quotation
  async removePermitFromQuotation(quotationId, permitId) {
    const quotation = await quotationRepository.findById(quotationId);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    const permitRequest = await permitRequestRepository.findById(permitId);
    
    if (!permitRequest || permitRequest.quotation_id !== parseInt(quotationId)) {
      throw new NotFoundError('Permit request not found');
    }

    // Delete permit request
    await permitRequestRepository.delete(permitId);

    // Update QuickBooks estimate if exists
    if (quotation.quickbooks_estimate_id) {
      try {
        const updatedQuotation = await quotationRepository.findWithPermitRequestsAndProject(quotationId);
        const quickbooksResult = await quickbooksService.updateEstimate(quotation.quickbooks_estimate_id, updatedQuotation);
        
        // Update sync status and estimate amount
        await quotationRepository.update(quotationId, {
          quickbooks_estimate_amount: quickbooksResult.totalAmount,
          is_synced: true,
          synced_at: new Date()
        });
      } catch (quickbooksError) {
        // Continue even if QuickBooks update fails
      }
    }

    return await quotationRepository.findWithPermitRequestsAndProject(quotationId);
  }

  // Get available permits
  async getAvailablePermits() {
    const agencies = await agencyRepository.findAll();
    const permits = [];

    for (const agency of agencies) {
      const agencyPermits = await permitTypeRepository.findByAgencyId(agency.id);
      permits.push({
        id: agency.id,
        name: agency.name,
        permit_types: agencyPermits.map(permit => ({
          id: permit.id,
          name: permit.name,
          description: permit.description,
          price: permit.price,
          time_estimate: permit.time_estimate,
          quickbooks_item_id: permit.quickbooks_item_id
        }))
      });
    }

    return permits;
  }

  // Get quotation permits
  async getQuotationPermits(quotationId) {
    const quotation = await quotationRepository.findById(quotationId);
    
    if (!quotation) {
      throw new NotFoundError('Quotation not found');
    }

    return await permitRequestRepository.findByQuotationId(quotationId);
  }

  /**
   * Send a confirmation email for a new quotation submission
   * @param {Object} quotation - The quotation object with all details
   * @returns {Promise<Object>} - Email sending result
   */
  async sendConfirmationEmail(quotation) {
    try {
      // Create a simple confirmation email instead of a full quotation email
      // This is different from the formal quotation email that will be sent later
      
      // Create a custom email for confirmation purposes
      const emailSubject = `Your Quotation Request #QT-${quotation.id} - Alpha Systems Environmental Consulting`;
      
      // Format service type for display
      const serviceType = quotation.service_type === 'permit_acquisition' 
        ? 'Permit Acquisition' 
        : 'Compliance Monitoring';
      
      // Create HTML email content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #106934; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Alpha Systems Environmental Consulting</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${quotation.first_name} ${quotation.last_name},</p>
            
            <p>Thank you for submitting your quotation request. We have received your information and are processing your request.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #106934;">
              <p><strong>Quotation Reference Number:</strong> QT-${quotation.id}</p>
              <p><strong>Service Type:</strong> ${serviceType}</p>
              <p><strong>Submission Date:</strong> ${new Date(quotation.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <p>Our team will review your requirements and prepare a detailed quotation for you. You can expect to receive your formal quotation within 2-3 business days.</p>
            
            <p>If you have any questions or need to provide additional information, please contact us and reference your quotation number.</p>
            
            <p>Thank you for choosing Alpha Systems Environmental Consulting for your environmental compliance needs.</p>
            
            <p>Best regards,<br>
            Alpha Systems Team</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This email was sent from an automated system. Please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} Alpha Systems Environmental Consulting. All rights reserved.</p>
          </div>
        </div>
      `;
      
      // Plain text version
      const textContent = `Thank you for submitting your quotation request. We have received your information and are processing your request.

Your Quotation Reference Number is: QT-${quotation.id}
Service Type: ${serviceType}
Submission Date: ${new Date(quotation.created_at).toLocaleDateString()}

Our team will review your requirements and prepare a detailed quotation for you. You can expect to receive your formal quotation within 2-3 business days.

If you have any questions or need to provide additional information, please contact us and reference your quotation number.

Thank you for choosing Alpha Systems Environmental Consulting for your environmental compliance needs.

Best regards,
Alpha Systems Team`;

      // Use the transporter directly to avoid confusion with the formal quotation email
      const info = await emailService.transporter.sendMail({
        from: `"Alpha Systems" <${process.env.EMAIL_USER || 'info@alphaenvironmental.com'}>`,
        to: quotation.email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent
      });

      return {
        success: true,
        messageId: info.messageId,
        sentTo: quotation.email
      };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }
}

module.exports = new QuotationService(); 
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { promisify } = require('util');

class EmailService {
  constructor() {
    // Create reusable transporter using environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Generate a PDF document for the quotation
   * @param {Object} quotation - The quotation data
   * @param {Object} estimateData - QuickBooks estimate data
   * @returns {Promise<string>} - Path to the generated PDF file
   */
  async generateQuotationPDF(quotation, estimateData) {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const pdfPath = path.join(tempDir, `quotation-${quotation.id}.pdf`);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(pdfPath);

        // Pipe the PDF into a file
        doc.pipe(writeStream);

        // Add company logo and header
        doc
          .fontSize(20)
          .text('Alpha Systems Environmental Consulting', { align: 'center' })
          .fontSize(12)
          .text('Environmental Compliance Solutions', { align: 'center' })
          .moveDown(2);

        // Add quotation details
        doc
          .fontSize(16)
          .text('Quotation', { align: 'center' })
          .moveDown(0.5)
          .fontSize(12)
          .text(`Quotation #: ${quotation.id}`, { align: 'center' })
          .text(`Date: ${new Date(quotation.created_at).toLocaleDateString()}`, { align: 'center' })
          .moveDown(2);

        // Client information
        doc
          .fontSize(14)
          .text('Client Information')
          .moveDown(0.5)
          .fontSize(12)
          .text(`Name: ${quotation.first_name} ${quotation.last_name}`)
          .text(`Company: ${quotation.company_name || 'N/A'}`)
          .text(`Email: ${quotation.email}`)
          .text(`Phone: ${quotation.phone_number || 'N/A'}`)
          .moveDown(2);

        // Service details
        doc
          .fontSize(14)
          .text('Service Details')
          .moveDown(0.5)
          .fontSize(12);

        const serviceType = quotation.service_type === 'permit_acquisition' 
          ? 'Permit Acquisition' 
          : 'Compliance Monitoring';
        
        doc.text(`Service Type: ${serviceType}`);

        // Description
        doc
          .moveDown(0.5)
          .text('Description:')
          .moveDown(0.5)
          .text(quotation.description || 'No description provided', {
            width: 500,
            align: 'justify'
          })
          .moveDown(2);

        // Permit details if available
        if (quotation.permit_requests && quotation.permit_requests.length > 0) {
          doc
            .fontSize(14)
            .text('Requested Permits')
            .moveDown(0.5)
            .fontSize(12);

          quotation.permit_requests.forEach((permit, index) => {
            const permitName = permit.permit_type 
              ? `${permit.permit_type.agency.name} - ${permit.permit_type.name}` 
              : permit.custom_name || 'Custom Permit';
            
            const permitPrice = permit.permit_type?.price 
              ? `PHP ${permit.permit_type.price.toLocaleString()}` 
              : 'Price on request';
            
            doc.text(`${index + 1}. ${permitName} (${permitPrice})`);
          });
          
          doc.moveDown(2);
        }

        // Total amount
        if (quotation.quickbooks_estimate_amount) {
          doc
            .fontSize(14)
            .text('Quotation Amount', { continued: true })
            .fontSize(16)
            .text(`: PHP ${Number(quotation.quickbooks_estimate_amount).toLocaleString()}`, { align: 'right' })
            .moveDown(2);
        }

        // Terms and conditions
        doc
          .fontSize(14)
          .text('Terms and Conditions')
          .moveDown(0.5)
          .fontSize(10)
          .text('1. This quotation is valid for 30 days from the date of issue.')
          .text('2. Payment terms: 50% upfront, 50% upon completion.')
          .text('3. Prices are subject to change if scope of work is modified.')
          .text('4. Alpha Systems Environmental Consulting reserves the right to adjust pricing if unforeseen circumstances arise.')
          .moveDown(2);

        // Add approval instructions
        doc
          .fontSize(14)
          .text('Approval Instructions')
          .moveDown(0.5)
          .fontSize(12)
          .text('To approve or decline this quotation, please click on the appropriate button in the email.')
          .moveDown(2);

        // Add footer with page numbers
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(10)
            .text(
              `Page ${i + 1} of ${pageCount}`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        // Finalize the PDF
        doc.end();

        writeStream.on('finish', () => {
          resolve(pdfPath);
        });

        writeStream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate a token for quotation approval/rejection
   * @param {number} quotationId - The quotation ID
   * @param {string} action - The action ('approve' or 'decline')
   * @returns {string} - The generated token
   */
  generateActionToken(quotationId, action) {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'quotation-action-secret';
    
    // Create a token that expires in 30 days
    return jwt.sign(
      { 
        quotationId, 
        action,
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
      }, 
      secret
    );
  }

  /**
   * Send quotation email with PDF attachment and approval/decline buttons
   * @param {Object} quotation - The quotation data
   * @param {Object} estimateData - QuickBooks estimate data (optional)
   * @returns {Promise<Object>} - Email sending result
   */
  async sendQuotationEmail(quotation, estimateData = null) {
    try {
      // Generate PDF
      const pdfPath = await this.generateQuotationPDF(quotation, estimateData);
      
      // Generate approval and decline tokens
      const approveToken = this.generateActionToken(quotation.id, 'approve');
      const declineToken = this.generateActionToken(quotation.id, 'decline');
      
      // Create the base URL from environment or default
      const baseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
      
      // Create approval and decline URLs
      const approveUrl = `${baseUrl}/quotation/respond?token=${approveToken}`;
      const declineUrl = `${baseUrl}/quotation/respond?token=${declineToken}`;

      // Service type for display
      const serviceType = quotation.service_type === 'permit_acquisition' 
        ? 'Permit Acquisition' 
        : 'Compliance Monitoring';

      // Create HTML email content with buttons
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #106934; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Alpha Systems Environmental Consulting</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${quotation.first_name} ${quotation.last_name},</p>
            
            <p>Thank you for your interest in our services. We are pleased to provide you with a quotation for the following service:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #106934;">
              <p><strong>Service:</strong> ${serviceType}</p>
              <p><strong>Quotation #:</strong> ${quotation.id}</p>
              ${quotation.quickbooks_estimate_amount ? 
                `<p><strong>Total Amount:</strong> PHP ${Number(quotation.quickbooks_estimate_amount).toLocaleString()}</p>` : 
                ''}
            </div>
            
            <p>Please find attached the detailed quotation for your review.</p>
            
            <p>To proceed with this quotation, please click one of the buttons below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${approveUrl}" style="background-color: #106934; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; margin-right: 15px; font-weight: bold;">
                APPROVE QUOTATION
              </a>
              
              <a href="${declineUrl}" style="background-color: #d32f2f; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                DECLINE QUOTATION
              </a>
            </div>
            
            <p>If you have any questions or require further information, please don't hesitate to contact us.</p>
            
            <p>Thank you for considering Alpha Systems Environmental Consulting for your environmental compliance needs.</p>
            
            <p>Best regards,<br>
            Alpha Systems Team</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This email was sent from an automated system. Please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} Alpha Systems Environmental Consulting. All rights reserved.</p>
          </div>
        </div>
      `;

      // Send email with attachment
      const info = await this.transporter.sendMail({
        from: `"Alpha Systems" <${process.env.EMAIL_USER}>`,
        to: quotation.email,
        subject: `Your Quotation #${quotation.id} from Alpha Systems Environmental Consulting`,
        text: `Thank you for your interest in our services. We are pleased to provide you with a quotation for ${serviceType}. Please find attached the detailed quotation for your review. To approve this quotation, please visit: ${approveUrl}. To decline, please visit: ${declineUrl}`,
        html: htmlContent,
        attachments: [
          {
            filename: `Alpha_Systems_Quotation_${quotation.id}.pdf`,
            path: pdfPath,
            contentType: 'application/pdf'
          }
        ]
      });

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfPath);

      return {
        success: true,
        messageId: info.messageId,
        sentTo: quotation.email
      };
    } catch (error) {
      console.error('Error sending quotation email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();

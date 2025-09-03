const QuickBooks = require('node-quickbooks');
const OAuthClient = require('intuit-oauth');
const quickbooksTokensRepository = require('../repositories/quickbooksTokensRepository');

class QuickBooksService {
  constructor() {
    this.oauthClient = new OAuthClient({
      clientId: process.env.QUICKBOOKS_CLIENT_ID,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
      environment: 'sandbox', // Change to 'production' for live
      redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
    });
    
    this.tokens = null;
    this.qbo = null;
    this.isRefreshing = false;
  }

  // Initialize tokens from database or environment
  async initialize() {
    try {
      // Try to get tokens from database first
      const tokenRecord = await quickbooksTokensRepository.findLatest();

      if (tokenRecord) {
        this.tokens = {
          access_token: tokenRecord.access_token,
          refresh_token: tokenRecord.refresh_token,
          realmId: tokenRecord.realm_id || process.env.QUICKBOOKS_REALM_ID, // Fallback to env var
          expires_in: tokenRecord.expires_in,
          token_type: tokenRecord.token_type,
          createdAt: tokenRecord.created_at
        };
      } else {
        // Fallback to environment variables
        this.tokens = {
          access_token: process.env.QUICKBOOKS_ACCESS_TOKEN,
          refresh_token: process.env.QUICKBOOKS_REFRESH_TOKEN,
          realmId: process.env.QUICKBOOKS_REALM_ID,
          expires_in: 3600,
          token_type: 'bearer',
          createdAt: new Date()
        };
      }

      // Ensure we have a valid realmId
      if (!this.tokens.realmId) {
        console.error('No realmId found in tokens or environment variables');
        throw new Error('QuickBooks realmId is required');
      }

      this.createQBOInstance();
    } catch (error) {
      console.error('Error initializing QuickBooks service:', error);
    }
  }

  // Create QuickBooks instance with current tokens
  createQBOInstance() {
    if (!this.tokens) return null;

    this.qbo = new QuickBooks(
      process.env.QUICKBOOKS_CLIENT_ID,
      process.env.QUICKBOOKS_CLIENT_SECRET,
      this.tokens.access_token,
      false,
      this.tokens.realmId,
      'sandbox',
      true,
      null,
      '2.0',
      this.tokens.refresh_token
    );
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  isTokenExpired() {
    if (!this.tokens || !this.tokens.createdAt) return true;
    
    const now = new Date();
    const tokenAge = now - new Date(this.tokens.createdAt);
    const expiresInMs = (this.tokens.expires_in - 300) * 1000; // 5 minutes buffer
    
    return tokenAge >= expiresInMs;
  }

  // Refresh token automatically
  async refreshToken() {
    if (this.isRefreshing) {
      // Wait for ongoing refresh
      while (this.isRefreshing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isRefreshing = true;

    try {
      console.log('Refreshing QuickBooks token...');
      
      const authResponse = await this.oauthClient.refreshUsingToken(this.tokens.refresh_token);
      const newTokens = authResponse.token;

      // Update tokens - FIX: Preserve the realmId
      this.tokens = {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        realmId: newTokens.realmId || this.tokens.realmId || process.env.QUICKBOOKS_REALM_ID, // Multiple fallbacks
        expires_in: newTokens.expires_in,
        token_type: newTokens.token_type,
        createdAt: new Date()
      };

      // Ensure we have a valid realmId
      if (!this.tokens.realmId) {
        throw new Error('No realmId available after token refresh');
      }

      // Save to database
      await quickbooksTokensRepository.create({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        realm_id: this.tokens.realmId, // Use the preserved realmId
        expires_in: newTokens.expires_in,
        token_type: newTokens.token_type
      });

      // Recreate QBO instance with new tokens
      this.createQBOInstance();
      
      console.log('QuickBooks token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh QuickBooks token');
    } finally {
      this.isRefreshing = false;
    }
  }

  // Ensure valid token before making API calls
  async ensureValidToken() {
    if (!this.tokens) {
      await this.initialize();
    }

    if (this.isTokenExpired()) {
      await this.refreshToken();
    }
  }

  // Create estimate only (without sending)
  async createEstimate(quotationData) {
    console.log('Starting createEstimate...');
    await this.ensureValidToken();
    
    console.log('Tokens loaded:', {
      hasTokens: !!this.tokens,
      hasAccessToken: !!this.tokens?.access_token,
      hasRealmId: !!this.tokens?.realmId,
      realmId: this.tokens?.realmId
    });
    
    console.log('QBO instance created:', !!this.qbo);

    return new Promise((resolve, reject) => {
      // First, try to find existing customer by email
      this.qbo.findCustomers({
        PrimaryEmailAddr: quotationData.email
      }, async (findErr, customers) => {
        if (findErr) {
          console.error('Error finding customer:', findErr);
          reject(findErr);
          return;
        }

        let customer = null;
        
        // Check if customer exists
        if (customers && customers.QueryResponse && customers.QueryResponse.Customer) {
          const customerList = Array.isArray(customers.QueryResponse.Customer) 
            ? customers.QueryResponse.Customer 
            : [customers.QueryResponse.Customer];
          
          if (customerList.length > 0) {
            customer = customerList[0]; // Use the first matching customer
            console.log('Found existing customer:', customer.Id);
          }
        }

        // If customer doesn't exist, create new one
        if (!customer) {
          console.log('Creating new customer...');
          const customerData = {
            GivenName: quotationData.first_name,
            FamilyName: quotationData.last_name,
            PrimaryEmailAddr: {
              Address: quotationData.email
            },
            PrimaryPhone: {
              FreeFormNumber: quotationData.phone_number
            }
          };

          // Add CompanyName only if it exists
          if (quotationData.company_name) {
            customerData.CompanyName = quotationData.company_name;
          }

          console.log('Creating customer with data:', customerData);

          this.qbo.createCustomer(customerData, async (err, newCustomer) => {
            if (err) {
              console.error('Error creating customer:', err);
              reject(err);
              return;
            }

            console.log('Customer created successfully:', newCustomer.Id);
            this.createEstimateOnly(newCustomer, quotationData, resolve, reject);
          });
        } else {
          // Use existing customer
          console.log('Using existing customer:', customer.Id);
          this.createEstimateOnly(customer, quotationData, resolve, reject);
        }
      });
    });
  }

  // Helper method to create estimate only (without sending)
  createEstimateOnly(customer, quotationData, resolve, reject) {
    console.log('=== CREATE ESTIMATE DEBUG ===');
    console.log('Customer:', customer.Id);
    console.log('Quotation data:', JSON.stringify(quotationData, null, 2));
    console.log('Permit requests count:', quotationData.permit_requests?.length || 0);
    
    // Create separate line items for each permit request
    const lineItems = [];
    
    if (quotationData.permit_requests && quotationData.permit_requests.length > 0) {
      console.log('Processing permit requests...');
      
      // Create a line item for each permit
      quotationData.permit_requests.forEach((permit, index) => {
        console.log(`Processing permit ${index + 1}:`, permit);
        
        if (permit.permit_type) {
          const lineItem = {
            DetailType: 'SalesItemLineDetail',
            Amount: permit.permit_type.price || 5000,
            Description: permit.permit_type.name || 'Permit Service', // Use permit name, not project description
            SalesItemLineDetail: {
              ItemRef: { value: permit.permit_type.quickbooks_item_id || '29' },
              Qty: 1,
              UnitPrice: permit.permit_type.price || 5000,
              TaxCodeRef: { value: '6' } // Use "Out of Scope" tax code (ID 6)
            }
          };
          
          console.log(`Created line item ${index + 1}:`, lineItem);
          lineItems.push(lineItem);
        } else if (permit.custom_name) {
          // Handle custom permits
          const lineItem = {
            DetailType: 'SalesItemLineDetail',
            Amount: 5000, // Default price for custom permits
            Description: permit.custom_name,
            SalesItemLineDetail: {
              ItemRef: { value: '29' }, // Default item ID
              Qty: 1,
              UnitPrice: 5000,
              TaxCodeRef: { value: '6' }
            }
          };
          
          console.log(`Created custom line item ${index + 1}:`, lineItem);
          lineItems.push(lineItem);
        }
      });
    }

    console.log('Total line items created:', lineItems.length);
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    // If no permit requests, create a default line item
    if (lineItems.length === 0) {
      console.log('No permit requests found, creating default line item');
      lineItems.push({
        DetailType: 'SalesItemLineDetail',
        Amount: 5000,
        Description: 'Environmental Consulting Services',
        SalesItemLineDetail: {
          ItemRef: { value: '29' }, // Default item ID
          Qty: 1,
          UnitPrice: 5000,
          TaxCodeRef: { value: '6' }
        }
      });
    }

    const estimateData = {
      CustomerRef: { value: customer.Id },
      Line: lineItems
    };

    console.log('Final estimate data:', JSON.stringify(estimateData, null, 2));
    console.log('=== END CREATE ESTIMATE DEBUG ===');

    // Create estimate with proper tax structure
    this.qbo.createEstimate(estimateData, async (err, estimate) => {
      if (err) {
        console.log('Error creating estimate:', err.message);
        
        // If it's a tax error, try with a different approach
        const isTaxError = err.Fault?.Error?.[0]?.code === '6000' || 
                          err.message?.includes('GST/HST') ||
                          err.message?.includes('tax') ||
                          err.message?.includes('6000');
        
        if (isTaxError) {
          console.log('Tax error detected, trying with TxnTaxDetail approach...');
          
          // Try with TxnTaxDetail structure - also fix the line items here
          const estimateWithTaxDetail = {
            CustomerRef: { value: customer.Id },
            Line: lineItems.map(item => ({
              ...item,
              SalesItemLineDetail: {
                ...item.SalesItemLineDetail,
                TaxCodeRef: undefined // Remove tax code for TxnTaxDetail approach
              }
            })),
            TxnTaxDetail: {
              TotalTax: 0,
              TaxLine: [
                {
                  Amount: 0,
                  DetailType: 'TaxLineDetail',
                  TaxLineDetail: {
                    TaxRateRef: {
                      value: '14' // Use NOTAXS tax rate (ID 14) from "Out of Scope" tax code
                    }
                  }
                }
              ]
            }
          };

          console.log('Trying with TxnTaxDetail and NOTAXS tax rate...');
          
          this.qbo.createEstimate(estimateWithTaxDetail, (taxDetailErr, taxDetailEstimate) => {
            if (taxDetailErr) {
              console.log('TxnTaxDetail approach failed:', taxDetailErr.message);
              reject(taxDetailErr);
              return;
            }
            
            console.log('Success with TxnTaxDetail approach!');
            resolve({
              estimateId: taxDetailEstimate.Id,
              estimateNumber: taxDetailEstimate.DocNumber,
              totalAmount: taxDetailEstimate.TotalAmt,
              customerId: taxDetailEstimate.CustomerRef.value
            });
          });
          return;
        }

        // If token expired during call, refresh and retry once
        if (err.message && err.message.includes('unauthorized')) {
          try {
            await this.refreshToken();
            // Retry the estimate creation
            this.qbo.createEstimate(estimateData, (retryErr, retryEstimate) => {
              if (retryErr) {
                reject(retryErr);
                return;
              }
              resolve({
                estimateId: retryEstimate.Id,
                estimateNumber: retryEstimate.DocNumber,
                totalAmount: retryEstimate.TotalAmt,
                customerId: retryEstimate.CustomerRef.value
              });
            });
          } catch (refreshError) {
            reject(refreshError);
          }
          return;
        }
        reject(err);
        return;
      }

      resolve({
        estimateId: estimate.Id,
        estimateNumber: estimate.DocNumber,
        totalAmount: estimate.TotalAmt,
        customerId: estimate.CustomerRef.value
      });
    });
  }

  // Enhanced createAndSendEstimate with automatic token refresh
  async createAndSendEstimate(quotationData) {
    await this.ensureValidToken();

    return new Promise((resolve, reject) => {
      // First, try to find existing customer by email
      this.qbo.findCustomers({
        PrimaryEmailAddr: quotationData.email
      }, async (findErr, customers) => {
        if (findErr) {
          console.error('Error finding customer:', findErr);
          reject(findErr);
          return;
        }

        let customer = null;
        
        // Check if customer exists
        if (customers && customers.QueryResponse && customers.QueryResponse.Customer) {
          const customerList = Array.isArray(customers.QueryResponse.Customer) 
            ? customers.QueryResponse.Customer 
            : [customers.QueryResponse.Customer];
          
          if (customerList.length > 0) {
            customer = customerList[0]; // Use the first matching customer
            console.log('Found existing customer:', customer.Id);
          }
        }

        // If customer doesn't exist, create new one
        if (!customer) {
          console.log('Creating new customer...');
          const customerData = {
            GivenName: quotationData.first_name,
            FamilyName: quotationData.last_name,
            PrimaryEmailAddr: { 
              Address: quotationData.email 
            },
            PrimaryPhone: { 
              FreeFormNumber: quotationData.phone_number 
            }
          };

          // Add CompanyName only if it exists
          if (quotationData.company_name) {
            customerData.CompanyName = quotationData.company_name;
          }

          this.qbo.createCustomer(customerData, async (err, newCustomer) => {
            if (err) {
              console.error('Error creating customer:', err);
              reject(err);
              return;
            }

            console.log('Customer created successfully:', newCustomer.Id);
            this.createEstimateWithCustomer(newCustomer, quotationData, resolve, reject);
          });
        } else {
          // Use existing customer
          console.log('Using existing customer:', customer.Id);
          this.createEstimateWithCustomer(customer, quotationData, resolve, reject);
        }
      });
    });
  }

  // Helper method to create estimate with customer
  createEstimateWithCustomer(customer, quotationData, resolve, reject) {
    // Calculate total amount from permit requests
    const totalAmount = quotationData.permit_requests?.reduce((sum, permit) => {
      return sum + (permit.permit_type?.time_estimate || 5000);
    }, 0) || 5000;

    const estimateData = {
      CustomerRef: { value: customer.Id },
      Line: [
        {
          DetailType: 'SalesItemLineDetail',
          Amount: totalAmount,
          Description: quotationData.description || 'Environmental Consulting Services',
          SalesItemLineDetail: {
            ItemRef: { value: '29' }, // Default item ID
            Qty: 1,
            UnitPrice: totalAmount
          }
        }
      ],
      // Add tax detail as required by QuickBooks Canada
      TxnTaxDetail: {
        TotalTax: 0,
        TaxLine: [
          {
            Amount: 0,
            DetailType: 'TaxLineDetail',
            TaxLineDetail: {
              TaxRateRef: {
                value: '1' // Use the first tax rate (GST EP - 0% rate)
              }
            }
          }
        ]
      }
    };

    this.qbo.createEstimate(estimateData, async (err, estimate) => {
      if (err) {
        // If token expired during call, refresh and retry once
        if (err.message && err.message.includes('unauthorized')) {
          try {
            await this.refreshToken();
            // Retry the estimate creation
            this.qbo.createEstimate(estimateData, (retryErr, retryEstimate) => {
              if (retryErr) {
                reject(retryErr);
                return;
              }
              this.sendEstimateToCustomer(retryEstimate, quotationData, resolve, reject);
            });
          } catch (refreshError) {
            reject(refreshError);
          }
          return;
        }
        reject(err);
        return;
      }

      this.sendEstimateToCustomer(estimate, quotationData, resolve, reject);
    });
  }

  // Helper method to send estimate to customer
  sendEstimateToCustomer(estimate, quotationData, resolve, reject) {
    this.qbo.sendEstimate(estimate.Id, { sendTo: quotationData.email }, async (err, response) => {
      if (err) {
        // If token expired during call, refresh and retry once
        if (err.message && err.message.includes('unauthorized')) {
          try {
            await this.refreshToken();
            // Retry sending the estimate
            this.qbo.sendEstimate(estimate.Id, { sendTo: quotationData.email }, (retryErr, retryResponse) => {
              if (retryErr) {
                reject(retryErr);
                return;
              }
              resolve({
                estimateId: estimate.Id,
                estimateNumber: estimate.DocNumber,
                totalAmount: estimate.TotalAmt,
                customerId: estimate.CustomerRef.value
              });
            });
          } catch (refreshError) {
            reject(refreshError);
          }
          return;
        }
        reject(err);
        return;
      }

      resolve({
        estimateId: estimate.Id,
        estimateNumber: estimate.DocNumber,
        totalAmount: estimate.TotalAmt,
        customerId: estimate.CustomerRef.value
      });
    });
  }

  // Enhanced getItems with automatic token refresh
  async getItems() {
    await this.ensureValidToken();

    return new Promise((resolve, reject) => {
      this.qbo.findItems({
        Type: 'Service'
      }, async (err, items) => {
        if (err) {
          // If token expired during call, refresh and retry once
          if (err.message && err.message.includes('unauthorized')) {
            try {
              await this.refreshToken();
              // Retry the items fetch
              this.qbo.findItems({
                Type: 'Service'
              }, (retryErr, retryItems) => {
                if (retryErr) {
                  reject(retryErr);
                  return;
                }
                resolve(this.processItems(retryItems));
              });
            } catch (refreshError) {
              reject(refreshError);
            }
            return;
          }
          reject(err);
          return;
        }

        resolve(this.processItems(items));
      });
    });
  }

  // Add this method after getItems()
  async getTaxRates() {
    await this.ensureValidToken();

    return new Promise((resolve, reject) => {
      this.qbo.findTaxRates({}, async (err, taxRates) => {
        if (err) {
          // If token expired during call, refresh and retry once
          if (err.message && err.message.includes('unauthorized')) {
            try {
              await this.refreshToken();
              // Retry the tax rates fetch
              this.qbo.findTaxRates({}, (retryErr, retryTaxRates) => {
                if (retryErr) {
                  reject(retryErr);
                  return;
                }
                resolve(this.processTaxRates(retryTaxRates));
              });
            } catch (refreshError) {
              reject(refreshError);
            }
            return;
          }
          reject(err);
          return;
        }

        resolve(this.processTaxRates(taxRates));
      });
    });
  }

  // Add this method after getTaxRates()
  async getTaxCodes() {
    await this.ensureValidToken();

    return new Promise((resolve, reject) => {
      this.qbo.findTaxCodes({}, async (err, taxCodes) => {
        if (err) {
          // If token expired during call, refresh and retry once
          if (err.message && err.message.includes('unauthorized')) {
            try {
              await this.refreshToken();
              // Retry the tax codes fetch
              this.qbo.findTaxCodes({}, (retryErr, retryTaxCodes) => {
                if (retryErr) {
                  reject(retryErr);
                  return;
                }
                resolve(this.processTaxCodes(retryTaxCodes));
              });
            } catch (refreshError) {
              reject(refreshError);
            }
            return;
          }
          reject(err);
          return;
        }

        resolve(this.processTaxCodes(taxCodes));
      });
    });
  }

  // Helper method to process tax rates
  processTaxRates(taxRates) {
    let ratesArray = [];
    if (Array.isArray(taxRates)) {
      ratesArray = taxRates;
    } else if (taxRates && taxRates.TaxRate) {
      ratesArray = Array.isArray(taxRates.TaxRate) ? taxRates.TaxRate : [taxRates.TaxRate];
    } else if (taxRates && taxRates.QueryResponse && taxRates.QueryResponse.TaxRate) {
      ratesArray = Array.isArray(taxRates.QueryResponse.TaxRate) ? taxRates.QueryResponse.TaxRate : [taxRates.QueryResponse.TaxRate];
    }
    return ratesArray;
  }

  // Helper method to process tax codes
  processTaxCodes(taxCodes) {
    let codesArray = [];
    if (Array.isArray(taxCodes)) {
      codesArray = taxCodes;
    } else if (taxCodes && taxCodes.TaxCode) {
      codesArray = Array.isArray(taxCodes.TaxCode) ? taxCodes.TaxCode : [taxCodes.TaxCode];
    } else if (taxCodes && taxCodes.QueryResponse && taxCodes.QueryResponse.TaxCode) {
      codesArray = Array.isArray(taxCodes.QueryResponse.TaxCode) ? taxCodes.QueryResponse.TaxCode : [taxCodes.QueryResponse.TaxCode];
    }
    return codesArray;
  }

  // Helper method to process items
  processItems(items) {
    let itemsArray = [];
    if (Array.isArray(items)) {
      itemsArray = items;
    } else if (items && items.Item) {
      itemsArray = Array.isArray(items.Item) ? items.Item : [items.Item];
    } else if (items && items.QueryResponse && items.QueryResponse.Item) {
      itemsArray = Array.isArray(items.QueryResponse.Item) ? items.QueryResponse.Item : [items.QueryResponse.Item];
    }
    return itemsArray;
  }

  // Update existing estimate
  async updateEstimate(estimateId, quotationData) {
    console.log('Starting updateEstimate...');
    await this.ensureValidToken();
    
    return new Promise((resolve, reject) => {
      // First, try to find existing customer by email
      this.qbo.findCustomers({
        PrimaryEmailAddr: quotationData.email
      }, async (findErr, customers) => {
        if (findErr) {
          console.error('Error finding customer:', findErr);
          reject(findErr);
          return;
        }

        let customer = null;
        
        // Check if customer exists
        if (customers && customers.QueryResponse && customers.QueryResponse.Customer) {
          const customerList = Array.isArray(customers.QueryResponse.Customer) 
            ? customers.QueryResponse.Customer 
            : [customers.QueryResponse.Customer];
          
          if (customerList.length > 0) {
            customer = customerList[0];
            console.log('Found existing customer:', customer.Id);
          }
        }

        // If customer doesn't exist, create new one
        if (!customer) {
          console.log('Creating new customer...');
          const customerData = {
            GivenName: quotationData.first_name,
            FamilyName: quotationData.last_name,
            PrimaryEmailAddr: {
              Address: quotationData.email
            },
            PrimaryPhone: {
              FreeFormNumber: quotationData.phone_number
            }
          };

          if (quotationData.company_name) {
            customerData.CompanyName = quotationData.company_name;
          }

          this.qbo.createCustomer(customerData, async (err, newCustomer) => {
            if (err) {
              console.error('Error creating customer:', err);
              reject(err);
              return;
            }

            console.log('Customer created successfully:', newCustomer.Id);
            this.updateEstimateOnly(estimateId, newCustomer, quotationData, resolve, reject);
          });
        } else {
          console.log('Found existing customer, updating customer info...');
          
          // Update the existing customer with new information
          const updatedCustomerData = {
            Id: customer.Id,
            SyncToken: customer.SyncToken,
            GivenName: quotationData.first_name,
            FamilyName: quotationData.last_name,
            PrimaryEmailAddr: {
              Address: quotationData.email
            },
            PrimaryPhone: {
              FreeFormNumber: quotationData.phone_number
            }
          };

          if (quotationData.company_name) {
            updatedCustomerData.CompanyName = quotationData.company_name;
            updatedCustomerData.PrintOnCheckName = quotationData.company_name;
          }

          console.log('Updating customer with data:', JSON.stringify(updatedCustomerData, null, 2));

          this.qbo.updateCustomer(updatedCustomerData, (updateErr, updatedCustomer) => {
            if (updateErr) {
              console.error('Error updating customer:', updateErr);
              // If customer update fails, still proceed with estimate update using original customer
              console.log('Proceeding with estimate update using original customer data...');
              this.updateEstimateOnly(estimateId, customer, quotationData, resolve, reject);
            } else {
              console.log('Customer updated successfully:', updatedCustomer.Id);
              this.updateEstimateOnly(estimateId, updatedCustomer, quotationData, resolve, reject);
            }
          });
        }
      });
    });
  }

  // Helper method to update estimate only
  updateEstimateOnly(estimateId, customer, quotationData, resolve, reject) {
    console.log('=== UPDATE ESTIMATE DEBUG ===');
    console.log('Estimate ID:', estimateId);
    console.log('Customer:', customer.Id);
    console.log('Quotation data:', JSON.stringify(quotationData, null, 2));
    
    // Create separate line items for each permit request
    const lineItems = [];
    
    if (quotationData.permit_requests && quotationData.permit_requests.length > 0) {
      console.log('Processing permit requests...');
      
      quotationData.permit_requests.forEach((permit, index) => {
        console.log(`Processing permit ${index + 1}:`, permit);
        
        if (permit.permit_type) {
          const lineItem = {
            DetailType: 'SalesItemLineDetail',
            Amount: permit.permit_type.price || 5000,
            Description: permit.permit_type.name || 'Permit Service',
            SalesItemLineDetail: {
              ItemRef: { value: permit.permit_type.quickbooks_item_id || '29' },
              Qty: 1,
              UnitPrice: permit.permit_type.price || 5000,
              TaxCodeRef: { value: '6' }
            }
          };
          
          console.log(`Created line item ${index + 1}:`, lineItem);
          lineItems.push(lineItem);
        } else if (permit.custom_name) {
          const lineItem = {
            DetailType: 'SalesItemLineDetail',
            Amount: 5000,
            Description: permit.custom_name,
            SalesItemLineDetail: {
              ItemRef: { value: '29' },
              Qty: 1,
              UnitPrice: 5000,
              TaxCodeRef: { value: '6' }
            }
          };
          
          console.log(`Created custom line item ${index + 1}:`, lineItem);
          lineItems.push(lineItem);
        }
      });
    }

    console.log('Total line items created:', lineItems.length);

    // If no permit requests, create a default line item
    if (lineItems.length === 0) {
      console.log('No permit requests found, creating default line item');
      lineItems.push({
        DetailType: 'SalesItemLineDetail',
        Amount: 5000,
        Description: 'Environmental Consulting Services',
        SalesItemLineDetail: {
          ItemRef: { value: '29' },
          Qty: 1,
          UnitPrice: 5000,
          TaxCodeRef: { value: '6' }
        }
      });
    }

    const estimateData = {
      CustomerRef: { value: customer.Id },
      Line: lineItems
    };

    console.log('Final estimate data:', JSON.stringify(estimateData, null, 2));
    console.log('=== END UPDATE ESTIMATE DEBUG ===');

    // First get the existing estimate to get the SyncToken
    this.qbo.getEstimate(estimateId, (getErr, existingEstimate) => {
      if (getErr) {
        console.error('Error fetching existing estimate:', getErr);
        reject(getErr);
        return;
      }

      console.log('Existing estimate SyncToken:', existingEstimate.SyncToken);

      // Add required fields for update
      estimateData.Id = estimateId;
      estimateData.SyncToken = existingEstimate.SyncToken;

      console.log('Updated estimate data with Id and SyncToken:', JSON.stringify(estimateData, null, 2));

      // Update the estimate
      this.qbo.updateEstimate(estimateData, async (err, estimate) => {
      if (err) {
        console.log('Error updating estimate:', err.message);
        
        // If token expired during call, refresh and retry once
        if (err.message && err.message.includes('unauthorized')) {
          try {
            await this.refreshToken();
            // Retry the estimate update
            this.qbo.updateEstimate(estimateId, estimateData, (retryErr, retryEstimate) => {
              if (retryErr) {
                reject(retryErr);
                return;
              }
              resolve({
                estimateId: retryEstimate.Id,
                estimateNumber: retryEstimate.DocNumber,
                totalAmount: retryEstimate.TotalAmt,
                customerId: retryEstimate.CustomerRef.value
              });
            });
          } catch (refreshError) {
            reject(refreshError);
          }
          return;
        }
        reject(err);
        return;
      }

      resolve({
        estimateId: estimate.Id,
        estimateNumber: estimate.DocNumber,
        totalAmount: estimate.TotalAmt,
        customerId: estimate.CustomerRef.value
      });
      });
    });
  }

  // Delete estimate from QuickBooks
  async deleteEstimate(estimateId) {
    console.log('Starting deleteEstimate...');
    await this.ensureValidToken();
    
    return new Promise((resolve, reject) => {
      // First get the existing estimate to get the SyncToken
      this.qbo.getEstimate(estimateId, (getErr, existingEstimate) => {
        if (getErr) {
          // Check if estimate doesn't exist (already deleted)
          if (getErr.Fault && getErr.Fault.Error && 
              getErr.Fault.Error.some(error => error.code === "610" && error.Message === "Object Not Found")) {
            console.log(`📝 Estimate ${estimateId} was already deleted from QuickBooks - treating as success`);
            resolve({
              estimateId: estimateId,
              deleted: true,
              wasAlreadyDeleted: true
            });
            return;
          }
          console.error('Error fetching estimate for deletion:', getErr);
          reject(getErr);
          return;
        }

        console.log('Found estimate to delete:', estimateId, 'SyncToken:', existingEstimate.SyncToken);

        // Delete the estimate using the SyncToken
        const deleteEstimateData = {
          Id: estimateId,
          SyncToken: existingEstimate.SyncToken
        };
        
        this.qbo.deleteEstimate(deleteEstimateData, (deleteErr, deletedEstimate) => {
          if (deleteErr) {
            console.log('Error deleting estimate:', deleteErr.message);
            
            // If token expired during call, refresh and retry once
            if (deleteErr.message && deleteErr.message.includes('unauthorized')) {
              this.refreshToken().then(() => {
                // Retry the estimate deletion
                this.qbo.deleteEstimate(deleteEstimateData, (retryErr, retryResult) => {
                  if (retryErr) {
                    reject(retryErr);
                    return;
                  }
                  resolve({
                    estimateId: estimateId,
                    deleted: true
                  });
                });
              }).catch(refreshError => {
                reject(refreshError);
              });
              return;
            }
            reject(deleteErr);
            return;
          }

          console.log('Estimate deleted successfully:', estimateId);
          resolve({
            estimateId: estimateId,
            deleted: true
          });
        });
      });
    });
  }

  // Send existing estimate to customer
  async sendExistingEstimate(estimateId, customerEmail) {
    console.log('📧 Starting sendExistingEstimate...');
    await this.ensureValidToken();
    
    return new Promise((resolve, reject) => {
      // Use sendEstimatePdf method which is available in node-quickbooks
      this.qbo.sendEstimatePdf(estimateId, customerEmail, async (err, response) => {
        if (err) {
          console.log('Error sending estimate PDF:', err.message);
          
          // If token expired during call, refresh and retry once
          if (err.message && err.message.includes('unauthorized')) {
            try {
              await this.refreshToken();
              // Retry sending the estimate
              this.qbo.sendEstimatePdf(estimateId, customerEmail, (retryErr, retryResponse) => {
                if (retryErr) {
                  reject(retryErr);
                  return;
                }
                resolve({
                  estimateId: estimateId,
                  sent: true,
                  sentTo: customerEmail
                });
              });
            } catch (refreshError) {
              reject(refreshError);
            }
            return;
          }
          reject(err);
          return;
        }

        console.log('📧 Estimate PDF sent successfully to:', customerEmail);
        resolve({
          estimateId: estimateId,
          sent: true,
          sentTo: customerEmail
        });
      });
    });
  }

  // Get connection status
  async getConnectionStatus() {
    try {
      await this.ensureValidToken();
      return {
        connected: true,
        realmId: this.tokens.realmId,
        expiresAt: new Date(this.tokens.createdAt.getTime() + this.tokens.expires_in * 1000)
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Update estimate status in QuickBooks (mark as sent)
   * @param {string} estimateId - The QuickBooks estimate ID
   * @returns {Promise<Object>} - Result of the operation
   */
  async markEstimateAsSent(estimateId) {
    console.log('📧 Marking QuickBooks estimate as sent:', estimateId);
    await this.ensureValidToken();
    
    return new Promise((resolve, reject) => {
      // First get the existing estimate to get the SyncToken
      this.qbo.getEstimate(estimateId, (getErr, existingEstimate) => {
        if (getErr) {
          console.error('Error fetching existing estimate:', getErr);
          reject(getErr);
          return;
        }

        console.log('Existing estimate SyncToken:', existingEstimate.SyncToken);

        // Create update data with EmailStatus set to "EmailSent"
        const updateData = {
          Id: estimateId,
          SyncToken: existingEstimate.SyncToken,
          EmailStatus: "EmailSent"
        };

        // Update the estimate status
        this.qbo.updateEstimate(updateData, async (err, updatedEstimate) => {
          if (err) {
            console.log('Error updating estimate status:', err.message);
            
            // If token expired during call, refresh and retry once
            if (err.message && err.message.includes('unauthorized')) {
              try {
                await this.refreshToken();
                // Retry the estimate update
                this.qbo.updateEstimate(updateData, (retryErr, retryEstimate) => {
                  if (retryErr) {
                    reject(retryErr);
                    return;
                  }
                  resolve({
                    estimateId: retryEstimate.Id,
                    emailStatus: retryEstimate.EmailStatus || 'EmailSent',
                    success: true
                  });
                });
              } catch (refreshError) {
                reject(refreshError);
              }
              return;
            }
            reject(err);
            return;
          }

          console.log('✅ QuickBooks estimate marked as sent:', estimateId);
          resolve({
            estimateId: updatedEstimate.Id,
            emailStatus: updatedEstimate.EmailStatus || 'EmailSent',
            success: true
          });
        });
      });
    });
  }
  
  /**
   * Update estimate status in QuickBooks when customer responds
   * @param {string} estimateId - The QuickBooks estimate ID
   * @param {string} action - The action ('approve' or 'decline')
   * @returns {Promise<Object>} - Result of the operation
   */
  async updateEstimateStatus(estimateId, action) {
    console.log(`📊 Updating QuickBooks estimate status to ${action}:`, estimateId);
    await this.ensureValidToken();
    
    return new Promise((resolve, reject) => {
      // First get the existing estimate to get the SyncToken
      this.qbo.getEstimate(estimateId, (getErr, existingEstimate) => {
        if (getErr) {
          console.error('Error fetching existing estimate:', getErr);
          reject(getErr);
          return;
        }

        console.log('Existing estimate SyncToken:', existingEstimate.SyncToken);

        // Create update data
        const updateData = {
          Id: estimateId,
          SyncToken: existingEstimate.SyncToken
        };
        
        // Set the appropriate status based on action
        if (action === 'approve') {
          updateData.TxnStatus = 'Accepted';
        } else if (action === 'decline') {
          updateData.TxnStatus = 'Rejected';
        }

        // Update the estimate status
        this.qbo.updateEstimate(updateData, async (err, updatedEstimate) => {
          if (err) {
            console.log('Error updating estimate status:', err.message);
            
            // If token expired during call, refresh and retry once
            if (err.message && err.message.includes('unauthorized')) {
              try {
                await this.refreshToken();
                // Retry the estimate update
                this.qbo.updateEstimate(updateData, (retryErr, retryEstimate) => {
                  if (retryErr) {
                    reject(retryErr);
                    return;
                  }
                  resolve({
                    estimateId: retryEstimate.Id,
                    txnStatus: retryEstimate.TxnStatus,
                    success: true
                  });
                });
              } catch (refreshError) {
                reject(refreshError);
              }
              return;
            }
            reject(err);
            return;
          }

          console.log(`✅ QuickBooks estimate marked as ${action}ed:`, estimateId);
          resolve({
            estimateId: updatedEstimate.Id,
            txnStatus: updatedEstimate.TxnStatus,
            success: true
          });
        });
      });
    });
  }
}

module.exports = new QuickBooksService(); 
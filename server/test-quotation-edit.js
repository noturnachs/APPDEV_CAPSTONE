const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testQuotationEdit() {
  try {
    console.log('🧪 Testing Quotation Edit Functionality...\n');

    // 1. Create a new quotation (without permits first)
    console.log('1. Creating new quotation...');
    const createResponse = await axios.post(`${BASE_URL}/quotations`, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+1234567890',
      company: 'Test Company Inc.',
      serviceType: 'permit-acquisition',
      projectDescription: 'Test quotation for permit acquisition services',
      permitTypes: [],
      customPermits: 'Custom Environmental Permit'
    });

    const quotationId = createResponse.data.quotation.id;
    console.log(`✅ Quotation created with ID: ${quotationId}\n`);

    // 2. Get the quotation
    console.log('2. Fetching quotation...');
    const getResponse = await axios.get(`${BASE_URL}/quotations/${quotationId}`);
    console.log('✅ Quotation fetched successfully\n');

    // 3. Update the quotation (basic fields only)
    console.log('3. Updating quotation...');
    const updateData = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@test.com',
      phone_number: '+1234567890',
      company_name: 'Test Company Inc.',
      service_type: 'permit_acquisition',
      description: 'Updated test quotation for permit acquisition services',
      status: 'approved'
    };

    const updateResponse = await axios.put(`${BASE_URL}/quotations/${quotationId}`, updateData);
    console.log('✅ Quotation updated successfully\n');

    // 4. Add a predefined permit (using ID 32 from available permits)
    console.log('4. Adding predefined permit to quotation...');
    const addPermitResponse = await axios.post(`${BASE_URL}/quotations/${quotationId}/permits`, {
      permit_type_id: 32, // Using ID 32 from available permits
      custom_name: null
    });
    console.log('✅ Predefined permit added successfully\n');

    // 5. Get quotation permits
    console.log('5. Fetching quotation permits...');
    const quotationPermitsResponse = await axios.get(`${BASE_URL}/quotations/${quotationId}/permits`);
    console.log('✅ Quotation permits fetched successfully\n');

    // 6. Remove a permit from the quotation
    if (quotationPermitsResponse.data.permits.length > 0) {
      const permitToRemove = quotationPermitsResponse.data.permits[0].id;
      console.log(`6. Removing permit ${permitToRemove} from quotation...`);
      const removePermitResponse = await axios.delete(`${BASE_URL}/quotations/${quotationId}/permits/${permitToRemove}`);
      console.log('✅ Permit removed successfully\n');
    }

    // 7. Final quotation state
    console.log('7. Final quotation state...');
    const finalResponse = await axios.get(`${BASE_URL}/quotations/${quotationId}`);
    console.log('✅ Final quotation state:', JSON.stringify(finalResponse.data.quotation, null, 2));

    console.log('\n🎉 All tests passed! Quotation editing functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testQuotationEdit(); 
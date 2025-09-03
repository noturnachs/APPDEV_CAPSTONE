const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function checkPermits() {
  try {
    console.log('🔍 Checking available permits...\n');
    
    const response = await axios.get(`${BASE_URL}/quotations/available-permits`);
    const permits = response.data.permits;
    
    if (!permits || permits.length === 0) {
      console.log('❌ No permits found in database');
      return;
    }
    
    console.log(`✅ Found ${permits.length} agencies with permits:\n`);
    
    permits.forEach(agency => {
      console.log(`🏛️  Agency: ${agency.agency.name}`);
      agency.permits.forEach(permit => {
        console.log(`  ID: ${permit.id} | Name: ${permit.name} | Price: ₱${permit.price || 'N/A'} | Time: ${permit.time_estimate || 'N/A'}`);
      });
      console.log('');
    });
    
    // Get the first permit ID for testing
    const firstPermitId = permits[0]?.permits[0]?.id;
    if (firstPermitId) {
      console.log(`🎯 Use ID ${firstPermitId} for testing`);
    }
    
  } catch (error) {
    console.error('❌ Error checking permits:', error.response?.data || error.message);
  }
}

checkPermits(); 
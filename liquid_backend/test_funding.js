// test_funding.js - Test funding rate endpoint
const LiquidTradingClient = require('./js_client');

async function testFundingRate() {
    console.log('🔄 Testing Funding Rate Endpoint...');
    
    try {
        // Test via API endpoint
        const response = await fetch('http://localhost:8000/api/ticker/BTC-PERP');
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Funding Rate Data:');
            console.log(`   Symbol: ${data.data.symbol}`);
            console.log(`   Mark Price: $${data.data.mark_price}`);
            console.log(`   Funding Rate: ${data.data.funding_rate ? (data.data.funding_rate * 100).toFixed(6) + '%' : 'N/A'}`);
            console.log(`   24h Volume: ${data.data.volume_24h || 'N/A'}`);
            console.log(`   24h Change: ${data.data.change_24h || 'N/A'}`);
        } else {
            console.log('❌ API Error:', data.error);
        }
        
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

// Run the test
if (require.main === module) {
    testFundingRate();
}

module.exports = testFundingRate;

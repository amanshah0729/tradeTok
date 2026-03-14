#!/usr/bin/env node

const API_BASE = 'http://localhost:8000';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    console.log(`🔄 ${method} ${endpoint}`);
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (response.ok) {
            console.log(`✅ Success:`, result);
            return result;
        } else {
            console.log(`❌ Error (${response.status}):`, result);
            return { error: result };
        }
    } catch (error) {
        console.log(`💥 Network Error:`, error.message);
        return { error: error.message };
    }
}

// Helper function to wait/pause
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCompleteTest() {
    console.log('🚀 Starting Complete API Test Suite');
    console.log('=====================================\n');

    // 1. Test server status
    console.log('1️⃣ Testing Server Status...');
    await apiCall('/');
    await sleep(1000);

    // 2. Get account balance
    console.log('\n2️⃣ Getting Account Balance...');
    const balanceResult = await apiCall('/api/balance');
    await sleep(1000);

    // 3. Get current positions
    console.log('\n3️⃣ Getting Current Positions...');
    const positionsResult = await apiCall('/api/positions');
    await sleep(1000);

    // 4. Check market data
    console.log('\n4️⃣ Checking BTC-PERP Market Data...');
    await apiCall('/api/market/BTC-PERP');
    await sleep(1000);

    // 5. Check all markets
    console.log('\n5️⃣ Getting All Markets...');
    await apiCall('/api/markets');
    await sleep(1000);

    // 6. Place a small test order (with confirmation)
    console.log('\n6️⃣ Testing Order Placement...');
    console.log('⚠️  This will place a REAL $15 BTC order!');
    
    // Uncomment the lines below if you want to actually place an order
    // const confirmOrder = true; // Set to true to actually place order
    const confirmOrder = true; // Set to true to actually place order
    
    if (confirmOrder) {
        const orderData = {
            symbol: 'BTC-PERP',
            side: 'buy',
            type: 'market',
            size: 15, // $15 USD
            leverage: 1
        };
        
        const orderResult = await apiCall('/api/place-order', 'POST', orderData);
        
        if (orderResult.success) {
            console.log('\n💰 Order placed successfully! Waiting 5 seconds before checking positions...');
            await sleep(5000);
            
            // 7. Check positions after order
            console.log('\n7️⃣ Checking Positions After Order...');
            const newPositions = await apiCall('/api/positions');
            
            // 8. Close the position we just opened (if it exists)
            if (newPositions.success && newPositions.data.positions.length > 0) {
                console.log('\n8️⃣ Closing the BTC-PERP Position...');
                const closeResult = await apiCall('/api/close-position', 'POST', { 
                    symbol: 'BTC-PERP' 
                });
                
                if (closeResult.success) {
                    console.log('✅ Position closed successfully!');
                    await sleep(2000);
                    
                    // 9. Final position check
                    console.log('\n9️⃣ Final Position Check...');
                    await apiCall('/api/positions');
                }
            }
        }
    } else {
        console.log('🔒 Order placement skipped (confirmOrder = false)');
        console.log('💡 To test order placement, set confirmOrder = true in the script');
    }

    // Alternative: Test close all positions (commented out for safety)
    /*
    console.log('\n🔥 Testing Close All Positions (DANGEROUS!)...');
    const closeAllResult = await apiCall('/api/close-all-positions', 'POST');
    */

    console.log('\n🎉 API Test Suite Complete!');
    console.log('=====================================');
}

// Run the test if this script is executed directly
if (require.main === module) {
    runCompleteTest().catch(console.error);
}

module.exports = { apiCall, runCompleteTest };

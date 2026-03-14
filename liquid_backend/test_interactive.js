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

    console.log(`\n🔄 ${method} ${endpoint}`);
    if (data) {
        console.log(`📤 Request data:`, JSON.stringify(data, null, 2));
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        console.log(`📊 Response Status: ${response.status}`);
        console.log(`📦 Response Data:`, JSON.stringify(result, null, 2));
        
        return result;
    } catch (error) {
        console.log(`💥 Network Error:`, error.message);
        return { error: error.message };
    }
}

// Individual test functions
async function testServerStatus() {
    console.log('🔍 Testing Server Status...');
    return await apiCall('/');
}

async function testGetBalance() {
    console.log('💰 Testing Get Balance...');
    return await apiCall('/api/balance');
}

async function testGetPositions() {
    console.log('📈 Testing Get Positions...');
    return await apiCall('/api/positions');
}

async function testGetMarket(symbol = 'BTC-PERP') {
    console.log(`📊 Testing Get Market Data for ${symbol}...`);
    return await apiCall(`/api/market/${symbol}`);
}

async function testGetAllMarkets() {
    console.log('🌍 Testing Get All Markets...');
    return await apiCall('/api/markets');
}

async function testPlaceOrder(symbol = 'BTC-PERP', side = 'buy', size = 15) {
    console.log(`🎯 Testing Place Order - ${side} ${size} USD of ${symbol}...`);
    const orderData = {
        symbol,
        side,
        type: 'market',
        size,
        leverage: 1
    };
    return await apiCall('/api/place-order', 'POST', orderData);
}

async function testClosePosition(symbol = 'BTC-PERP') {
    console.log(`❌ Testing Close Position for ${symbol}...`);
    return await apiCall('/api/close-position', 'POST', { symbol });
}

async function testCloseAllPositions() {
    console.log('💥 Testing Close All Positions...');
    return await apiCall('/api/close-all-positions', 'POST');
}

// Interactive menu
function showMenu() {
    console.log('\n🎮 Interactive API Tester');
    console.log('========================');
    console.log('1. Test Server Status');
    console.log('2. Get Balance');
    console.log('3. Get Positions');
    console.log('4. Get BTC-PERP Market Data');
    console.log('5. Get All Markets');
    console.log('6. Place Test Order ($15 BTC) ⚠️');
    console.log('7. Close BTC-PERP Position ⚠️');
    console.log('8. Close ALL Positions 🚨');
    console.log('9. Run Full Test Suite');
    console.log('0. Exit');
    console.log('========================');
}

async function runInteractive() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    };

    while (true) {
        showMenu();
        const choice = await question('\nEnter your choice (0-9): ');

        switch (choice) {
            case '1':
                await testServerStatus();
                break;
            case '2':
                await testGetBalance();
                break;
            case '3':
                await testGetPositions();
                break;
            case '4':
                await testGetMarket();
                break;
            case '5':
                await testGetAllMarkets();
                break;
            case '6':
                const confirmOrder = await question('⚠️  This places a REAL $15 order! Type "YES" to confirm: ');
                if (confirmOrder === 'YES') {
                    await testPlaceOrder();
                } else {
                    console.log('❌ Order cancelled');
                }
                break;
            case '7':
                const confirmClose = await question('⚠️  This closes your BTC-PERP position! Type "YES" to confirm: ');
                if (confirmClose === 'YES') {
                    await testClosePosition();
                } else {
                    console.log('❌ Close cancelled');
                }
                break;
            case '8':
                const confirmCloseAll = await question('🚨 This closes ALL positions! Type "YES I UNDERSTAND" to confirm: ');
                if (confirmCloseAll === 'YES I UNDERSTAND') {
                    await testCloseAllPositions();
                } else {
                    console.log('❌ Close all cancelled');
                }
                break;
            case '9':
                console.log('🚀 Running full test suite (without orders)...');
                await testServerStatus();
                await testGetBalance();
                await testGetPositions();
                await testGetMarket();
                await testGetAllMarkets();
                console.log('✅ Read-only tests complete!');
                break;
            case '0':
                console.log('👋 Goodbye!');
                rl.close();
                return;
            default:
                console.log('❌ Invalid choice. Please try again.');
        }

        await question('\nPress Enter to continue...');
    }
}

// Check if running directly or being imported
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Interactive mode
        runInteractive().catch(console.error);
    } else {
        // Command line mode
        const command = args[0];
        switch (command) {
            case 'status':
                testServerStatus();
                break;
            case 'balance':
                testGetBalance();
                break;
            case 'positions':
                testGetPositions();
                break;
            case 'market':
                testGetMarket(args[1] || 'BTC-PERP');
                break;
            case 'markets':
                testGetAllMarkets();
                break;
            default:
                console.log('Usage: node test_interactive.js [command]');
                console.log('Commands: status, balance, positions, market, markets');
                console.log('Or run without arguments for interactive mode');
        }
    }
}

module.exports = {
    testServerStatus,
    testGetBalance,
    testGetPositions,
    testGetMarket,
    testGetAllMarkets,
    testPlaceOrder,
    testClosePosition,
    testCloseAllPositions
};

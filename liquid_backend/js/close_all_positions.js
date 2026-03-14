// close_all_positions.js - Close all positions via API
const LiquidTradingClient = require('../js_client');

async function closeAllPositions(params = {}) {
    const client = new LiquidTradingClient();
    
    // Parse command line arguments or use params
    const args = process.argv.slice(2);
    const closeParams = { ...params };
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        
        if (key === 'confirm') {
            closeParams[key] = value === 'true';
        }
    }
    
    const { confirm = false } = closeParams;

    console.log('🔄 Close All Positions');
    console.log('='.repeat(40));

    try {
        // First, get current positions to show user what will be closed
        const positions = await client.getPositions();
        
        if (!positions.positions || positions.positions.length === 0) {
            console.log('📍 No open positions to close');
            return { closed: 0, failed: 0, results: [] };
        }

        console.log(`📍 Found ${positions.count} open position(s):`);
        console.log(`📊 Total Unrealized P&L: $${positions.total_pnl}`);
        console.log('');
        
        // Show all positions that will be closed
        positions.positions.forEach((pos, index) => {
            const status = (pos.pnl && pos.pnl >= 0) ? '🟢' : '🔴';
            console.log(`   ${index + 1}. ${status} ${pos.symbol} ${pos.side.toUpperCase()} ${pos.size} @ $${pos.entry_price}`);
            if (pos.pnl !== null) {
                console.log(`      P&L: $${pos.pnl} (${pos.pnl_percentage >= 0 ? '+' : ''}${pos.pnl_percentage}%)`);
            }
        });

        if (!confirm) {
            console.log('\n🚨 WARNING: This will close ALL positions!');
            console.log(`💰 This will realize a total P&L of $${positions.total_pnl}`);
            console.log(`📊 ${positions.count} position(s) will be closed`);
            console.log('\nTo close all positions, add --confirm true');
            return null;
        }

        console.log(`\n🚀 Closing all ${positions.count} positions...`);
        
        const result = await client.closeAllPositions();

        console.log('\n📊 Closing Summary:');
        console.log(`   ✅ Successful: ${result.closed}/${result.total}`);
        console.log(`   ❌ Failed: ${result.failed}/${result.total}`);

        if (result.results && result.results.length > 0) {
            console.log('\n📋 Detailed Results:');
            result.results.forEach(res => {
                if (res.success) {
                    console.log(`   ✅ ${res.symbol}: Order ${res.order_id} (${res.status})`);
                } else {
                    console.log(`   ❌ ${res.symbol}: ${res.error}`);
                }
            });
        }

        if (result.closed === result.total) {
            console.log('\n🎉 All positions successfully closed!');
        } else if (result.closed > 0) {
            console.log(`\n⚠️  ${result.failed} positions failed to close. Check manually.`);
        }

        return result;
    } catch (error) {
        console.error('❌ Error in bulk position closing:', error.message);
        return null;
    }
}

function showUsage() {
    console.log('\nUsage: node js/close_all_positions.js [options]');
    console.log('\nOptions:');
    console.log('  --confirm true        Confirm closing all positions');
    console.log('\nExample:');
    console.log('  node js/close_all_positions.js --confirm true');
    console.log('\n🚨 WARNING: This will close ALL open positions!');
}

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        showUsage();
    } else {
        closeAllPositions();
    }
}

module.exports = closeAllPositions;

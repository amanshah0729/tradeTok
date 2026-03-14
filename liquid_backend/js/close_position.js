// close_position.js - Close specific position via API
const LiquidTradingClient = require('../js_client');

async function closePosition(params = {}) {
    const client = new LiquidTradingClient();
    
    // Parse command line arguments or use params
    const args = process.argv.slice(2);
    const closeParams = { ...params };
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        
        if (key === 'size') {
            closeParams[key] = parseFloat(value);
        } else if (key === 'confirm') {
            closeParams[key] = value === 'true';
        } else {
            closeParams[key] = value;
        }
    }
    
    const {
        symbol,
        size = null,
        confirm = false
    } = closeParams;

    console.log('🔄 Position Closing');
    console.log('='.repeat(40));

    if (!symbol) {
        console.log('❌ Error: Symbol parameter is required');
        showUsage();
        return;
    }

    try {
        // Get current positions to show details
        const positions = await client.getPositions();
        const targetPosition = positions.positions?.find(pos => pos.symbol === symbol);

        if (!targetPosition) {
            console.log(`❌ No open position found for ${symbol}`);
            return null;
        }

        console.log('📍 Current Position:');
        console.log(`   Symbol: ${targetPosition.symbol}`);
        console.log(`   Side: ${targetPosition.side.toUpperCase()}`);
        console.log(`   Size: ${targetPosition.size}`);
        console.log(`   Entry Price: $${targetPosition.entry_price}`);
        
        if (targetPosition.current_price && targetPosition.pnl !== null) {
            console.log(`   Current Price: $${targetPosition.current_price}`);
            console.log(`   Unrealized P&L: $${targetPosition.pnl} (${targetPosition.pnl_percentage >= 0 ? '+' : ''}${targetPosition.pnl_percentage}%)`);
        }

        console.log('\n🔄 Close Operation:');
        if (size) {
            console.log(`   Closing Size: ${size}`);
        } else {
            console.log(`   Closing: Full position`);
        }

        if (!confirm) {
            console.log('\n⚠️  WARNING: This will close your position!');
            if (targetPosition.pnl !== null) {
                const pnlText = targetPosition.pnl >= 0 ? 'profit' : 'loss';
                console.log(`💰 This will realize a ${pnlText} of $${Math.abs(targetPosition.pnl).toFixed(2)}`);
            }
            console.log('\nTo close this position, add --confirm true');
            return null;
        }

        console.log('\n🚀 Placing close order...');
        
        const result = await client.closePosition(symbol, size);

        console.log('✅ Position close order placed!');
        console.log(`   Order ID: ${result.order_id}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Symbol: ${result.symbol}`);
        console.log(`   Closed Size: ${result.closed_size}`);
        console.log(`   Close Price: $${result.close_price}`);

        return result;
    } catch (error) {
        console.error('❌ Error closing position:', error.message);
        return null;
    }
}

function showUsage() {
    console.log('\nUsage: node js/close_position.js [options]');
    console.log('\nOptions:');
    console.log('  --symbol BTC-PERP     Trading pair to close (REQUIRED)');
    console.log('  --size 0.5            Specific size to close (optional, defaults to full position)');
    console.log('  --confirm true        Confirm position closing');
    console.log('\nExamples:');
    console.log('  node js/close_position.js --symbol BTC-PERP --confirm true');
    console.log('  node js/close_position.js --symbol ETH-PERP --size 0.1 --confirm true');
}

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        showUsage();
    } else {
        closePosition();
    }
}

module.exports = closePosition;

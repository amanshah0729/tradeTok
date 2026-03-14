// place_order.js - Place trading orders via API
const LiquidTradingClient = require('../js_client');

async function placeOrder(params = {}) {
    const client = new LiquidTradingClient();
    
    // Parse command line arguments or use params
    const args = process.argv.slice(2);
    const orderParams = { ...params };
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        
        if (['size', 'leverage', 'price', 'takeProfitPrice', 'stopLossPrice'].includes(key)) {
            orderParams[key] = parseFloat(value);
        } else if (key === 'confirm') {
            orderParams[key] = value === 'true';
        } else {
            orderParams[key] = value;
        }
    }
    
    // Default values
    const {
        symbol = 'BTC-PERP',
        side,
        type = 'market',
        size = 25,
        leverage = 1,
        price = null,
        takeProfitPrice = null,
        stopLossPrice = null,
        confirm = false
    } = orderParams;

    console.log('🔄 Order Placement');
    console.log('='.repeat(40));

    // Validate required parameters
    if (!side) {
        console.log('❌ Error: Order side (buy/sell) is required');
        showUsage();
        return;
    }

    // Display order details
    console.log('📋 Order Details:');
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Side: ${side.toUpperCase()}`);
    console.log(`   Type: ${type.toUpperCase()}`);
    console.log(`   Size: $${size} USD`);
    console.log(`   Leverage: ${leverage}x`);
    if (type === 'limit' && price) {
        console.log(`   Price: $${price}`);
    }
    if (takeProfitPrice) {
        console.log(`   Take Profit: $${takeProfitPrice}`);
    }
    if (stopLossPrice) {
        console.log(`   Stop Loss: $${stopLossPrice}`);
    }

    if (!confirm) {
        console.log('\n⚠️  WARNING: This will place a REAL order!');
        console.log(`💰 You will risk $${size} USD on this trade.`);
        console.log('\nTo place this order, add --confirm true');
        return null;
    }

    try {
        console.log('\n🚀 Placing order...');
        
        const order = await client.placeOrder({
            symbol,
            side,
            type,
            size,
            leverage,
            price,
            takeProfitPrice,
            stopLossPrice
        });

        console.log('✅ Order placed successfully!');
        console.log(`   Order ID: ${order.order_id}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Symbol: ${order.symbol}`);
        console.log(`   Side: ${order.side}`);
        console.log(`   Size: $${order.size}`);

        return order;
    } catch (error) {
        console.error('❌ Order placement failed:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('minimum value')) {
            console.log('💡 Tip: Try increasing the order size to $25-50 USD');
        } else if (error.message.includes('insufficient')) {
            console.log('💡 Tip: Deposit more funds or reduce order size');
        }
        
        return null;
    }
}

function showUsage() {
    console.log('\nUsage: node js/place_order.js [options]');
    console.log('\nOptions:');
    console.log('  --symbol BTC-PERP          Trading pair');
    console.log('  --side buy|sell            Order side (REQUIRED)');
    console.log('  --type market|limit        Order type');
    console.log('  --size 25.0                USD notional size');
    console.log('  --leverage 1               Leverage multiplier');
    console.log('  --price 70000              Limit order price (optional)');
    console.log('  --takeProfitPrice 72000    Take profit price (optional)');
    console.log('  --stopLossPrice 68000      Stop loss price (optional)');
    console.log('  --confirm true             Confirm order placement');
    console.log('\nExamples:');
    console.log('  node js/place_order.js --side buy --size 25 --confirm true');
    console.log('  node js/place_order.js --symbol ETH-PERP --side sell --type limit --price 3000 --confirm true');
}

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        showUsage();
    } else {
        placeOrder();
    }
}

module.exports = placeOrder;

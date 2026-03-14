// check_market.js - Check market data via API
const LiquidTradingClient = require('../js_client');

async function checkMarket(params = {}) {
    const client = new LiquidTradingClient();
    
    // Parse command line arguments or use params
    const args = process.argv.slice(2);
    const marketParams = { ...params };
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        
        if (key === 'depth') {
            marketParams[key] = parseInt(value);
        } else {
            marketParams[key] = value;
        }
    }
    
    const {
        symbol = 'BTC-PERP',
        depth = 5
    } = marketParams;

    console.log(`📊 Market Data - ${symbol}`);
    console.log('='.repeat(50));

    try {
        const market = await client.checkMarket(symbol, depth);

        // Price Information
        console.log('📈 Price Information:');
        console.log(`   Mark Price: $${market.current_price.toLocaleString()}`);
        if (market.volume_24h) {
            console.log(`   24h Volume: $${parseFloat(market.volume_24h).toLocaleString()}`);
        }

        // Order Book
        if (market.orderbook) {
            console.log('\n📖 Order Book:');
            console.log('   Bids (Buy Orders):');
            market.orderbook.bids.forEach((bid, index) => {
                console.log(`     ${index + 1}. $${bid.price.toFixed(2)} - ${bid.size}`);
            });

            console.log('   Asks (Sell Orders):');
            market.orderbook.asks.forEach((ask, index) => {
                console.log(`     ${index + 1}. $${ask.price.toFixed(2)} - ${ask.size}`);
            });

            // Spread information
            if (market.spread) {
                console.log(`\n💰 Spread: $${market.spread.absolute} (${market.spread.percentage}%)`);
            }
        } else if (market.orderbook_error) {
            console.log('\n❌ Order book unavailable:', market.orderbook_error);
        }

        // Market Specifications
        if (market.specifications) {
            console.log('\n⚙️  Market Specifications:');
            const specs = market.specifications;
            if (specs.max_leverage) {
                console.log(`   Max Leverage: ${specs.max_leverage}x`);
            }
            if (specs.min_size) {
                console.log(`   Min Size: ${specs.min_size}`);
            }
            if (specs.tick_size) {
                console.log(`   Tick Size: ${specs.tick_size}`);
            }
        }

        // Trading Suggestions
        console.log('\n💡 Trading Suggestions:');
        console.log('   Order Size Examples:');
        const testSizes = [25, 50, 100, 250];
        testSizes.forEach(usdSize => {
            const coinAmount = usdSize / market.current_price;
            const coinSymbol = symbol.split('-')[0];
            console.log(`     $${usdSize} USD = ${coinAmount.toFixed(6)} ${coinSymbol}`);
        });

        console.log('\n   Recommended Order Sizes:');
        console.log('     Conservative: $25-50 USD');
        console.log('     Moderate: $50-100 USD');
        console.log('     Aggressive: $100+ USD');

        console.log('\n✅ Market check completed!');

        return market;
    } catch (error) {
        console.error('❌ Error checking market:', error.message);
        return null;
    }
}

async function getAllMarkets() {
    const client = new LiquidTradingClient();
    
    try {
        console.log('📋 Fetching all available markets...');
        const data = await client.getMarkets();
        
        console.log(`📊 Found ${data.count} markets:`);
        console.log('');
        
        // Group by category or show top markets
        const popularMarkets = data.markets.filter(m => 
            m.symbol.includes('BTC') || 
            m.symbol.includes('ETH') || 
            m.symbol.includes('ADA') ||
            m.symbol.includes('SOL')
        );
        
        if (popularMarkets.length > 0) {
            console.log('🔥 Popular Markets:');
            popularMarkets.forEach(market => {
                console.log(`   ${market.symbol} - Max Leverage: ${market.max_leverage || 'N/A'}x`);
            });
            console.log('');
        }
        
        console.log('📋 All Markets:');
        data.markets.slice(0, 20).forEach(market => {
            console.log(`   ${market.symbol} - Max Leverage: ${market.max_leverage || 'N/A'}x`);
        });
        
        if (data.markets.length > 20) {
            console.log(`   ... and ${data.markets.length - 20} more markets`);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error fetching markets:', error.message);
        return null;
    }
}

function showUsage() {
    console.log('\nUsage: node js/check_market.js [options]');
    console.log('\nOptions:');
    console.log('  --symbol BTC-PERP     Trading pair to check (default: BTC-PERP)');
    console.log('  --depth 5             Order book depth (default: 5)');
    console.log('  --all                 Show all available markets');
    console.log('\nExamples:');
    console.log('  node js/check_market.js');
    console.log('  node js/check_market.js --symbol ETH-PERP');
    console.log('  node js/check_market.js --symbol ADA-PERP --depth 10');
    console.log('  node js/check_market.js --all');
}

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    // Check if user wants all markets
    if (args.includes('--all')) {
        getAllMarkets();
    } else if (args.length === 0) {
        // Default to BTC-PERP
        checkMarket();
    } else if (args.includes('--help') || args.includes('-h')) {
        showUsage();
    } else {
        checkMarket();
    }
}

module.exports = { checkMarket, getAllMarkets };

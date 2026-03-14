// get_positions.js - Get open positions via API
const LiquidTradingClient = require('../js_client');

async function getPositions() {
    const client = new LiquidTradingClient();
    
    try {
        console.log('📍 Fetching open positions...');
        const data = await client.getPositions();
        
        if (!data.positions || data.positions.length === 0) {
            console.log('   No open positions');
            return [];
        }

        console.log(`📍 Found ${data.count} position(s):`);
        console.log(`📊 Total Unrealized P&L: $${data.total_pnl}`);
        console.log('');
        
        data.positions.forEach(pos => {
            const status = (pos.pnl && pos.pnl >= 0) ? '🟢' : '🔴';
            console.log(`   ${status} ${pos.symbol}`);
            console.log(`      Side: ${pos.side.toUpperCase()}`);
            console.log(`      Size: ${pos.size}`);
            console.log(`      Entry: $${pos.entry_price}`);
            
            if (pos.current_price) {
                console.log(`      Current: $${pos.current_price}`);
                console.log(`      P&L: $${pos.pnl} (${pos.pnl_percentage >= 0 ? '+' : ''}${pos.pnl_percentage}%)`);
            } else {
                console.log(`      Status: ${pos.error || 'Price unavailable'}`);
            }
            console.log('');
        });
        
        return data;
    } catch (error) {
        console.error('❌ Error fetching positions:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    getPositions();
}

module.exports = getPositions;

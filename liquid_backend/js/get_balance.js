// get_balance.js - Get account balance via API
const LiquidTradingClient = require('./js_client');

async function getBalance() {
    const client = new LiquidTradingClient();
    
    try {
        console.log('💼 Fetching account balance...');
        const balance = await client.getBalance();
        
        console.log('💰 Account Balance:');
        console.log(`   Total Equity:        $${balance.equity}`);
        console.log(`   Available Balance:   $${balance.available_balance}`);
        console.log(`   Margin Used:         $${balance.margin_used}`);
        console.log(`   Margin Utilization:  ${balance.margin_utilization_percent}%`);
        
        return balance;
    } catch (error) {
        console.error('❌ Error fetching balance:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    getBalance();
}

module.exports = getBalance;

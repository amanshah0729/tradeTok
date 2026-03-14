// js_client.js - JavaScript client for Liquid Trading API
class LiquidTradingClient {
    constructor(apiBaseUrl = 'http://localhost:8000') {
        this.apiBase = apiBaseUrl;
    }

    async apiCall(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${this.apiBase}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            if (error instanceof TypeError) {
                throw new Error('Network error: Cannot connect to trading server. Make sure server is running.');
            }
            throw error;
        }
    }

    // 1. Get account balance
    async getBalance() {
        const response = await this.apiCall('/api/balance');
        return response.data;
    }

    // 2. Get open positions
    async getPositions() {
        const response = await this.apiCall('/api/positions');
        return response.data;
    }

    // 3. Place order
    async placeOrder({
        symbol = 'BTC-PERP',
        side, // 'buy' or 'sell' - required
        type = 'market', // 'market' or 'limit'
        size, // USD notional - required
        leverage = 1,
        price = null, // for limit orders
        takeProfitPrice = null,
        stopLossPrice = null
    }) {
        if (!side) throw new Error('Order side (buy/sell) is required');
        if (!size || size <= 0) throw new Error('Order size must be greater than 0');

        const orderData = {
            symbol,
            side,
            type,
            size,
            leverage
        };

        if (price && type === 'limit') {
            orderData.price = price;
        }
        if (takeProfitPrice) {
            orderData.take_profit = takeProfitPrice;
        }
        if (stopLossPrice) {
            orderData.stop_loss = stopLossPrice;
        }

        const response = await this.apiCall('/api/order', 'POST', orderData);
        return response.data;
    }

    // 4. Close specific position
    async closePosition(symbol, size = null) {
        if (!symbol) throw new Error('Symbol is required');

        const closeData = { symbol };
        if (size) {
            closeData.size = size;
        }

        const response = await this.apiCall('/api/close-position', 'POST', closeData);
        return response.data;
    }

    // 5. Close all positions
    async closeAllPositions() {
        const response = await this.apiCall('/api/close-all-positions', 'POST');
        return response.data;
    }

    // 6. Check market data
    async checkMarket(symbol, depth = 5) {
        const response = await this.apiCall(`/api/market/${symbol}?depth=${depth}`);
        return response.data;
    }

    // Additional utility methods
    async getMarkets() {
        const response = await this.apiCall('/api/markets');
        return response.data;
    }

    async checkServerStatus() {
        try {
            const response = await this.apiCall('/');
            return { online: true, ...response };
        } catch (error) {
            return { online: false, error: error.message };
        }
    }
}

// Usage examples (uncomment to use in Node.js):
/*
// For Node.js usage, you'll need to install node-fetch:
// npm install node-fetch
// Then uncomment this line:
// const fetch = require('node-fetch');

async function examples() {
    const client = new LiquidTradingClient();

    try {
        // Check server status
        const status = await client.checkServerStatus();
        console.log('Server status:', status);

        // Get balance
        const balance = await client.getBalance();
        console.log('Account balance:', balance);

        // Get positions
        const positions = await client.getPositions();
        console.log('Open positions:', positions);

        // Check BTC market
        const market = await client.checkMarket('BTC-PERP');
        console.log('BTC market data:', market);

        // Place a test order (commented for safety)
        // const order = await client.placeOrder({
        //     symbol: 'BTC-PERP',
        //     side: 'buy',
        //     size: 25
        // });
        // console.log('Order placed:', order);

        // Close a position (commented for safety)
        // const closeResult = await client.closePosition('BTC-PERP');
        // console.log('Position closed:', closeResult);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Uncomment to run examples:
// examples();
*/

// Export for module use (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidTradingClient;
}

// Global variable for browser use
if (typeof window !== 'undefined') {
    window.LiquidTradingClient = LiquidTradingClient;
}

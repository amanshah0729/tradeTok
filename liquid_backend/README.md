# Liquid Trading - Python API Server + JavaScript Client

A complete trading solution with Python FastAPI server wrapping the Liquid SDK and JavaScript client for frontend integration.

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌──────────────────┐    Python SDK    ┌─────────────┐
│  JavaScript     │ ──────────────► │  Python FastAPI  │ ───────────────► │   Liquid    │
│  Frontend       │                 │  Server          │                  │   Trading   │
└─────────────────┘                 └──────────────────┘                  └─────────────┘
```

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your API credentials
```

### 2. Install Python Dependencies
```bash
pip install -r requirements_server.txt
```

### 3. Install JavaScript Dependencies (optional)
```bash
npm install
```

### 4. Start the API Server
```bash
python trading_server.py
```
Server will start at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 5. Use the Frontend
Open `frontend.html` in your browser for a web interface, or use the JavaScript client scripts.

## 📚 API Endpoints

### Account & Positions
- `GET /api/balance` - Get account balance
- `GET /api/positions` - Get open positions with P&L

### Trading Operations
- `POST /api/order` - Place trading order
- `POST /api/close-position` - Close specific position
- `POST /api/close-all-positions` - Close all positions

### Market Data
- `GET /api/market/{symbol}` - Get market data for symbol
- `GET /api/markets` - Get all available markets

## 💻 JavaScript Client Usage

### Browser Usage
```html
<script src="js_client.js"></script>
<script>
const client = new LiquidTradingClient();

// Get balance
client.getBalance().then(balance => {
    console.log('Balance:', balance);
});

// Place order
client.placeOrder({
    symbol: 'BTC-PERP',
    side: 'buy',
    size: 25
}).then(order => {
    console.log('Order placed:', order);
});
</script>
```

### Node.js Usage
```javascript
const LiquidTradingClient = require('./js_client');
const client = new LiquidTradingClient();

async function trade() {
    // Check balance
    const balance = await client.getBalance();
    console.log('Available:', balance.available_balance);
    
    // Get positions
    const positions = await client.getPositions();
    console.log('Positions:', positions.count);
    
    // Check market
    const market = await client.checkMarket('BTC-PERP');
    console.log('BTC Price:', market.current_price);
}
```

## 🛠️ Individual Scripts

### Command Line Usage

**Get Balance:**
```bash
node js/get_balance.js
```

**Get Positions:**
```bash
node js/get_positions.js
```

**Place Order:**
```bash
# Show usage
node js/place_order.js

# Market buy $25 BTC
node js/place_order.js --side buy --size 25 --confirm true

# Limit sell $50 ETH
node js/place_order.js --symbol ETH-PERP --side sell --type limit --price 3000 --size 50 --confirm true
```

**Close Position:**
```bash
# Close BTC position
node js/close_position.js --symbol BTC-PERP --confirm true

# Close partial position
node js/close_position.js --symbol BTC-PERP --size 0.5 --confirm true
```

**Close All Positions:**
```bash
node js/close_all_positions.js --confirm true
```

**Check Market:**
```bash
# Check BTC market
node js/check_market.js

# Check ETH market
node js/check_market.js --symbol ETH-PERP

# Show all markets
node js/check_market.js --all
```

### NPM Scripts
```bash
npm run balance       # Get balance
npm run positions     # Get positions  
npm run market        # Check BTC market
npm run server        # Start Python server
```

## 🎯 Request/Response Examples

### Place Order
```javascript
// Request
POST /api/order
{
    "symbol": "BTC-PERP",
    "side": "buy",
    "type": "market",
    "size": 25.0,
    "leverage": 1
}

// Response
{
    "success": true,
    "data": {
        "order_id": "123456789",
        "status": "filled",
        "symbol": "BTC-PERP",
        "side": "buy",
        "size": 25.0
    }
}
```

### Get Positions
```javascript
// Response
{
    "success": true,
    "data": {
        "positions": [
            {
                "symbol": "BTC-PERP",
                "side": "long",
                "size": 0.0005,
                "entry_price": 70000.0,
                "current_price": 70500.0,
                "pnl": 0.25,
                "pnl_percentage": 1.43
            }
        ],
        "total_pnl": 0.25,
        "count": 1
    }
}
```

## 🔒 Safety Features

- ✅ **Confirmation Required**: All trading operations require explicit confirmation
- ✅ **CORS Enabled**: Frontend can call API from browser
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Input Validation**: Pydantic models validate all inputs
- ✅ **Position Preview**: Show P&L before closing positions
- ✅ **Detailed Responses**: Rich data in all API responses

## 🏃‍♂️ Development

### Start Development Server
```bash
# Python server with auto-reload
python trading_server.py

# Alternative using uvicorn directly
uvicorn trading_server:app --reload --host 0.0.0.0 --port 8000
```

### Test API Endpoints
```bash
# Test server health
curl http://localhost:8000/

# Test balance (requires auth)
curl http://localhost:8000/api/balance

# View interactive API docs
open http://localhost:8000/docs
```

## 📂 File Structure

```
├── trading_server.py          # FastAPI Python server
├── js_client.js              # JavaScript client library
├── frontend.html             # Web interface
├── js/
│   ├── get_balance.js         # Balance checker
│   ├── get_positions.js       # Position viewer
│   ├── place_order.js         # Order placement
│   ├── close_position.js      # Close specific position
│   ├── close_all_positions.js # Close all positions
│   └── check_market.js        # Market data checker
├── requirements_server.txt    # Python dependencies
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## 🐛 Troubleshooting

**Server won't start:**
- Check Python dependencies: `pip install -r requirements_server.txt`
- Verify API credentials in `.env` file
- Check port 8000 is not in use

**JavaScript client errors:**
- Ensure server is running at `http://localhost:8000`
- Check browser console for CORS issues
- Verify API responses in Network tab

**Trading errors:**
- Check account balance and trading status
- Verify symbol names (case-sensitive)
- Ensure order sizes meet minimum requirements

## 🔗 Resources

- [Liquid SDK Documentation](https://sdk.tryliquid.xyz/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [API Documentation](http://localhost:8000/docs) (when server is running)

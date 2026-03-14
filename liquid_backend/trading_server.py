# trading_server.py - FastAPI server for Liquid trading operations
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from liquidtrading import LiquidClient
import uvicorn

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Liquid Trading API Server",
    description="REST API server for Liquid trading operations",
    version="1.0.0"
)

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Liquid client
def get_client():
    api_key = os.getenv('LIQUID_API_KEY')
    api_secret = os.getenv('LIQUID_API_SECRET')
    
    if not api_key or not api_secret:
        raise HTTPException(
            status_code=500, 
            detail="API credentials not configured"
        )
    
    return LiquidClient(api_key=api_key, api_secret=api_secret)

# Pydantic models for request/response
class OrderRequest(BaseModel):
    symbol: str = "BTC-PERP"
    side: str  # "buy" or "sell"
    type: str = "market"  # "market" or "limit"
    size: float  # USD notional
    leverage: int = 1
    price: Optional[float] = None  # For limit orders
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None

class ClosePositionRequest(BaseModel):
    symbol: str
    size: Optional[float] = None  # None means close full position

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Liquid Trading API Server",
        "version": "1.0.0"
    }

@app.get("/api/balance")
async def get_balance():
    """Get account balance information"""
    try:
        client = get_client()
        account = client.get_account()
        
        equity = float(account.equity)
        available = float(account.available_balance)
        margin_used = equity - available
        margin_utilization = (margin_used / equity * 100) if equity > 0 else 0
        
        return {
            "success": True,
            "data": {
                "equity": round(equity, 2),
                "available_balance": round(available, 2),
                "margin_used": round(margin_used, 2),
                "margin_utilization_percent": round(margin_utilization, 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/positions")
async def get_positions():
    """Get all open positions with P&L calculation"""
    try:
        client = get_client()
        positions = client.get_positions()
        
        if not positions:
            return {"success": True, "data": []}
        
        position_data = []
        total_pnl = 0
        
        for pos in positions:
            try:
                # Get current market price
                ticker = client.get_ticker(pos.symbol)
                current_price = float(ticker.mark_price)
                entry_price = float(pos.entry_price)
                size = float(pos.size)
                
                # Calculate P&L
                if pos.side == "long":
                    pnl = (current_price - entry_price) * size
                else:
                    pnl = (entry_price - current_price) * size
                
                pnl_percentage = (pnl / (entry_price * size)) * 100
                total_pnl += pnl
                
                position_data.append({
                    "symbol": pos.symbol,
                    "side": pos.side,
                    "size": size,
                    "entry_price": round(entry_price, 2),
                    "current_price": round(current_price, 2),
                    "pnl": round(pnl, 2),
                    "pnl_percentage": round(pnl_percentage, 2)
                })
            except Exception as ticker_error:
                # Add position without current price data
                position_data.append({
                    "symbol": pos.symbol,
                    "side": pos.side,
                    "size": float(pos.size),
                    "entry_price": float(pos.entry_price),
                    "current_price": None,
                    "pnl": None,
                    "pnl_percentage": None,
                    "error": str(ticker_error)
                })
        
        return {
            "success": True,
            "data": {
                "positions": position_data,
                "total_pnl": round(total_pnl, 2),
                "count": len(position_data)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/place-order")
async def place_order(order: OrderRequest):
    """Place a trading order"""
    try:
        client = get_client()
        
        # Validate side parameter
        if order.side.lower() not in ['buy', 'sell']:
            raise ValueError(f"Invalid side '{order.side}'. Must be 'buy' or 'sell'")
        
        # Prepare order parameters
        order_params = {
            "symbol": order.symbol,
            "side": order.side.lower(),  # Ensure lowercase
            "type": order.type,
            "size": order.size,
            "leverage": order.leverage
        }
        
        # Add price for limit orders
        if order.type == "limit" and order.price:
            order_params["price"] = order.price
        
        # Add take profit and stop loss if provided
        if order.take_profit:
            order_params["tp"] = order.take_profit
        if order.stop_loss:
            order_params["sl"] = order.stop_loss
        
        # Place the order
        result = client.place_order(**order_params)
        
        return {
            "success": True,
            "data": {
                "order_id": result.order_id,
                "status": result.status,
                "symbol": order.symbol,
                "side": order.side,
                "type": order.type,
                "size": order.size
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/close-position")
async def close_position(request: ClosePositionRequest):
    """Close a specific position"""
    try:
        client = get_client()
        
        # Get current positions
        positions = client.get_positions()
        target_position = None
        
        for pos in positions:
            if pos.symbol == request.symbol:
                target_position = pos
                break
        
        if not target_position:
            raise HTTPException(
                status_code=404, 
                detail=f"No open position found for {request.symbol}"
            )
        
        # Get current market price
        ticker = client.get_ticker(request.symbol)
        current_price = float(ticker.mark_price)
        position_size = float(target_position.size)
        
        # Calculate close parameters
        close_size = request.size if request.size else abs(position_size)
        close_side = "sell" if target_position.side == "long" else "buy"
        close_usd_notional = close_size * current_price
        
        # Place close order
        close_order = client.place_order(
            symbol=request.symbol,
            side=close_side,
            type="market",
            size=close_usd_notional,
            leverage=1
        )
        
        return {
            "success": True,
            "data": {
                "order_id": close_order.order_id,
                "status": close_order.status,
                "symbol": request.symbol,
                "closed_size": close_size,
                "close_price": round(current_price, 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/close-all-positions")
async def close_all_positions():
    """Close all open positions"""
    try:
        client = get_client()
        positions = client.get_positions()
        
        if not positions:
            return {
                "success": True,
                "data": {
                    "message": "No open positions to close",
                    "closed": 0,
                    "failed": 0
                }
            }
        
        results = []
        closed_count = 0
        failed_count = 0
        
        for pos in positions:
            try:
                # Get current price
                ticker = client.get_ticker(pos.symbol)
                current_price = float(ticker.mark_price)
                position_size = abs(float(pos.size))
                close_side = "sell" if pos.side == "long" else "buy"
                close_usd_notional = position_size * current_price
                
                # Place close order
                close_order = client.place_order(
                    symbol=pos.symbol,
                    side=close_side,
                    type="market",
                    size=close_usd_notional,
                    leverage=1
                )
                
                results.append({
                    "symbol": pos.symbol,
                    "success": True,
                    "order_id": close_order.order_id,
                    "status": close_order.status
                })
                closed_count += 1
                
            except Exception as close_error:
                results.append({
                    "symbol": pos.symbol,
                    "success": False,
                    "error": str(close_error)
                })
                failed_count += 1
        
        return {
            "success": True,
            "data": {
                "closed": closed_count,
                "failed": failed_count,
                "total": len(positions),
                "results": results
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/market/{symbol}")
async def check_market(symbol: str, depth: int = Query(5, ge=1, le=20)):
    """Get market data for a specific symbol"""
    try:
        client = get_client()
        
        # Get ticker data
        ticker = client.get_ticker(symbol)
        current_price = float(ticker.mark_price)
        
        market_data = {
            "symbol": symbol,
            "current_price": round(current_price, 2),
            "volume_24h": getattr(ticker, 'volume_24h', None)
        }
        
        # Get order book
        try:
            orderbook = client.get_orderbook(symbol, depth=depth)
            market_data["orderbook"] = {
                "bids": [
                    {"price": float(bid.price), "size": float(bid.size)} 
                    for bid in orderbook.bids[:depth]
                ],
                "asks": [
                    {"price": float(ask.price), "size": float(ask.size)} 
                    for ask in orderbook.asks[:depth]
                ]
            }
            
            # Calculate spread
            if orderbook.bids and orderbook.asks:
                best_bid = float(orderbook.bids[0].price)
                best_ask = float(orderbook.asks[0].price)
                spread = best_ask - best_bid
                spread_percentage = (spread / best_bid) * 100
                
                market_data["spread"] = {
                    "absolute": round(spread, 2),
                    "percentage": round(spread_percentage, 4)
                }
        except Exception as orderbook_error:
            market_data["orderbook_error"] = str(orderbook_error)
        
        # Get market specifications
        try:
            markets = client.get_markets()
            market_spec = next((m for m in markets if m['symbol'] == symbol), None)
            if market_spec:
                market_data["specifications"] = {
                    "max_leverage": market_spec.get('max_leverage'),
                    "min_size": market_spec.get('min_size'),
                    "tick_size": market_spec.get('tick_size')
                }
        except Exception as spec_error:
            market_data["spec_error"] = str(spec_error)
        
        return {
            "success": True,
            "data": market_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/markets")
async def get_markets():
    """Get list of all available markets"""
    try:
        client = get_client()
        markets = client.get_markets()
        
        return {
            "success": True,
            "data": {
                "markets": markets,
                "count": len(markets)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "success": False,
        "error": exc.detail,
        "status_code": exc.status_code
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {
        "success": False,
        "error": "Internal server error",
        "detail": str(exc)
    }

if __name__ == "__main__":
    # Check environment variables
    if not os.getenv('LIQUID_API_KEY') or not os.getenv('LIQUID_API_SECRET'):
        print("❌ Please set LIQUID_API_KEY and LIQUID_API_SECRET in your .env file")
        exit(1)
    
    print("🚀 Starting Liquid Trading API Server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "trading_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

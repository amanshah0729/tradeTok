import os
from dotenv import load_dotenv
from liquidtrading import LiquidClient

# Load environment variables from .env file
load_dotenv()


def main():
    # Get API credentials from environment variables
    api_key = os.getenv('LIQUID_API_KEY')
    api_secret = os.getenv('LIQUID_API_SECRET')
    
    if not api_key or not api_secret:
        print("Error: Please set LIQUID_API_KEY and LIQUID_API_SECRET "
              "in your .env file")
        print("Copy .env.example to .env and fill in your credentials")
        return
    
    # Initialize the client
    client = LiquidClient(
        api_key=api_key,
        api_secret=api_secret,
    )
    
    try:
        # Check connectivity
        print("🔗 Testing connection...")
        ticker = client.get_ticker("BTC-PERP")
        print(f"✅ BTC mark price: {ticker.mark_price}")
        
        # List all tradeable markets
        print("\n📊 Available markets:")
        markets = client.get_markets()
        for m in markets[:5]:  # Show first 5 markets
            print(f"  {m['symbol']} - Max leverage: {m['max_leverage']}x")
        
        # Get order book with error handling
        print("\n📈 Order Book for BTC-PERP:")
        try:
            book = client.get_orderbook("BTC-PERP", depth=3)
            print(f"  Best bid: ${book.bids[0].price}")
            print(f"  Best ask: ${book.asks[0].price}")
        except Exception as orderbook_error:
            print(f"  ⚠️  Orderbook unavailable: {orderbook_error}")
            print("  (This is usually temporary - continuing with other checks)")

        # Check account state
        print("\n💼 Account Information:")
        try:
            account = client.get_account()
            print(f"  Equity: ${account.equity}")
            print(f"  Available: ${account.available_balance}")
        except Exception as account_error:
            print(f"  ❌ Could not fetch account info: {account_error}")
            return

        # Get positions
        print("\n📍 Current Positions:")
        try:
            positions = client.get_positions()
            if positions:
                for pos in positions:
                    print(f"  {pos.symbol} {pos.side} {pos.size} "
                          f"@ ${pos.entry_price}")
            else:
                print("  No open positions")
        except Exception as positions_error:
            print(f"  ⚠️  Could not fetch positions: {positions_error}")
            positions = []        # Order placement functionality
        place_order_demo(client)
        
        print("\n✅ All checks completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check your API credentials and network connection")


def place_order_demo(client):
    """
    Demonstrate order placement with safety checks and user confirmation
    """
    print("\n🔄 Order Placement Demo")
    print("=" * 50)
    
    # Get current BTC price for reference
    ticker = client.get_ticker("BTC-PERP")
    current_price = float(ticker.mark_price)
    print(f"Current BTC price: ${current_price:,.2f}")
    
    # Order configuration
    symbol = "BTC-PERP"
    side = "buy"  # Change to "sell" if you want to sell
    order_type = "market"  # Can be "market" or "limit"
    size = 25.0  # $25 USD notional (increased for minimum requirement)
    leverage = 1  # Conservative leverage
    
    # Calculate take-profit and stop-loss levels
    if side == "buy":
        take_profit = current_price * 1.02  # 2% profit target
        stop_loss = current_price * 0.98    # 2% stop loss
    else:
        take_profit = current_price * 0.98  # 2% profit target for short
        stop_loss = current_price * 1.02    # 2% stop loss for short
    
    print("\nProposed Order:")
    print(f"  Symbol: {symbol}")
    print(f"  Side: {side.upper()}")
    print(f"  Type: {order_type.upper()}")
    print(f"  Size: ${size} USD")
    print(f"  Leverage: {leverage}x")
    print(f"  Take Profit: ${take_profit:,.2f}")
    print(f"  Stop Loss: ${stop_loss:,.2f}")
    
    # Safety confirmation
    print("\n⚠️  WARNING: This will place a REAL order on the live market!")
    print(f"💰 You will risk ${size} USD on this trade.")
    
    # Uncomment the following lines to enable actual order placement
    # IMPORTANT: Only uncomment when you're ready to place real trades!
    
    confirm = input("\nType 'YES' to confirm order placement: ")
    if confirm.upper() == "YES":
        try:
            print("🔄 Placing order...")
            
            # Place order with exact Liquid API format
            order = client.place_order(
                symbol=symbol,
                side=side,
                type=order_type,
                size=size,       # USD notional amount
                leverage=leverage
            )
            
            print("✅ Order placed successfully!")
            print(f"   Order ID: {order.order_id}")
            print(f"   Status: {order.status}")
            
            # Check updated account balance
            updated_account = client.get_account()
            print(f"   New Available Balance: ${updated_account.available_balance}")
            
            # Check if position was created
            positions = client.get_positions()
            for pos in positions:
                if pos.symbol == symbol:
                    print(f"   Position: {pos.side} {pos.size} @ ${pos.entry_price}")
            
        except Exception as e:
            print(f"❌ Order placement failed: {e}")
            print("🔍 Common solutions:")
            print("   - Increase order size to $25-50 USD")
            print("   - Check account balance and trading status")
            print("   - Verify symbol is 'BTC-PERP' (case sensitive)")
    else:
        print("❌ Order placement cancelled")
    
    print("🛡️  Order placement is currently DISABLED for safety")
    print("    To enable: uncomment the order placement code in the script")


def place_limit_order_demo(client, symbol="BTC-PERP", side="buy", 
                          size=10.0, price_offset_percent=1.0):
    """
    Demo function for placing limit orders
    
    Args:
        symbol: Trading pair (e.g., "BTC-PERP")
        side: "buy" or "sell"
        size: USD notional size
        price_offset_percent: Percentage away from current price for limit order
    """
    ticker = client.get_ticker(symbol)
    current_price = float(ticker.mark_price)
    
    # Calculate limit price
    if side == "buy":
        limit_price = current_price * (1 - price_offset_percent / 100)
    else:
        limit_price = current_price * (1 + price_offset_percent / 100)
    
    print(f"\n📝 Limit Order Setup:")
    print(f"  Current Price: ${current_price:,.2f}")
    print(f"  Limit Price: ${limit_price:,.2f}")
    print(f"  Size: ${size} USD")
    
    # Uncomment to place actual limit order
    try:
        order = client.place_order(
            symbol=symbol,
            side=side,
            type="limit",
            size=size,
            price=limit_price,
            leverage=1,
        )
        print(f"✅ Limit order placed: {order.order_id}")
    except Exception as e:
        print(f"❌ Limit order failed: {e}")


if __name__ == "__main__":
    main()

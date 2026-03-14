# TradeTok — Project Overview

## What We're Building

TradeTok is a social trading interface built for the **Liquid Hackathon** (Trading Track, $8k prize pool). The concept: make trading feel like TikTok/Instagram Reels. Experienced traders post short-form video content explaining their thesis, less experienced traders scroll through and copy trades with a single interaction.

This is a **hackathon project**. We are optimizing for a compelling demo and working end-to-end functionality over perfect security, production-grade architecture, or scalability. Corners will be cut where they don't matter for the demo.

---

## Hackathon Context

- **Event:** Liquid Hackathon
- **Track:** New Trading Interfaces — most novel trading-adjacent app using the Liquid SDK/API
- **Prize:** 1st: $4k, 2nd: $2k
- **Code:** `BABHACK`
- **Platform:** Web-based (not mobile — building web first for speed, even though the final vision is mobile)
- **Constraint:** Must use Liquid SDK to place trades

---

## Core Concept

> TikTok for trading. Scroll a feed of trader-made videos, double-tap to copy their trade.

Experienced traders post short videos explaining their market thesis. Less experienced ("retail") users scroll a vertical video feed, and if they like what they see, they can act on it instantly — the system copies the trade on their behalf via the Liquid API.

The key insight: lower the friction of acting on good trading ideas to nearly zero. No manual order entry, no navigating a trading terminal — just scroll and tap.

---

## Key Features

### 1. Video Feed (Reels-Style)
- Vertical scrolling feed of short-form trader videos
- Each video = one trader's thesis on a specific position/trade
- Feed is ranked/personalized (can be simple for demo — e.g. by likes or recency)

### 2. Copy Trading via Double-Tap
- User double-taps a video → the underlying trade thesis is executed on their Liquid account
- The trade parameters (asset, direction, size) are embedded in the video post by the original trader
- This is the core demo moment — needs to feel instant and satisfying

### 3. Social Layer
- Like, comment on thesis videos
- Traders build a following; popular traders get surfaced more

### 4. Live Trading Sessions
- Traders can go "live" (like Instagram Live)
- Viewers who join a live session opt into mirroring all trades the streamer makes in real time
- If they join → every trade the live trader places gets replicated on the viewer's account via Liquid API

### 5. Trader Incentives (Carry Model)
- Traders earn a small carry (~1% of profit) from users who copy their trades
- The feed algorithm rewards traders whose followers make money (aligns incentives)

---

## Tech Stack (Rough)

- **Frontend:** Web app (Next.js or plain React) — mobile-responsive but web-first
- **Backend:** Simple API server (Node/Express or Next.js API routes)
- **Trading:** Liquid SDK/API for all order placement and account management
- **Video:** Pre-recorded video uploads (stored simply — S3 or even local for demo); live sessions via WebRTC or a simple streaming lib
- **Auth:** Basic auth sufficient for demo — no OAuth complexity needed
- **Database:** Lightweight (SQLite or a hosted Postgres like Supabase) for users, posts, follows, copy relationships

---

## What "Done" Looks Like for the Demo

1. A user can log in and see a scrolling vertical video feed of trader posts
2. Each video has trade metadata visible (asset, direction, size or % of portfolio)
3. Double-tapping a video triggers a real trade via Liquid API on the viewer's account
4. A trader can post a video with a linked trade thesis
5. Some version of "go live" where a viewer's account mirrors the live trader's trades in real time
6. Basic like/comment interaction on videos

---

## What We're Not Worrying About (For Now)

- Mobile-native app (web-responsive is enough for demo)
- Production security (API key management, rate limiting, etc.)
- Scalability or infra reliability
- Perfect video encoding/streaming quality
- KYC, compliance, or financial regulations
- Edge cases in trade execution (partial fills, insufficient balance errors)
- Polished UI — functional and demo-able beats beautiful

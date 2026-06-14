# MT5 Auto-Sync Expert Advisor

Automatically syncs your MT5 trades to your Trading Journal.

## Setup (5 minutes)

### Step 1: Generate API Key

1. Go to your Trading Journal → **Settings**
2. Under **API Keys for MT5 Auto-Sync**, click **Generate New Key**
3. Copy the key (starts with `tj_`)

### Step 2: Install the EA

1. Open **MetaTrader 5**
2. Go to **File** → **Open Data Folder**
3. Navigate to `MQL5/Experts/`
4. Copy `TradingJournalSync.mq5` into this folder

### Step 3: Compile

1. Open **MetaEditor** (press F4 in MT5)
2. Open `TradingJournalSync.mq5`
3. Press **Compile** (F7) — make sure 0 errors

### Step 4: Attach to Chart

1. In MT5, open **Navigator** (Ctrl+N)
2. Find **TradingJournalSync** under **Expert Advisors**
3. Drag it onto any chart
4. In the settings dialog:
   - **App URL**: Your app URL (e.g., `https://your-app.vercel.app`)
   - **API Key**: Paste your key from Step 1
   - **Sync Interval**: How often to sync (default: 60 seconds)
   - **Sync on Trade Close**: Enable for instant sync

### Step 5: Enable WebRequests

1. **Tools** → **Options** → **Expert Advisors**
2. Check **Allow WebRequest for listed URL**
3. Add: `http://localhost:3000` (or your Vercel URL)

### Step 6: Start

1. Make sure **AutoTrading** is enabled (toolbar)
2. EA should show a smiley face on the chart
3. Check **Experts** tab for sync logs

## What It Does

- Syncs closed trades automatically
- Backfills last 30 days on first run
- Prevents duplicate imports
- Runs every 60 seconds (configurable)

## Troubleshooting

- **"Please enter your API Key"** → Add the key in EA settings
- **HTTP 401** → Key is wrong or missing
- **HTTP 403** → WebRequest not enabled for the URL
- **No trades syncing** → Check Experts tab for errors

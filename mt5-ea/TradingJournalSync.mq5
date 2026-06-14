//+------------------------------------------------------------------+
//|                                         TradingJournalSync.mq5    |
//|                              Trading Journal Auto-Sync EA          |
//+------------------------------------------------------------------+
#property copyright "Trading Journal"
#property version   "1.10"
#property description "Auto-syncs your MT5 trades to Trading Journal"

#include <Trade\Trade.mqh>

// Input Parameters
input string   InpApiUrl       = "http://localhost:3000"; // App URL
input string   InpApiKey       = "";                        // API Key from Settings
input int      InpSyncInterval = 60;                        // Sync Interval (seconds)
input bool     InpSyncOnClose  = true;                      // Sync on Trade Close

// Global Variables
datetime lastSyncTime = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                     |
//+------------------------------------------------------------------+
int OnInit()
{
   if(InpApiKey == "")
   {
      Alert("Please enter your API Key in the EA settings!");
      return(INIT_FAILED);
   }

   Print("Trading Journal Sync EA initialized");

   if(InpSyncOnClose)
      EventSetTimer(1);

   SyncClosedTrades();
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
}

//+------------------------------------------------------------------+
//| Timer function                                                     |
//+------------------------------------------------------------------+
void OnTimer()
{
   if(TimeCurrent() - lastSyncTime >= InpSyncInterval)
      SyncClosedTrades();
}

//+------------------------------------------------------------------+
//| Trade event handler                                                |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& result)
{
   if(InpSyncOnClose && trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ENUM_DEAL_ENTRY entry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(trans.deal, DEAL_ENTRY);
      if(entry == DEAL_ENTRY_OUT)
         SyncClosedTrades();
   }
}

//+------------------------------------------------------------------+
//| Sync Closed Trades                                                 |
//+------------------------------------------------------------------+
void SyncClosedTrades()
{
   datetime fromDate = lastSyncTime;
   if(fromDate == 0)
      fromDate = TimeCurrent() - 86400 * 30;

   datetime toDate = TimeCurrent();

   if(!HistorySelect(fromDate, toDate))
   {
      Print("Failed to select history");
      return;
   }

   int totalDeals = HistoryDealsTotal();
   string jsonData = "[";
   bool first = true;

   for(int i = 0; i < totalDeals; i++)
   {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket == 0) continue;

      ENUM_DEAL_ENTRY dealEntry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(ticket, DEAL_ENTRY);
      if(dealEntry != DEAL_ENTRY_IN) continue;

      string symbol = HistoryDealGetString(ticket, DEAL_SYMBOL);
      double volume = HistoryDealGetDouble(ticket, DEAL_VOLUME);
      double price = HistoryDealGetDouble(ticket, DEAL_PRICE);
      datetime dealTime = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
      ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE);
      double commission = HistoryDealGetDouble(ticket, DEAL_COMMISSION);
      double swap = HistoryDealGetDouble(ticket, DEAL_SWAP);
      double profit = HistoryDealGetDouble(ticket, DEAL_PROFIT);

      long positionId = HistoryDealGetInteger(ticket, DEAL_POSITION_ID);
      double closePrice = 0;
      datetime closeTime = 0;

      for(int j = 0; j < totalDeals; j++)
      {
         ulong exitTicket = HistoryDealGetTicket(j);
         if(exitTicket == 0) continue;

         ENUM_DEAL_ENTRY exitEntry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(exitTicket, DEAL_ENTRY);
         long exitPositionId = HistoryDealGetInteger(exitTicket, DEAL_POSITION_ID);

         if(exitEntry == DEAL_ENTRY_OUT && exitPositionId == positionId)
         {
            closePrice = HistoryDealGetDouble(exitTicket, DEAL_PRICE);
            closeTime = (datetime)HistoryDealGetInteger(exitTicket, DEAL_TIME);
            break;
         }
      }

      string direction = (dealType == DEAL_TYPE_BUY) ? "buy" : "sell";

      if(!first) jsonData += ",";
      first = false;

      jsonData += "{";
      jsonData += "\"symbol\":\"" + symbol + "\",";
      jsonData += "\"direction\":\"" + direction + "\",";
      jsonData += "\"entry_price\":" + DoubleToString(price, 8) + ",";
      jsonData += "\"exit_price\":" + DoubleToString(closePrice, 8) + ",";
      jsonData += "\"lot_size\":" + DoubleToString(volume, 2) + ",";
      jsonData += "\"entry_time\":\"" + TimeToString(dealTime, TIME_DATE | TIME_SECONDS) + "\",";
      jsonData += "\"exit_time\":\"" + TimeToString(closeTime, TIME_DATE | TIME_SECONDS) + "\",";
      jsonData += "\"profit\":" + DoubleToString(profit, 2) + ",";
      jsonData += "\"commission\":" + DoubleToString(commission, 2) + ",";
      jsonData += "\"swap\":" + DoubleToString(swap, 2) + ",";
      jsonData += "\"mt5_ticket\":\"" + IntegerToString(ticket) + "\"";
      jsonData += "}";
   }

   jsonData += "]";

   if(first)
   {
      lastSyncTime = TimeCurrent();
      return;
   }

   SendToApi(jsonData);
   lastSyncTime = TimeCurrent();
}

//+------------------------------------------------------------------+
//| Send data to API                                                   |
//+------------------------------------------------------------------+
void SendToApi(string jsonData)
{
   string url = InpApiUrl + "/api/sync/mt5";

   char   postData[];
   char   result[];
   string headers = "Content-Type: application/json\r\n" +
                    "x-api-key: " + InpApiKey + "\r\n";

   StringToCharArray(jsonData, postData, 0, StringLen(jsonData));

   int res = WebRequest("POST", url, headers, 5000, postData, result);

   if(res == 200 || res == 201)
   {
      Print("Trades synced successfully!");
   }
   else
   {
      Print("Sync failed. HTTP Status: ", res);
   }
}
//+------------------------------------------------------------------+

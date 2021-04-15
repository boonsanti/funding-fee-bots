module.exports = {
  // Running Port
  PORT: 5001,
  // MODE
  // [ 1:Simulation | 2:Live Trading | 3:DCA BTC | 4: Arbitrage | 5: AMM ]
  MODE: "6",
  // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
  // Choose history period range
  histo: "1d",
  primary: "BNB",
  secondary: "BUSD",
  pair: "BNBBUSD",
  // Amount of history (MAX. 500)
  // Ex.1 1440 mininutes of histominute
  // Ex.2 365 days of histoday
  limit: Math.floor(500),
  // Capital in USDT
  capital: 10 * 2,
  // Order size in USDT
  order_size: 100,
  //Gap multiply of order size
  gap_multiply: 0.01,
  // Exchange Fees in percent(%)
  ex_fee: 0.1,
  natee: 60 * 24 * 0,
};

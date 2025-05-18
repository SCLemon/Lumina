const ti = require('technicalindicators');

// ['rsi','roc','macd','macdHistogram','stochK','stochD','stochRSI_K','stochRSI_D','adx','cci','williamsR','mfi','forceIndex','stdDev']
function calculateIndicators(stockData){

  const close = stockData.map(d => d['close']);
  const high = stockData.map(d => d['high']);
  const low = stockData.map(d => d['low']);
  const open = stockData.map(d => d['open']);
  const volume = stockData.map(d => d['volume']);
  
  
  // 各種指標參數設為常用預設
  const indicators = {

    rsi: ti.RSI.calculate({ period: 14, values: close }),
    roc: ti.ROC.calculate({ period: 14, values: close }),
    macd: ti.MACD.calculate({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }),
    stoch: ti.Stochastic.calculate({ high, low, close, period: 14, signalPeriod: 3 }),
    stochRSI: ti.StochasticRSI.calculate({ values: close, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3 }),
    adx: ti.ADX.calculate({ high, low, close, period: 14 }),
    cci: ti.CCI.calculate({ high, low, close, period: 14 }),
    fi: ti.ForceIndex.calculate({ close, volume, period: 14 }),
    mfi: ti.MFI.calculate({ high, low, close, volume, period: 14 }),
    sd: ti.SD.calculate({ period: 14, values: close }),
    williamsR: ti.WilliamsR.calculate({ high, low, close, period: 14 }),

  };
  
  
  const minLen = Math.min(...Object.values(indicators).map(arr => arr.length));
  const offset = close.length - minLen;
  const trimmedData = stockData.slice(offset);
  
  // 整合資料
  const round = (value) => {
      return (value !== undefined && value !== null)
        ? Math.round(value * 1000) / 1000
        : null;
  };
    
  const result = trimmedData.map((item, i) => {
      return {
          ...item,
          rsi: round(indicators.rsi[i]),
          roc: round(indicators.roc[i]),
          macd: round(indicators.macd[i]?.MACD),
          macdHistogram: round(indicators.macd[i]?.histogram),
          stochK: round(indicators.stoch[i]?.k),
          stochD: round(indicators.stoch[i]?.d),
          stochRSI_K: round(indicators.stochRSI[i]?.k),
          stochRSI_D: round(indicators.stochRSI[i]?.d),
          adx: round(indicators.adx[i]?.adx),
          cci: round(indicators.cci[i]),
          forceIndex: round(indicators.fi[i]),
          mfi: round(indicators.mfi[i]),
          stdDev: round(indicators.sd[i]),
          williamsR: round(indicators.williamsR[i]),
      }
  });


  return jsonToCsv(result)

}


const { Parser } = require('json2csv');
function jsonToCsv(jsonData){
  const json2csvParser = new Parser();
  const last14Data = jsonData.slice(-14);
  const csv = json2csvParser.parse(last14Data);
  return csv
}

module.exports = {
  calculateIndicators
}


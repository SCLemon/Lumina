const express = require('express');
const router = express.Router();
const key  = require('../apiKey');

const { RestClient } = require('@fugle/marketdata');
const apiKey = key.FugleAPIKey;
const client = new RestClient({ apiKey: apiKey });
const stock = client.stock;

const {format} = require('date-fns');
const axios = require('axios');


router.get('/stock/getInfo',(req,res)=>{
    var symbol = req.query.symbol;
    stock.intraday.quote({symbol:symbol})
    .then(data =>{
        res.send(data);
    });
})

router.get('/stock/list',(req,res)=>{
    stock.intraday
    .tickers({ type: "EQUITY", exchange: req.query.exchange, isNormal: true })
    .then((data) =>{
        data.data.sort((a,b)=>{
            return parseInt(a.symbol) - parseInt(b.symbol);
        })
        res.send(data)
    }).catch(e=>{
        res.send('error')
    })
})

router.get('/stock/history',(req,res)=>{
    var from = format(new Date()-360*86400*1000,'yyyy-MM-dd')
    var to = format(new Date()-86400*1000,'yyyy-MM-dd')
    var symbol = req.query.symbol;
    stock.historical.candles({
        symbol:symbol,
        from:from,
        to:to,
        fields:'open,high,low,close,volume',
    })
    .then(data=>{
        var output = data.data.map(item => [new Date(item.date).getTime(),item.open, item.high, item.low, item.close,item.volume]).reverse();
        res.send(output)
    })
    .catch(e=>{
        console.log(e)
        res.send('error')
    })
})

router.get('/stock/news',async (req,res)=>{
    try{
        const page = req.query.page?req.query.page:1;
        const response = await axios.get(`https://api.cnyes.com/media/api/v1/newslist/category/headline?page=${page}&limit=7`);
        res.send(response.data.items.data)
    }
    catch(e){
        res.send([])
    }
})

// 獲取貨幣匯率
const {getExchangeRate} = require('./getExchangeRate.js')
router.get('/stock/exchangeRate',async (req,res)=>{
    try{
        const data = await getExchangeRate();
        res.send(data)
    }
    catch(e){
        res.send([])
    }
})

// 獲取經濟數據
const {getEconomicCalendar} = require('./getEconomicCalendar.js')
router.get('/stock/economy',async (req,res)=>{
    try{
        const data = await getEconomicCalendar();
        res.send(data)
    }
    catch(e){
        res.send([])
    }
})



module.exports = router;
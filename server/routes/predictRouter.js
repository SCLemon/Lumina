const express = require('express');
const router = express.Router();
const key  = require('../apiKey');

const { RestClient } = require('@fugle/marketdata');
const apiKey = key.FugleAPIKey;
const client = new RestClient({ apiKey: apiKey });
const stock = client.stock;
const {format} = require('date-fns');


const { calculateIndicators } = require('./calculateIndicators')
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');


router.get('/stock/predict',async (req,res)=>{
    try{
        
        // 獲取資料
        var symbol = req.query.symbol;
        var from = format(new Date()-360*86400*1000,'yyyy-MM-dd')
        var to = format(new Date()-86400*1000,'yyyy-MM-dd')
        var symbol = req.query.symbol;

        const history = await stock.historical.candles({
            symbol:symbol,
            from:from,
            to:to,
            fields:'open,high,low,close,volume',
        })
        const intraday = await stock.intraday.quote({symbol:symbol});

        // 合併資料
        let combine = (history.data.reverse());
        if(format(new Date(intraday.lastUpdated/1000),'yyyy-MM-dd') != history.data[history.data.length - 1].date){
            combine.push({
                date: format(new Date(intraday.lastUpdated/1000),'yyyy-MM-dd'),
                open: intraday.openPrice,
                high: intraday.highPrice,
                low: intraday.lowPrice,
                close: intraday.closePrice,
                volume: intraday.total.tradeVolume*1000,
            })
        }

        // 計算指標 (Csv 格式) 並寫入暫存文件
        let dataWithIndicators = calculateIndicators(combine)
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `indicators_${Date.now()}.csv`);
        fs.writeFileSync(tempFilePath, dataWithIndicators, 'utf8');

        // 模型預測
        const pythonPath = './python/venv/bin/python3';
        const python = spawn(pythonPath, ['python/model.py', tempFilePath]);

        let results = {
            status: false,
            text : '',
            percent : 0,
        }

        python.stdout.on('data', (data) => {
            let output = data.toString().split(',');
            results.status = true;
            results.text = output[0] == 1?'上漲':output[0] == -1?'下跌':'平盤'
            results.percent = (+output[1]).toFixed(2);
        });
          
        python.on('close', (code) => {
            fs.unlink(tempFilePath, (err) => {});
            res.send(results)
        });

    }
    catch(e){
        res.send({
            status:false,
            text: '',
            percent:0
        }) 
    }
})


module.exports = router;
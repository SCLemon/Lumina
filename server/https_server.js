const express = require('express');
const cors = require('cors');
const compression = require('compression');
const app = express();

// 壓縮
app.use(compression());

// 轉換
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 開放跨域
app.use(cors({
    origin: '*' 
}))
app.set('trust proxy', 'loopback, 192.168.0.1'); 

// 初始化資料庫
const { connectToDatabase, disconnectFromDatabase } = require('./db/db.js');
connectToDatabase();
process.on('SIGINT', function() {
    disconnectFromDatabase();
    // 這裡可以進行其他的清理操作，例如關閉伺服器
    process.exit(0);
});

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分鐘
    max: 300, // 限制每個 IP 最多 100 次請求
    message: 'Too many requests from this IP, please try again after a minute.',
});

app.use(limiter);


// 證券資訊
const stockRouter = require('./routes/stockRouter.js');
app.use(stockRouter);


app.listen(3007, () => {
    console.log('PORT 3007 is listening')
})


// 避免系統中斷
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

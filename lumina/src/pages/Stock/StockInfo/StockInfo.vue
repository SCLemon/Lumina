<template>
  <div class="all">
    <div class="main">
        <div id="container" ref="container" class="container"></div>
        <div class="column">
            <div class="detail">
                <div class="stock_title">{{symbol}} {{ name }}</div>
                <div class="stock_price_box">
                    <div class="stock_price">{{ info.lastPrice }}</div>
                    <div class="exchange">TWD</div>
                    <div :class="`price_change ${info.change>0?'red':info.change<0?'green':'black'}`">{{info.change>=0?'+':''}}{{ info.change }}</div>
                    <div :class="`price_percent ${info.change>0?'red':info.change<0?'green':'black'}`">{{info.change>=0?'+':''}}{{ info.changePercent }}%</div>
                </div>
                <div class="compare">
                    <div class="total_bids" :style="`width:${compare_bids}%`">{{ info.total?info.total.tradeVolumeAtBid:0 }}</div>
                    <div class="total_asks" :style="`width:${compare_asks}%`">{{ info.total?info.total.tradeVolumeAtAsk:0 }}</div>
                </div>
                <div class="limit">
                    <div>Open：<span :class="`${showColor(info.openPrice)}`">{{ info.openPrice }}</span></div>  
                    <div>High： <span :class="`${showColor(info.highPrice)}`">{{ info.highPrice }}</span></div>
                    <div>Low： <span :class="`${showColor(info.lowPrice)}`">{{ info.lowPrice }}</span></div>
                    <div>Close： <span :class="`${showColor(info.closePrice)}`">{{ info.closePrice }}</span></div>
                </div>
                <div class="limit">
                    <div>Avg：<span :class="`${showColor(info.avgPrice)}`">{{ info.avgPrice }}</span></div> 
                    <div>Volume: {{ info.total?info.total.tradeVolume:0 }}</div>
                </div>
                <div class="fiveList_box">
                    <div class="bList">
                        <div v-for="(obj,id) in info.bids" :key="id" class="fiveList_item_b">
                            <div :class="`${showColor(obj.price)} bPrice ${obj.price == info.lastPrice?'underline':''}`">{{ obj.price }}</div>
                            <div class="bSize" :style="`width:${showLength('bids',obj.size)}%`">{{ obj.size }}</div>
                        </div>
                    </div>
                    <div class="aList">
                        <div v-for="(obj,id) in info.asks" :key="id" class="fiveList_item_a">
                            <div class="aSize" :style="`width:${showLength('asks',obj.size)}%`">{{ obj.size }}</div>
                            <div :class="`${showColor(obj.price)} aPrice ${obj.price == info.lastPrice?'underline':''}`">{{ obj.price }}</div>
                        </div>
                    </div>
                </div>
                <div class="tradeDetail">
                    <template>
                        <el-table :data="tableData" style="width: 100%; " empty-text="暫無交易明細">
                            <el-table-column prop="time" label="時間" :formatter="formatTime" width="70.4px"></el-table-column>
                            <el-table-column prop="bid" label="買進" width="70.4px">
                                <template slot-scope="scope">
                                    <span :class="`${showColor(scope.row.bid)}`">{{ scope.row.bid }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ask" label="賣出" width="70.4px">
                                <template slot-scope="scope">
                                    <span :class="`${showColor(scope.row.ask)}`">{{ scope.row.ask }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="成交" width="70.4px">
                                <template slot-scope="scope">
                                    <span :class="`${showColor(scope.row.price)}`">{{ scope.row.price }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="size" label="單量" width="70.4px">
                                <template slot-scope="scope">
                                    <span :style="{color: scope.row.price > scope.row.bid? 'rgb(249, 75, 75)' : '#27de27' }">{{ scope.row.size }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </div>
            <div class="scrollBox">
                <div class="ai" v-if="0"></div>
                <div class="others">
                    <div class="others_select">
                        <div :class="`others_select_item others_select_item_left ${others_status==0?'others_selected':''}`" @click="others_status = 0">時事新聞</div>
                        <div :class="`others_select_item others_select_item_right ${others_status==1?'others_selected':''}`" @click="others_status = 1">經濟數據</div>
                    </div>
                    <div class="others_component">
                        <StockNews v-if="others_status == 0"></StockNews>
                        <EconomicCalendar v-if="others_status == 1"></EconomicCalendar>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {format} from 'date-fns'
import StockNews from './components/StockNews.vue'
import EconomicCalendar from './components/EconomicCalendar.vue'
export default {
    name:'StockInfo',
    data(){
        return{
            name:'台積電',
            symbol:2330,
            timer:0,
            info:{},
            history:[],
            tableData:[],
            others_status:0,
        }
    },
    components:{
        StockNews,EconomicCalendar
    },
    watch:{
        '$route.query':{
            deep:true,
            async handler(){
                this.initialize();
            }
        }
    },
    computed:{
        compare_bids(){
            if(this.info && this.info.total && this.info.total.tradeVolume){
                return ((this.info.total.tradeVolumeAtBid / this.info.total.tradeVolume).toFixed(4)*100).toFixed(2)
            }
            else return 0
        },
        compare_asks(){
            if(this.info && this.info.total && this.info.total.tradeVolume){
                return (100 - this.compare_bids).toFixed(2);
            }
            else return 0
        },
    },
    async mounted(){
        this.initialize();
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy(){
        window.removeEventListener('resize', this.handleResize);
        if (this.chart) {
            this.chart.destroy();
        }
        clearInterval(this.timer)
    },
    methods:{
        // 初始化
        async initialize(){
            clearInterval(this.timer);
            this.symbol = this.$route.query.symbol?this.$route.query.symbol:2330;
            this.name = this.$route.query.name?this.$route.query.name:'台積電'
            await this.getInfo();
            await this.getData();
            this.timer = setInterval(() => {
                this.update()
            }, 1500);
        },
        // 重新調整尺寸
        handleResize() {
            if (this.chart) {
                this.drawChart(this.history);
            }
        },
        // 判斷價格與前日價格的差異並顯示對應顏色
        showColor(price){
            return price>this.info.referencePrice?'red':price<this.info.referencePrice?'green':'black'
        },
        // 委買賣比例
        showLength(target, size){
            if(this.info && size){
                const maxSize = Math.max(...this.info[target].map(t => t.size));
                return (((size/maxSize)*50).toFixed(2))
            }
            else return 0;
        },
        // 交易明細時間
        formatTime(row) {
            // 假設原始 time 是 ISO 格式，例如 "2025-05-07T13:45:00"
            const time = new Date(row.time)/1000;
            return format(new Date(time), 'HH:mm:ss'); // 回傳格式化後的時間字串
        },
        // 獲取當日資料
        async getInfo(){
            const res = await axios.get(`/stock/getInfo?symbol=${this.symbol}`)
            if(!res.data.statusCode){
                this.info = res.data;
                this.tableData = [res.data.lastTrade];
            }
        },
        // 獲取歷史資料
        async getData(){
            const response = await axios.get(`/stock/history?symbol=${this.symbol}`);
            this.history = response.data;
            this.drawChart(response.data)
        },
        // 首次繪圖
        drawChart(rawData){
            const  groupingUnits = [['day',[1]],['week',[1]], ['month',[1, 2, 3, 4, 6]]];
            const ohlc = []
            const volume = [];
            var d = rawData;
            for(var i=0; i<d.length;i++){
                ohlc.push([d[i][0],d[i][1],d[i][2],d[i][3],d[i][4]])
                volume.push([d[i][0],d[i][5]])
            };

            // 添加當日即時資料
            if(this.info && this.info.lastUpdated){
                if(format(new Date(this.info.lastUpdated/1000),'yyyy-MM-dd') == format(new Date(),'yyyy-MM-dd')){
                    ohlc.push([this.info.lastUpdated/1000,this.info.openPrice,this.info.highPrice,this.info.lowPrice,this.info.closePrice])
                    volume.push([this.info.lastUpdated/1000,this.info.total.tradeVolume])
                }
            }

            Highcharts.setOptions({
                lang: {
                    decimalPoint: '.',
                    thousandsSep: ','
                }
            });
            this.chart = Highcharts.stockChart('container', {
                // plotOptions:{
                //     series:{
                //         animation:{
                //             duration:this.initialized?0:1000,
                //         }
                //     }
                // },
                chart: {
                    type: 'stock',       // 設定圖表為股票型態
                    height: window.innerHeight - 45,  // 設定圖表的總高度
                    spacingTop: 20,      // 設定圖表頂部間距
                    spacingRight: 20,    // 設定圖表右側間距
                    spacingBottom: 20,   // 設定圖表底部間距
                    spacingLeft: 20      // 設定圖表左側間距
                },
                navigation: {
                    enabled:true,
                    bindings: {},
                    events: {},
                    enableMouseWheelZoom: true,
                },
                stockTools: {
                    gui: {
                        enabled: true, // 啟用 GUI
                    }
                },
                rangeSelector: {
                    selected: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    height: '70%',        
                    lineWidth: 1,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: '70%',           
                    height: '10%',        
                    offset: 0,
                    lineWidth: 1,
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: '80%',           
                    height: '20%',        
                    offset: 0,
                    lineWidth: 1,
                }],
                tooltip: {
                    shape: 'square',
                    headerShape: 'callout',
                    borderWidth: 0,
                    shadow: false,
                    fixed: true
                },
                series: [{
                    type: 'candlestick',
                    name: `${this.symbol} 股價`,
                    id: `${this.symbol} 股價`,
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    color: '#27de27',    
                    upColor: '#f94b4b',
                }, {
                    type: 'column',
                    name: '成交量',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, 
                {
                    type: 'bb',
                    name: '布林帶',
                    linkedTo: `${this.symbol} 股價`,
                    params: {
                        period: 20,
                        standardDeviation: 2
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                }, 
                {
                    type: 'macd',
                    name: 'MACD',
                    yAxis: 2,
                    params: {
                        shortPeriod: 3,
                        longPeriod: 15,
                        signalPeriod: 6
                    },
                    linkedTo: `${this.symbol} 股價`
                }]
            });
        },

        // 定時更新資料
        async update(){
            await this.getInfo();
            this.updateChart();
        },
        // 更新最後一根
        updateChart(){
            if(this.info && this.info.total){
                const lastOhlcPoint = this.chart.series[0].data.at(-1);
                const lastVolumePoint = this.chart.series[1].data.at(-1);
                if(lastOhlcPoint && lastVolumePoint){
                    lastOhlcPoint.update([this.info.lastUpdated/1000,this.info.openPrice,this.info.highPrice,this.info.lowPrice,this.info.closePrice], true);
                    lastVolumePoint.update([this.info.lastUpdated/1000,this.info.total.tradeVolume*1000], true);
                }
            }
        }
    },
}
</script>

<style scoped>
    .disabled{
        cursor: not-allowed !important;
    }
    .all{
        -webkit-user-select: none;
    }
    .main{
        width: 100vw;
        height: calc(100vh - 60px);
        overflow-x: scroll;
        display: flex;
        justify-content: space-evenly;
    }
    .container{
        width: calc(100vw - 400px);
        height: calc(100vh - 60px);
        position: relative;
    }
    .column{
        padding-bottom: 20px;
        width: 400px;
        height: calc(100vh - 60px);
        overflow: hidden;
    }
    .detail{
        width: 100%;
    }
    .stock_title{
        font-size: 14px;
        font-weight: bolder;
        height: 30px;
        line-height: 30px;
    }
    .stock_price_box{
        height: 60px;
        width: 100%;
        line-height: 60px;
    }
    .stock_price{
        font-size: 32px;
        font-weight: bolder;
        display: inline-block;
    }
    .exchange{
        font-size: 12px;
        color: rgb(150,150,150);
        display: inline-block;
        margin-left: 5px;
    }
    .price_change{
        display: inline-block;
        margin-left: 10px;
    }
    .price_percent{
        display: inline-block;
        margin-left: 10px;
    }
    .compare{
        display: flex;
        width:88%;
        height: 20px;
        line-height: 20px;
        color: white;
        font-size: 12px;
    }
    .total_bids{
        width: 50%;
        background: #27de27;
        transition: width 0.5s;
        padding-left: 5px;
    }
    .total_asks{
        width: 0%;
        background: rgb(249, 75, 75);
        transition: width 0.5s;
        text-align: right;
        padding-right: 5px;
    }
    .total_asks:hover{
        cursor: pointer;
        outline: 1px solid rgb(230,230,230);
    }
    .total_bids:hover{
        cursor: pointer;
        outline: 1px solid rgb(230,230,230);
    }
    .limit{
        width: 88%;
        margin-top: 15px;
        font-size: 11px;
    }
    .limit>div{
        margin-right: 10px;
        display: inline-block;
    }
    .fiveList_box{
        width: 88%;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
    }
    .aList{
        width: 45%;
    }
    .bList{
        width: 45%;
    }
    .fiveList_item_a{
        display: flex;
        height: 20px;
        line-height: 20px;
        justify-content: right;
        margin-bottom: 2px;
    }
    .fiveList_item_b{
        display: flex;
        height: 20px;
        line-height: 20px;
        justify-content: left;
        margin-bottom: 2px;
    }
    .aPrice{
        width: 40%;
        text-align: right;
        margin-left: 7px;
    }
    .aSize{
        width: 0%;
        text-align: left;
        background: rgb(249, 75, 75);
        color: white;
        padding-left: 3px;
        font-size: 9px;
        transition:width 0.5s;
    }
    .bPrice{
        width: 40%;
        text-align: left;
        margin-right: 7px;
    }
    .bSize{
        width: 0%;
        text-align: right;
        background: #27de27;
        color: white;
        padding-right: 3px;
        font-size: 9px;
        transition:width 0.5s;
    }
    .aSize:hover{
        cursor: pointer;
        outline: 1px solid rgb(230,230,230);
    }
    .bSize:hover{
        cursor: pointer;
        outline: 1px solid rgb(230,230,230);
    }
    .underline{
        border-bottom: 2px solid orange;
    }
    .tradeDetail{
        margin-top: 5px;
        margin-bottom: 5px;
        width: 88%;
    }
    ::v-deep .tradeDetail .cell{
        text-align: center !important;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
    }
    .scrollBox{
        width: 88%;
        height: calc(100% - 280px);
        margin-top: 15px;
        overflow-y:scroll;
    }
    .ai{
        width: 100%;
        height: 200px;
        margin-top: 10px;
        border: 1px solid red;
    }
    .others{
        width: 100%;
        height: 200px;
        margin-top: 10px;
    }
    .others_select{
        width: 100%;
        height: 25px;
        background: rgb(240,240,240);
        border-radius: 5px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 10px;
    }
    .others_select_item{
        width: 50%;
        height: 25px;
        text-align: center;
        line-height: 25px;
        font-size: 12px;
    }
    .others_select_item_left{
        border-right: 1px solid white;
        border-radius: 5px 0 0 5px;
    }
    .others_select_item_right{
        border-radius: 0 5px 5px 0;
    }
    .others_select_item:hover{
        cursor: pointer;
        background: rgb(170,170,170);
        color: white;
    }
    .others_selected{
        background: rgb(190,190,190);
        color: white;
    }
    .others_component{
        width: 100%;
        height: 100px;
    }
    .green{
        color: #27de27;
    }
    .red{
        color: rgb(249, 75, 75);
    }
    .black{
        color:black;
    }
    
</style>
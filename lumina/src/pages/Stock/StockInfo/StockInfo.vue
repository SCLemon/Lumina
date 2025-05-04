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
                    <div :class="`price_change ${info.change>0?'green':info.change<0?'red':'black'}`">{{info.change>=0?'+':''}}{{ info.change }}</div>
                    <div :class="`price_percent ${info.change>0?'green':info.change<0?'red':'black'}`">{{info.change>=0?'+':''}}{{ info.changePercent }}%</div>
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
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'StockInfo',
    data(){
        return{
            name:'台積電',
            symbol:2330,
            timer:0,
            info:{},
        }
    },
    watch:{
        '$route.query':{
            deep:true,
            async handler(){
                this.symbol = this.$route.query.symbol?this.$route.query.symbol:2330;
                this.name = this.$route.query.name?this.$route.query.name:'台積電'
                await this.getData();
                await this.getInfo();
            }
        }
    },
    computed:{
        compare_bids(){
            if(this.info && this.info.total && this.info.total.tradeVolume){
                console.log((this.info.total.tradeVolumeAtBid / this.info.total.tradeVolume).toFixed(4)*100)
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
        this.symbol = this.$route.query.symbol?this.$route.query.symbol:2330;
        this.name = this.$route.query.name?this.$route.query.name:'台積電'

        await this.getData()
        await this.getInfo();
    },
    beforeDestroyed(){
        this.chart.destroy();
    },
    methods:{
        showColor(price){
            return price>this.info.referencePrice?'green':price<this.info.referencePrice?'red':'black'
        },
        showLength(target, size){
            if(this.info && size){
                const maxSize = Math.max(...this.info[target].map(t => t.size));
                return (((size/maxSize)*50).toFixed(2))
            }
            else return 0;
        },
        async getData(){
            const response = await axios.get(`/stock/history?symbol=${this.symbol}`);
            this.drawChart(response.data)
        },
        async getInfo(){
            const res = await axios.get(`/stock/getInfo?symbol=${this.symbol}`)
            this.info = res.data;
        },
        drawChart(rawData){
            const  groupingUnits = [['day',[1]],['week',[1]], ['month',[1, 2, 3, 4, 6]]];
            const ohlc = []
            const volume = [];
            var d = rawData;
            for(var i=0; i<d.length;i++){
                ohlc.push([d[i][0],d[i][1],d[i][2],d[i][3],d[i][4]])
                volume.push([d[i][0],d[i][5]])
            };
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
        width: calc(100vw - 350px);
        position: relative;
    }
    .column{
        padding-top: 12px;
        width: 350px;
        height: calc(100vh - 60px);
        overflow-y: scroll;
    }
    .detail{
        width: 100%;
        height: 350px;
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
        background: rgb(249, 75, 75);
        transition: width 0.5s;
        padding-left: 5px;
    }
    .total_asks{
        width: 0%;
        background: #27de27;
        transition: width 0.5s;
        text-align: right;
        padding-right: 5px;
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
        height: 200px;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
    }
    .aList{
        width: 45%;
        height: 200px;
    }
    .bList{
        width: 45%;
        height: 200px;
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
        background: #27de27;
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
        background: rgb(249, 75, 75);
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
<template>
  <div class="all">
    <div class="main">
        <div id="container" ref="container" ></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'StockInfo',
    data(){
        return{
            symbol:2330,
            timer:0,
        }
    },
    watch:{
        '$route.query':{
            deep:true,
            handler(){
                this.chart.destroy();
                this.symbol = this.$route.query.symbol?this.$route.query.symbol:2330;
                this.getData();
            }
        }
    },
    mounted(){
        this.symbol = this.$route.query.symbol?this.$route.query.symbol:2330;
        this.getData()
    },
    beforeDestroyed(){

    },
    methods:{
        async getData(){
            const response = await axios.get(`/stock/history?symbol=${this.symbol}`);
            this.drawChart(response.data)
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
                    height: window.innerHeight - 45,         // 設定圖表的總高度
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
    .container{
        height: calc(100vh - 60px);
        position: relative;
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
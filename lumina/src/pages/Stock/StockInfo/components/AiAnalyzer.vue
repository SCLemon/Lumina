<template>
  <div class="ai_main" ref="ai_main">
    <div class="isLoading" v-if="isLoading">
        <div class="iL-text">模型正在運算，請稍候...</div>
        <el-skeleton :rows="5" animated />
    </div>
    <div class="result" v-if="!isLoading && results.status">
        <div class="result_title"><i class="fa-solid fa-chart-simple"></i> 上漲趨勢預測</div>
        <div class="result_dashboard">
            <el-progress type="dashboard" :percentage="results.percent" :color="colors"></el-progress>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name:'AiAnalyzer',
    props: {
        stockId: {
            default: 2330,
            required: false
        }
    },
    data(){
        return {
            isLoading:false,
            results:{
                status:true,
                percent:30,
            },
            colors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ]
        }
    },
    watch: {
        stockId: {
            handler(newVal, oldVal) {
                this.analyzeStock(newVal)
            },
            immediate: true
        }
    },
    methods: {
        async analyzeStock(id) {
            try{
                this.isLoading = true;
                
                const res = await axios.get(`/stock/predict?symbol=${this.stockId}`);
                
                if(res.data && res.data.status == false){
                    this.$refs.ai_main.style = 'display:none;'
                    this.$notify.error({ title: '模型運算提示', message: '本支股票暫時無法使用 AI 智能運算。' });
                }

                this.isLoading = false;
                this.results.percent = 0;
                setTimeout(() => {
                    this.results = {
                        status: res.data.status,
                        percent: +res.data.percent
                    }
                }, 200);
            }
            catch(e){
                this.$refs.ai_main.style = 'display:none;'
                this.results.status = false;
                this.isLoading = false;
                this.$notify.error({ title: '模型運算提示', message: '本支股票暫時無法使用 AI 智能運算。' });
            }
        }
    }
}
</script>

<style scoped>
    .ai_main{
        width: 342px;
        height: 200px;
        padding: 5px;
        box-sizing: border-box;
    }
    .iL-text{
        margin-bottom: 15px;
        background: linear-gradient(90deg, #999999 25%, #777777 37%, #999999 63%);
        background-size: 400% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: iL-loading 1.4s ease infinite;
    }
    @keyframes iL-loading {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }
    .result_title{
        font-size: 14px;
        font-weight: bolder;
    }
    .result_dashboard{
        width: 100%;
        height: 184px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    ::v-deep .el-progress-circle{
        width: 150px !important;
        height: 150px !important;
    }
</style>
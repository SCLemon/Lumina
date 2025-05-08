<template>
  <div class="exchange">
    <el-table :data="tableData" style="width: 100%"  empty-text="暫無匯率資訊">
        <el-table-column prop="currency" label="幣別" width="160">
            <template slot-scope="scope">
                <div class="img"><img :src="`img/flags/${scope.row.flag}.svg`" alt=""></div>
                <div class="currency">{{ scope.row.currency }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="spotBuy" label="即期買進" width="95"></el-table-column>
        <el-table-column prop="spotSell" label="即期賣出" width="95"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name:'ExchangeRate',
    mounted(){
        this.getData();
        this.timer = setInterval(() => {
            this.getData();
        }, 15000);
    },
    data(){
        return {
            timer:0,
            tableData:[]
        }
    },
    methods:{
        async getData(){
            const res = await axios.get('/stock/exchangeRate')
            if(res.data){
                this.tableData = res.data
            }
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    }
}
</script>

<style scoped>
    .exchange{
        height: calc(100vh - 505px);
        overflow-y: scroll;
    }
    .img{
        width: 26.67px;
        height: 20px;
    }
    .img>img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .currency{
        margin-top: 5px;
    }
</style>
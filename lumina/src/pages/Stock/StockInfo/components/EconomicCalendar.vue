<template>
  <div class="eco_table">
    <template>
  <el-table :data="tableData" class="table"  border style="width: 100%" empty-text="暫無數據">
    <el-table-column prop="dateTime" label="日期"></el-table-column>
    <el-table-column prop="name" label="名稱" width="70"></el-table-column>
    <el-table-column prop="actual" label="實際" width="60"></el-table-column>
    <el-table-column prop="forecast" label="預測" width="60"></el-table-column>
    <el-table-column prop="previous" label="前值" width="60"></el-table-column>
  </el-table>
</template>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'EconomicCalendar',
    mounted(){
        this.getData()
    },
    data(){
        return {
            tableData:[]
        }
    },
    methods:{
        async getData(){
            const res = await axios.get('/stock/economy');
            this.tableData = res.data
        }
    }
}
</script>

<style scoped>
    .eco_table{
        max-height: 370px;
        overflow-y: scroll;
        padding-bottom: 20px;
    }
    .table{
        font-size: 12px;
    }
</style>
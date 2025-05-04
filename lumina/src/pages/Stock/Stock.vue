<template>
    <div>
        <div class="header">
            <div class="logo" @click="goIndex()"><img src="img/logo.png" alt=""></div>
            <div class="search">
                <div class="search_input" ref="search_input">
                    <input type="text" class="search_text" placeholder="請輸入股票名稱或代號" v-model="input">
                    <div class="listBox" v-if="input.length">
                        <div v-for="(obj,id) in findData" :key="id" class="list_item" @click="goTo(obj)">
                            <div class="stock_name">{{ obj.name }}</div>
                            <div class="stock_symbol">{{ obj.symbol }}</div>
                        </div>
                    </div>
                </div>
                <i class="el-icon-search search_icon" @click="toggleSearchInput()"></i>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Stock',
    data(){
        return{
            isSearch:false,
            list:[],
            input:'',
            market:'TWSE',
            selectStock: '',
            timeout:  null
        }
    },
    computed:{
        findData(){
            return this.list.filter(obj=>{
                return obj.name.includes(this.input) || obj.symbol.includes(this.input);
            })
        }
    },
    mounted(){
       this.getData();   
    },
    methods:{
        goIndex(){
            this.$router.push('/').catch(e=>{})
        },
        toggleSearchInput(){
            this.$refs.search_input.classList.toggle('search_input_open')
            this.input = '';
        },
        goTo(stock){
            this.toggleSearchInput();
            this.$router.push({
                path:'/stock/stockInfo',
                query:{
                    name:stock.name,
                    symbol:stock.symbol,
                    timestamp:Date.now(),
                }
            }).catch(e=>{})
        },
        async getData(){
            const twse = await (await axios.get(`/stock/list?exchange=TWSE`)).data.data
            const tpex = await (await axios.get(`/stock/list?exchange=TPEx`)).data.data
            if(twse && tpex){
                this.list = twse.concat(tpex);
            }
            else{
                setTimeout(async () => {
                    await this.getData();
                }, 1000);
            }
        },
    }
}
</script>

<style scoped>
    .header{
      width:100%;
      height: 60px;
      line-height: 60px;
      font-weight: bolder;
      /* border-bottom:0.1px solid rgb(210, 210, 210); */
      font-size: 20px;
      position: sticky;
      top:0;
      background-color: white;
      position: relative;
      display: flex;
      align-items: center
    }
    .logo{
        height: 50px;
        object-fit: contain;
        margin-left: 5px;
    }
    .logo:hover{
        cursor: pointer;
    }
    .logo>img{
        max-width: 100%;
        max-height: 100%;
    }
    .search{
        width: 250px;
        height: 100%;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: right;
        margin-right: 10px;
        position: relative;
    }
    .search_input{
        width: 0px;
        height: 40px;
        border-radius: 20px;
        transition: all  0.75s;
        direction: ltr;
        text-align: left;
        border: 1px solid rgb(230,230,230);
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .search_input_open{
        width: 250px;
        opacity: 1;
    }
    .search_icon{
        width: 40px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .search_icon:hover{
        cursor: pointer;
    }
    .search_text{
        width: 90%;
        border: 0;
        line-height: 20px;
    }
    .search_text:focus{
        outline: 0;
    }
    .listBox{
        position: absolute;
        width: 100%;
        height: auto;
        max-height: 200px;
        border: 1px solid rgb(230,230,230);
        border-radius: 5px;
        left: 0;
        top:55px;
        overflow-y: scroll;
    }
    .list_item{
        font-size: 13px;
        padding-left: 10px;
        padding-right: 10px;
        height: 40px;
        line-height: 40px;
        display: flex;
        background: white;
    }
    .stock_name{
        margin-right: auto;
    }
    .stock_symbol{
        margin-left: auto;
        color: gray;
    }
    .list_item:hover{
        cursor: pointer;
        background: black;
        color: white;
    }
    .list_item:hover .stock_symbol{
        color: white;
    }
</style>
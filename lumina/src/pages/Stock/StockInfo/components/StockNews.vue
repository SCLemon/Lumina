<template>
  <div class="list" ref="list" @scroll="handleScroll">
    <div @click="openNews(obj.newsId)" class="list_item" v-for="(obj,id) in news" :key="id">
      <div class="news_left">
        <div class="news_top">{{obj.categoryName}}</div>
        <div class="news_title">{{ obj.title }}</div>
      </div>
      <div class="news_right">
        <img :src="(obj.coverSrc && obj.coverSrc.s)?obj.coverSrc.s.src:''" alt="">
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <iframe class="iframe" :src="iframeSrc"></iframe>
    </el-dialog>
  </div>
</template>
<!-- https://news.cnyes.com/news/id/123 -->
<script>
import axios from 'axios'
export default {
    name:'StockNews',
    data(){
      return {
        news:[],
        page:1,
        isLoaded:false,
        dialogTableVisible: false,
        iframeSrc:'',
      }
    },
    mounted(){
      this.getNews();
    },
    methods:{
      async getNews(){
        const res = await axios.get(`/stock/news?page=${this.page}`);
        this.news = res.data;
        this.isLoaded = true;
      },
      async appendNews(){
        this.isLoaded = false;

        const res = await axios.get(`/stock/news?page=${this.page}`);
        this.news = this.news.concat(res.data);
        this.isLoaded = true;
      },
      openNews(id){
        this.iframeSrc = `https://news.cnyes.com/news/id/${id}`;
        this.dialogTableVisible = true;
      },
      async handleScroll(){
        const list = this.$refs.list;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 30) {
          if(this.isLoaded){
            this.page++;
            await this.appendNews();
          }
        }
      }
    }
}
</script>

<style scoped>
    .list{
        width:100%;
        height: 370px;
        padding-bottom: 20px;
        overflow-y: scroll;
    }
    .list_item{
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .list_item:hover{
      cursor: pointer;
      background: rgb(240,240,240);
    }
    .news_left{
      width: 65%;
      height: 80px;
    }
    .news_right{
      width: 30%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
    }
    .news_right>img{
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 3px;
    }
    .news_top{
      font-size: 14px;
      height: 20px;
      line-height: 20px;
    }
    .news_title{
      width: 100%;
      margin-top: 5px;
      font-size: 14px;
      height: 40px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ::v-deep .el-dialog{
      width: 85vw;
      height: 85vh;
      margin-top: 7vh !important;
    }
    ::v-deep .el-dialog__body{
      height: 100%;
      width: 100%;
    }
    .iframe{
      width: 100%;
      height: 100%;
      border: none;
    }
</style>
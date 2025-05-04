<template>
  <div id="app" class="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
  mounted(){
    this.$bus.$on('handleAlert',(msg,type)=>this.handleAlert(msg,type));
    
  },

  methods:{
    handleAlert(msg,type){
      this.$message({
          message: msg,
          type: type
      });  
    },
  }
}
</script>

<style>
  ::-webkit-scrollbar{
    display: none;
  }

</style>
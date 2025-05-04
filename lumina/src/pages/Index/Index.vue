<template>
    <div class="view">
        <div class="header">
            <div class="logo"><img class="logo_img" src="img/logo_trans.png" alt="" @click="goTo('/')"></div>
            <div class="contact">
                <div class="contact_item" @click="scrollToSection('introduction')">平台介紹</div>
                <div class="contact_item" @click="goHerf('#')">設計文件</div>
                <div class="contact_item" @click="goHref('https://github.com/SCLemon/Lumina')">原始代碼</div>
                <div class="contact_item" @click="scrollToSection('contact')">聯絡我們</div>
            </div>
        </div>
        <div class="top" ref="top">
            <div class="content">
                <div class="title_block">
                    <div class="title">Lumina Stock AI</div>
                    <div class="subTitle"><div class="subText" ref="subText">{{ subTitle }}</div></div>
                    <div class="box">
                        <div class="btn btn-1" @click="goTo('/stock')">快速開始 <i class="fa-solid fa-arrow-right start-arrow"></i></div>
                        <div class="btn btn-2" @click="scrollToSection('introduction')">詳細資料 <i class="fa-solid fa-chevron-right"></i></div>
                    </div>
                </div>
                <div class="carousel">
                    <el-carousel :interval="3000" type="card" height="281.25px">
                        <el-carousel-item v-for="(item,id) in banner" :key="id">
                            <div class="medium">
                                <img :src="item" alt="">
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </div>
        <div class="intro" ref="introduction">
            <div class="intro_title_1">平台介紹</div>
            <div class="intro_simple_box">
                <div class="intro_simple">
                    <div class="intro_text_title">📈 即時行情・智慧決策 — 為投資而生的 AI 分析平台</div>
                    <div class="intro_text">
                        本平台是一款專為投資人與金融分析師打造的智慧決策工具，結合即時股價資料、多重技術指標與 AI 輔助預測，協助用戶全面掌握市場動態。
                        我們以「資訊透明、數據整合、操作簡易」為設計核心，無論是新手還是資深操盤者，都能迅速上手，做出更快、更準確的交易判斷。
                    </div>
                    <div class="intro_text_title">🔄 資料汲取流暢不間斷 — 實時更新，無縫連接</div>
                    <div class="intro_text">
                        平台採用先進的資料抓取技術，確保所有市場數據、股價資訊與經濟指標能實時更新，並無縫呈現在用戶介面上。資料流動順暢無阻，無論您在查看即時股價還是監控多重技術指標，所有資訊皆可即時反映，避免任何延遲或中斷，讓您每一刻都能掌握市場的最新變化。
                    </div>
                </div>
                <div class="intro_img"><img src="img/fast.jpg" alt=""></div>
            </div>
        </div>
        <div class="intro" ref="feature">
            <div class="intro_title_2">平台特色</div>
            <div class="intro_simple_box">
                <div class="intro_img"><img src="img/news.jpg" alt=""></div>
                <div class="intro_simple">
                    <div class="intro_text_title">🎯 特色一：極簡操作介面，AI 輔助預測零門檻</div>
                    <div class="intro_text">
                        平台採用現代化設計與 AI 輔助分析技術，操作流程直覺簡單，無需程式背景與繁瑣設定即可輕鬆上手。
                        不論是查詢個股趨勢、觀察技術指標，或進行預測分析，都能在幾個步驟內完成，協助使用者快速掌握市場脈動，做出更聰明的投資決策。
                    </div>
                    <div class="intro_text_title">📰 特色二：即時新聞整合與經濟數據統整</div>
                    <div class="intro_text">
                        掌握市場脈動從未如此簡單。本平台串接多元財經媒體與官方經濟資料來源，提供即時新聞推播與關鍵經濟指標整理，讓使用者第一時間掌握全球市場變化。
                        不論是突發消息、總經趨勢，還是利率、通膨等數據更新，幫助投資人迅速消化資訊，做出理性判斷。
                    </div>
                </div>              
            </div>
        </div>
        <div class="footer" ref="contact">
            <div class="footer_item">
                <div>聯絡方式：blc0000421@gmail.com</div>
                <div>Copyright © 2025 Lumina AI All Rights Reserved</div>
            </div>
        </div>
        <div class="back" @click="scrollToSection('top')"><i class="fa-solid fa-angles-up"></i></div>
    </div>
</template>
  
<script>
export default {
    name: "Index",
    data(){
        return {
            banner:['img/banner1.jpg','img/banner2.jpg','img/banner3.jpg'],
            subTitle:'Precise insights, smart decisions — Stock AI shaping the future of investing.'
        }
    },
    mounted(){
        setTimeout(() => {
            try{
                let el = this.$refs.subText;
                if(el) el.style = 'border-right:0'
            }
            catch(e){}
        }, 6500);
    },
    methods: {
        goTo(path){
            this.$router.push(path).catch((e)=>{})
        },
        scrollToSection(refName) {
            const element = this.$refs[refName];
            if (element) {
                const offset = 120;
                const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        },
        goHref(url){
            window.open(url,'_blank')
        }
    },
    beforeDestroy(){
        
    }
};
</script>
  
<style scoped>
    .view{
        min-width: 1440px;
    }
    .back{
        position: fixed;
        bottom: 105px;
        right: 15px;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: white;
        font-size: 24px;
        text-shadow: 1px 1px 1px black;
        background: rgba(0,0,0,0.3);
        border-radius: 5px;
    }
    .back:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.6);
    }
    .header{
        width: 100vw;
        min-width: 1440px;
        height: 90px;
        display: flex;
        position: fixed;
        top:0;
        left: 0;
        align-items: center;
        background: black;
        z-index: 3;
    }
    .logo{
        width: 250px;
        margin-left: 15px;
    }
    .logo_img{
        width:100%;
    }
    .logo_img{
        cursor: pointer;
    }
    .contact{
        width: 350px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgb(230,230,230);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-left: auto;
        margin-right: 10px;
        transition: all 0.25s;
    }
    .contact_item:hover{
        cursor: pointer;
        color: white;
    }
    .top {
        width: 100vw;
        min-width: 1440px;
        height: 100vh;
        min-height: 858px;
        color: white;
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content{
        width: 1000px;
        height: 580px;
        position: relative;
    }
    .time{
        font-weight: 500;
        text-align: center;
        font-size: 14px;
    }
    .title_block{
        width: 1000px;
        margin: 0 auto;
    }
    .title {
        font-weight: bolder;
        text-align: center;
        font-size: 64px;
        line-height: 2;
    }
    .subTitle {
        text-align: left;
        line-height: 17px;
        width: 580px;
        margin: 0 auto;
    }
    .subText {
        white-space: nowrap;
        overflow: hidden;
        border-right: 2px solid white;
        color: black;
        padding-right: 2px;
        width: 0;
        animation: typing 4s steps(77) 1s 1 normal forwards, blink 0.75s step-end infinite;
    }

    @keyframes typing {
        0% {
            width: 0;
            color: white;
            border-right: 2px solid white;
        }
        100% {
            width: 100%;
            color: white;
        }
    }
    @keyframes blink {
        0% {
            border-right-color: white;
        }
        50% {
            border-right-color: transparent;
        }
        100% {
            border-right-color: white;
        }
    }
    .box {
        width: 250px;
        height: 50px;
        border-radius: 50px;
        margin: 0 auto;
        margin-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .start-arrow{
        transform: rotate(-45deg);
    }
    .btn{
        width: 120px;
        height: 40px;
        line-height: 40px;    
        text-align: center;
        font-size: 14px;
    }
    .btn:hover{
        cursor: pointer;
    }
    .btn-1{
        color: white;
        margin-right: 10px;
        border-radius: 40px;
        border: 1px solid black;
        color: black;
        background: rgb(230,230,230);  
        transition: all 0.25s;
    }
    .btn-1:hover{
        background: white;
    }
    .btn-2{
        color: rgb(230,230,230);
        transition: all 0.25s;
    }
    .btn-2:hover{
        color:white;
    }
    .carousel{
        width: 1000px;
        margin: 0 auto;
        margin-top: 40px;
        position: absolute;
        bottom: 0;
    }
    .meduim{
        width: 100%;
    }
    .medium>img{
        width: 100%;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    ::v-deep .el-carousel__indicator--horizontal{
        display: none !important;
    }

    .intro{
        width: 100%;
    }
    .intro_title_1{
        width: 90%;
        height: 100px;
        margin: 0 auto;
        line-height: 100px;
        text-align: left;
        font-size: 28px;
        font-weight: bolder;
    }
    .intro_title_2{
        width: 90%;
        height: 100px;
        margin: 0 auto;
        line-height: 100px;
        text-align: right;
        font-size: 28px;
        font-weight: bolder;
    }
    .intro_simple_box{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .intro_simple{
        width: 50%;
    }
    .intro_img{
        width: 540.44px;
        height: 304px;
    }
    .intro_img>img{
        width: 100%;
    }
    .intro_text_title{
        width: 95%;
        margin: 0 auto;
        font-weight: bolder;
        margin-bottom: 10px;
        line-height: 2;
        font-size: 18px;
    }
    .intro_text{
        width: 95%;
        margin: 0 auto;
        line-height: 2;
        text-align: justify;
        margin-bottom: 10px;
    }
    .footer{
        margin-top: 40px;
        width: 100%;
        height: 110px;
        background: black;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .footer_item{
        line-height: 2;
        text-align: center;
    }
</style>
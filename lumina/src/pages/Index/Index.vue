<template>
    <div class="view">
        <div class="header">
            <div class="logo"><img class="logo_img" src="img/logo_trans.png" alt="" @click="goTo('/')"></div>
            <div class="contact">
                <div class="contact_item" @click="scrollToSection('introduction')">平台介紹</div>
                <div class="contact_item" @click="scrollToSection('feature')">平台特色</div>
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
                    <div class="intro_text_title">🌐 雲端教育的全新體驗 — 為教學而生的智慧平台</div>
                    <div class="intro_text">
                        本平台是一款專為雲端教學量身打造的教育管理系統，適用於個人家教、補習班、以及各類教學機構，協助用戶輕鬆管理學生、課程與教材內容。
                        我們以「簡潔直觀、快速上手」為設計核心，讓每位教育工作者都能無痛轉型數位教學，輕鬆掌握現代化教學需求。
                    </div>
                    <div class="intro_text_title">🎗 推動教育平權 — 我們一起努力</div>
                    <div class="intro_text">
                        我們相信，知識應該是無價的。
                        因此，若您正致力於扶助弱勢、並為弱勢學子提供免費教學資源，歡迎向我們申請公益使用資格。<br>
                        ✨ 經審核通過後，我們將全額提供平台使用額度，完全免費，與您攜手打造更有希望的未來。
                    </div>
                </div>
                <div class="intro_img"><img src="img/volunteer.jpg" alt=""></div>
            </div>
        </div>
        <div class="intro" ref="feature">
            <div class="intro_title_2">平台特色</div>
            <div class="intro_simple_box">
                <div class="intro_img"><img src="img/lock.jpg" alt=""></div>
                <div class="intro_simple">
                    <div class="intro_text_title">🎯 特色一：極簡操作介面，零學習曲線上手</div>
                    <div class="intro_text">
                        平台採用現代化介面設計，操作邏輯直覺清晰，無需繁瑣設定與技術背景即可快速上手。
                        不論是排課、上傳教材，還是管理學生資訊，皆可透過簡單幾步完成，大幅降低教學行政負擔。
                    </div>
                    <div class="intro_text_title">🔐 特色二：嚴謹的隱私與資料保護機制</div>
                    <div class="intro_text">
                        我們深知教育數據的敏感性，因此平台採用資料分群隔離以及嚴格的權限控管機制，保障學生與教師的個資與智慧財產權。
                        本平台同時支援多層身份驗證機制，可以大幅降低有心人士的侵擾，使用戶與學生能夠獲得安全的教育環境。
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
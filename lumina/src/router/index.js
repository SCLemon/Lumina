import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'
import axios from 'axios'
import Stock from '../pages/Stock/Stock.vue'
import Index from '../pages/Index/Index.vue'
import StockInfo from '../pages/Stock/StockInfo/StockInfo.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {
            path:'/index',
            component:Index
        },
        {
            path:'/stock',
            component:Stock,
            children:[
                {
                    path:'stockInfo',
                    component:StockInfo
                },
                {
                    path:'',
                    redirect:'stockInfo'
                }
            ]
        },
        {
            path:'/stockInfo',
            component:StockInfo
        },
        {
            path:'/',
            redirect:'index'
        }
    ]
});
router.beforeEach((to, from, next) => {
    next()
})
export default router
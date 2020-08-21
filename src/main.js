import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import axios from 'axios';
import myCharts from '../src/components/myEcharts' //引入eCharts 文件
import  'echarts-liquidfill'

import round from '../src/components/round' //引入eCharts 文件
import moment from 'moment'
Vue.use(myCharts);
Vue.use(round);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios;
//默认请求格式
axios.defaults.headers.post['Content-Type'] = 'application/json';
// // 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = store.state.Authorization;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.headers.authorization) {
        store.state.Authorization = response.headers.authorization
    }
    return response;
}, function (error) {
    // 对响应错误做点什么

    if (error.response.status==401){
        router.replace('/overtime')
    }
    return Promise.reject(error);
});
//接口url
// Vue.prototype.$BaseUrl = "http://127.0.0.1:8090/api";
// Vue.prototype.$BaseUrl = "http://192.168.50.72:8082/mk168/web";
//线上地址
// Vue.prototype.$BaseUrl = "http://mtic.mantoo.com.cn:8203/web/mk168";
Vue.prototype.$BaseUrl = "http://mk168.mantoo.com.cn/mk168/web";

//图片/文件url
// Vue.prototype.$url = "http://192.168.50.72:8081/static/mk168";
//线上图片地址
// Vue.prototype.$url = "http://mtic.mantoo.com.cn:8203/static/mk168";
Vue.prototype.$url = "http://mk168.mantoo.com.cn/static";

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

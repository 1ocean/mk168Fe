import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    //后端需要的默认请求头
    Authorization: '',
    //用户信息
    userInfo: '',
    //当前显示的页面名称
    nowName:'首页',
    //现场跳转当前现场得数据
    structureData:{},
    //现场跳转当前现场所属项目得数据
    nowProjectName:'',
    //传感器跳转当前传感器得数据
    sensorData:{},
    //网关跳转当前网关得数据
    gatewayData:{},
    //传感器报警跳转当前传感器得数据
    sensorAlarmData:{},
    //变量跳转当前变量得数据
    variableData:{},
    //变量报警跳转当前变量得数据
    variableAlarmData:{},
    //网关报警跳转当前网关详情得数据
    gatewayAlarmData:{},
    //设备年限跳转得数据
    equipmentLifeData:{},
    //设备年限报警跳转得数据
    equipmentLifeAlarmData:{},
    //控制设备跳转得数据
    equipmentData:{},
    //变量分组跳转得数据
    groupingData:{},
    //左侧菜单栏默认选中，给按钮点击跳转页面用的
    defaultActive:'',
    //设备年限管理tabs下标
    equipmentLifeActive:'0',
    //设备年限报警tabs下标
    equipmentAlarmActive:'0',

    //头像地址
    userImgUrl:'',
    //当前报警设备数据
    switchSensorData:'',
    //当前报警设备报警数据
    nowSwitchSensorAlarmData:''
};
const store = new Vuex.Store({
    state,
    mutations: {},
    actions: {},
    modules: {}
});
export default store

import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import overtime from '../views/404.vue'
import home from '../views/Home.vue'
import systemSetting from '../views/system/systemSetting.vue'
import wechatSetting from '../views/system/wechatSetting.vue'
import userInfos from '../views/system/userInfos.vue'
import roleControl from '../views/user/roleControl.vue'
import userControl from "../views/user/userControl";
import project from "../views/project/projectControl";
import projectMonitoring from "../views/project/projectMonitoring";
import projectOverview from "../views/project/projectOverview";
import structureDetail from "../views/project/structureDetail";
import gatewayManagement from "../views/equipmentManagement/gatewayManagement";
import gatewayDetail from "../views/equipmentManagement/gatewayDetail";
import sensorControl from "../views/equipmentManagement/sensorControl";
import switchSensorControl from "../views/equipmentManagement/switchSensorControl";
import switchSensorControlDetail from "../views/equipmentManagement/switchSensorControlDetail";
import protocolControl from "../views/parameterControl/protocolControl";
import arithmeticControl from "../views/parameterControl/arithmeticControl";
import measurementValue from "../views/realTimeData/measurementValue";
import variableValue from "../views/realTimeData/variableValue";
import originalAnalyze from "../views/statisticAnalysis/originalAnalyze";
import variableAnalyze from "../views/statisticAnalysis/variableAnalyze";
import sensorAlarm from "../views/alarmControl/sensorAlarm";
import variableAlarmDetail from "../views/alarmControl/variableAlarmDetail";
import variableAlarm from "../views/alarmControl/variableAlarm";
import gatewayAlarm from "../views/alarmControl/gatewayAlarm";
import equipmentLifeAlarm from "../views/alarmControl/equipmentLifeAlarm";
import switchSensorAlarm from "../views/alarmControl/switchSensorAlarm";
import switchSensorAlarmDetail from "../views/alarmControl/switchSensorAlarmDetail";
import equipmentLifeAlarmDetail from "../views/alarmControl/equipmentLifeAlarmDetail";
import homePage from "../views/homePage";
import sensorDetail from "../views/equipmentManagement/sensorDetail";
import equipmentLifeControl from "../views/equipmentManagement/equipmentLifeControl";
import equipmentLifeDetail from "../views/equipmentManagement/equipmentLifeDetail";
import equipmentControl from "../views/equipmentManagement/equipmentControl";
import equipmentDetail from "../views/equipmentManagement/equipmentDetail";
import variableControl from "../views/parameterControl/variableControl";
import elementControl from "../views/parameterControl/elementControl";
import variableDetail from "../views/parameterControl/variableDetail";
import sensorAlarmDetail from "../views/alarmControl/sensorAlarmDetail";
import gatewayAlarmDetail from "../views/alarmControl/gatewayAlarmDetail";
import groupingVariable from "../views/statisticAnalysis/groupingVariable";
import variableGroupingAnalyze from "../views/statisticAnalysis/variableGroupingAnalyze";
import groupingDetail from "../views/statisticAnalysis/groupingDetail";
import bigData from "../views/dataBoard/bigData";
import bigDataHome from "../views/dataBoard/bigDataHome";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: login
    },
    {
        path: '/overtime',
        name: 'overtime',
        meta: {
            title: '登录超时'
        },
        component: overtime
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页'
        },
        component: home,
        children: [
            {
                path: '/homePage',
                name: 'homePage',
                meta: {
                    title: '首页'
                },
                component: homePage,
            },
            {
                path: '/system/systemSetting',
                name: 'systemSetting',
                meta: {
                    title: '系统设置'
                },
                component: systemSetting
            },
            {
                path: '/system/userInfo',
                name: 'systemSetting',
                meta: {
                    title: '个人信息'
                },
                component: userInfos
            },
            {
                path: '/system/wechatConfig',
                name: 'wechatSetting',
                meta: {
                    title: '微信端配置'
                },
                component: wechatSetting
            },
            {
                path: '/roleControl',
                name: 'roleControl',
                meta: {
                    title: '角色管理'
                },
                component: roleControl,
            },
            {
                path: '/userControl',
                name: 'userControl',
                meta: {
                    title: '用户管理'
                },
                component: userControl,
            },
            {
                path: '/project/projectControl',
                name: 'projectControl',
                meta: {
                    title: '项目管理'
                },
                component: project,
            },
            {
                path: '/project/projectMonitoring',
                name: 'projectMonitoring',
                meta: {
                    title: '项目监控'
                },
                component: projectMonitoring,
            },
            {
                path: '/project/overViewProject',
                name: 'projectOverview',
                meta: {
                    title: '项目概览'
                },
                component: projectOverview,
            },
            {
                path: '/project/structureDetail',
                name: 'structureDetail',
                meta: {
                    title: '现场详情'
                },
                component: structureDetail,
            },
            {
                path: '/equipmentManagement/gatewayManagement',
                name: 'gatewayManagement',
                meta: {
                    title: '网关管理'
                },
                component: gatewayManagement,
            },
            {
                path: '/equipmentManagement/gatewayDetail',
                name: 'gatewayDetail',
                meta: {
                    title: '网关管理详情'
                },
                component: gatewayDetail,
            },
            {
                path: '/equipmentManagement/sensorControl',
                name: 'sensorControl',
                meta: {
                    title: '传感器管理'
                },
                component: sensorControl,
            },
            {
                path: '/equipmentManagement/equipmentLifeControl',
                name: 'equipmentLifeControl',
                meta: {
                    title: '设备年限管理'
                },
                component: equipmentLifeControl,
            },
            {
                path: '/equipmentManagement/equipmentLifeDetail',
                name: 'equipmentLifeDetail',
                meta: {
                    title: '设备年限管理详情'
                },
                component: equipmentLifeDetail,
            },
            {
                path: '/equipmentManagement/equipmentControl',
                name: 'equipmentControl',
                meta: {
                    title: '控制设备管理'
                },
                component: equipmentControl,
            },
            {
                path: '/equipmentManagement/equipmentDetail',
                name: 'equipmentDetail',
                meta: {
                    title: '控制设备管理详情'
                },
                component: equipmentDetail,
            },
            {
                path: '/equipmentManagement/switchSensorControl',
                name: 'gatewayAlarm',
                meta: {
                    title: '报警设备'
                },
                component: switchSensorControl,
            },
            {
                path: '/equipmentManagement/switchSensorControlDetail',
                name: 'gatewayAlarm',
                meta: {
                    title: '报警设备详情'
                },
                component: switchSensorControlDetail,
            },
            {
                path: '/equipmentManagement/sensorDetail',
                name: 'sensorDetail',
                meta: {
                    title: '传感器详情'
                },
                component: sensorDetail,
            },
            {
                path: '/parameterControl/protocolControl',
                name: 'protocolControl',
                meta: {
                    title: '协议管理'
                },
                component: protocolControl,
            },
            {
                path: '/parameterControl/arithmeticControl',
                name: 'arithmeticControl',
                meta: {
                    title: '算法管理'
                },
                component: arithmeticControl,
            },
            {
                path: '/parameterControl/elementControl',
                name: 'elementControl',
                meta: {
                    title: '监测因素管理'
                },
                component: elementControl,
            },
            {
                path: '/parameterControl/variableControl',
                name: 'variableControl',
                meta: {
                    title: '变量管理'
                },
                component: variableControl,
            },
            {
                path: '/parameterControl/variableDetail',
                name: 'variableDetail',
                meta: {
                    title: '变量详情'
                },
                component: variableDetail,
            },
            {
                path: '/realTimeData/measurementValue',
                name: 'measurementValue',
                meta: {
                    title: '测值实时数据'
                },
                component: measurementValue,
            },
            {
                path: '/realTimeData/variableValue',
                name: 'variableValue',
                meta: {
                    title: '变量实时数据'
                },
                component: variableValue,
            },
            {
                path: '/statisticAnalysis/originalAnalyze',
                name: 'originalAnalyze',
                meta: {
                    title: '原始测值分析'
                },
                component: originalAnalyze,
            },
            {
                path: '/statisticAnalysis/variableAnalyze',
                name: 'variableAnalyze',
                meta: {
                    title: '变量分析'
                },
                component: variableAnalyze,
            },
            {
                path: '/statisticAnalysis/groupingVariable',
                name: 'groupingVariable',
                meta: {
                    title: '变量分组管理'
                },
                component: groupingVariable,
            },
            {
                path: '/statisticAnalysis/variableGroupingAnalyze',
                name: 'variableGroupingAnalyze',
                meta: {
                    title: '变量分组分析'
                },
                component: variableGroupingAnalyze,
            },
            {
                path: '/statisticAnalysis/groupingDetail',
                name: 'groupingDetail',
                meta: {
                    title: '变量分组管理详情'
                },
                component: groupingDetail,
            },
            {
                path: '/alarmControl/sensorAlarm',
                name: 'sensorAlarm',
                meta: {
                    title: '传感器报警'
                },
                component: sensorAlarm,
            },
            {
                path: '/alarmControl/sensorAlarmDetail',
                name: 'sensorAlarmDetail',
                meta: {
                    title: '传感器报警详情'
                },
                component: sensorAlarmDetail,
            },
            {
                path: '/alarmControl/variableAlarm',
                name: 'variableAlarm',
                meta: {
                    title: '变量报警'
                },
                component: variableAlarm,
            },
            {
                path: '/alarmControl/variableAlarmDetail',
                name: 'variableAlarmDetail',
                meta: {
                    title: '变量报警详情'
                },
                component: variableAlarmDetail,
            },
            {
                path: '/alarmControl/gatewayAlarm',
                name: 'gatewayAlarm',
                meta: {
                    title: '网关报警'
                },
                component: gatewayAlarm,
            },
            {
                path: '/alarmControl/gatewayAlarmDetail',
                name: 'gatewayAlarmDetail',
                meta: {
                    title: '网关报警详情'
                },
                component: gatewayAlarmDetail,
            },
            {
                path: '/alarmControl/equipmentLifeAlarm',
                name: 'equipmentLifeAlarm',
                meta: {
                    title: '设备年限报警'
                },
                component: equipmentLifeAlarm,
            },
            {
                path: '/alarmControl/equipmentLifeAlarmDetail',
                name: 'equipmentLifeAlarmDetail',
                meta: {
                    title: '设备年限报警详情'
                },
                component: equipmentLifeAlarmDetail,
            },
            {
                path: '/alarmControl/switchSensorAlarm',
                name: 'switchSensorAlarm',
                meta: {
                    title: '开关量报警'
                },
                component: switchSensorAlarm,
            },
            {
                path: '/alarmControl/switchSensorAlarmDetail',
                name: 'switchSensorAlarmDetail',
                meta: {
                    title: '开关量报警详情'
                },
                component: switchSensorAlarmDetail,
            },


        ]
    },
    {
        path: '/dataBoard/bigData',
        name: 'bigData',
        meta: {
            title: '数据看板'
        },
        component: bigData,
    },
    {
        path: '/dataBoard/bigDataHome',
        name: 'bigData',
        meta: {
            title: '数据看板首页'
        },
        component: bigDataHome,
    },
];

const router = new VueRouter({
    routes
});

export default router

<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/alarmControl/equipmentLifeAlarm' }">设备年限报警</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    报警编号：<span class="info-content" v-if="info.warnCode&&info.warnCode!=''">{{info.warnCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    {{nowName}}编号：<span class="info-content" v-if="code&&code!=''">{{code}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    {{nowName}}名称：<span class="info-content" v-if="name&&name!=''">{{name}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
<!--                <el-col :span="8">-->
<!--                    状态：-->
<!--                    <span v-if="info.state==0" class="info-content"><span style="color: rgb(240,65,52)">●</span> 报警中</span>-->
<!--                    <span v-else class="info-content"><span style="color: rgb(0,168,84)">●</span> 已恢复</span>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                    是否推送： <span v-if="info.isPush==1" class="info-content"> 是</span>-->
<!--                    <span v-else class="info-content"> 否</span>-->
<!--                </el-col>-->
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    校准周期：<span class="info-content" v-if="info.calibrateCycle&&info.calibrateCycle!=''">{{info.calibrateCycle}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    最近一次校准日期：<span class="info-content" v-if="info.lastCalibrateDate&&info.lastCalibrateDate!=''">{{info.lastCalibrateDate}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    使用截止日期：<span class="info-content" v-if="info.deadline&&info.deadline!=''">{{info.deadline}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    提前报警时长：<span class="info-content" v-if="info.earlyWarnTime&&info.earlyWarnTime!=''">{{info.earlyWarnTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    报警时间：<span class="info-content" v-if="info.warnTime&&info.warnTime!=''">{{info.warnTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">推送信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    是否推送： <span v-if="info.isPush==1" class="info-content"> 是</span>
                    <span v-else class="info-content"> 否</span>
                </el-col>
                <el-col :span="8">
                    报警联系人：<span class="info-content" v-if="info.warnUser&&info.warnUser!=''">{{info.warnUser}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    推送方式：
                    <span v-if="info.pushType&&info.pushType.split(',').length>0">
                        <span v-if="info.pushType.indexOf('0')!=-1" class="info-content">微信 </span>
                        <span v-if="info.pushType.indexOf('1')!=-1" class="info-content">短信 </span>
                        <span v-if="info.pushType.indexOf('2')!=-1" class="info-content">app </span>
                        <span v-if="info.pushType.indexOf('3')!=-1" class="info-content">邮箱</span>
                    </span>
                    <span v-else class="info-content">
                                                -
                                        </span>
                </el-col>
            </el-row>
        </div>
        <div class="button">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "equipmentLifeAlarmDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                //步骤条显示哪一段
                // active: 2,
                name:'',
                code:'',
                title:'',
                nowName:'',
            }
        },
        created() {
            this.$store.state.nowName='设备年限报警详情';
            this.info = this.$store.state.equipmentLifeAlarmData;
            this.info.earlyWarnTime=this.countTime(this.info.earlyWarnTime);
            if (this.info.gateway){
                this.title='网关设备年限报警';
                this.nowName='网关';
                this.code=this.$store.state.equipmentLifeAlarmData.gateway.gatewayName;
                this.name=this.$store.state.equipmentLifeAlarmData.gateway.gatewayCode;

            }else {
                this.title='传感器设备年限报警';
                this.nowName='传感器';
                this.code=this.$store.state.equipmentLifeAlarmData.sensor.sensorName;
                this.name=this.$store.state.equipmentLifeAlarmData.sensor.sensorCode;
            }

        },
        methods:{
            //返回上一页
            goBack() {
                this.$router.push('/alarmControl/equipmentLifeAlarm');
            },
            //计算年月日的方法
            countTime(time) {
                let h = time / 360;
                let m = (time % 360) / 30;
                let s = (time % 360) % 30;
                let times = '';
                if (h >= 1) {
                    times = parseInt(h) + '年'
                }
                if (m >= 1) {
                    times = times + parseInt(m) + '月'
                }
                if (s > 0) {
                    times = times + s + '天'
                }
                return times;
            },
        }
    }
</script>

<style scoped>
    /*步骤条样式*/
    .steps {
        margin-top: 30px;
        width: 40%;
    }

    /*小标题样式*/
    .title {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0;
    }

    /*基本信息*/
    .info {
        font-size: 15px;
        color: rgb(49, 49, 51);
    }

    /*基本信息每行样式*/
    .rowStyle {
        margin: 15px 0;
    }
    /*详细内容样式*/
    .info-content {
        color: #666;
    }
    /*底部button样式*/
    .button {
        width: 100%;
        margin-top: 100px;
        text-align: center;
    }
</style>

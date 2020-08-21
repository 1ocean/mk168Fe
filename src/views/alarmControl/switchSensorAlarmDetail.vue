<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/alarmControl/switchSensorAlarm' }">开关量报警</el-breadcrumb-item>
            <el-breadcrumb-item>开关量报警详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="steps">
            <el-steps :active="active">
                <el-step title="触发报警" :description="info.warnTime"></el-step>
                <el-step title="处理报警" :description="handel"></el-step>
                <el-step title="处理完成" :description="handelFinish"></el-step>
            </el-steps>
        </div>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    报警编号：<span class="info-content" v-if="info.warnCode&&info.warnCode!=''">{{info.warnCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    状态：
                    <span v-if="info.state==0" class="info-content"><span
                            style="color: rgb(240,65,52)">●</span> 触发报警</span>
                    <span v-else-if="info.state==1" class="info-content"><span style="color: rgb(0,168,84)">●</span> 处理报警</span>
                    <span v-else class="info-content"><span style="color: rgb(0,168,84)">●</span> 处理完成</span>
                </el-col>
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    传感器名称：<span class="info-content" v-if="info.switchSensorName&&info.switchSensorName!=''">{{info.switchSensorName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    传感器编号：<span class="info-content" v-if="info.switchSensorCode&&info.switchSensorCode!=''">{{info.switchSensorCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    报警时间：<span class="info-content" v-if="info.warnTime&&info.warnTime!=''">{{info.warnTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    处理时间：<span class="info-content" v-if="info.handleTime&&info.handleTime!=''">{{info.handleTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    处理人：<span class="info-content" v-if="info.handleFinishBy&&info.handleFinishBy!=''">{{info.handleFinishBy}}</span>
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
                <el-col :span="8">
                    报警联系人：<span class="info-content" v-if="info.warnUser&&info.warnUser!=''">{{info.warnUser}}</span>
                    <span v-else class="info-content">-</span>
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
        name: "switchSensorAlarmDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                //步骤条显示哪一段
                active: 2,
                //处理报警文字
                handel:'',
                //处理报警结束文字
                handelFinish:''
            }
        },
        created() {
            this.$store.state.nowName='报警设备详情';
            this.info = this.$store.state.nowSwitchSensorAlarmData;
            this.info.state == 0 ? this.active = 0 : this.info.state == 1? this.active = 2:this.active = 3;
          this.info.handleBy!=null?this.handel=`${this.info.handleBy} ${this.info.handleTime}
            ${this.info.handleContent}`:this.handel='';
          this.info.handleFinishBy!=null?this.handelFinish=`${this.info.handleFinishBy} ${this.info.handleFinishTime}
            ${this.info.handleFinishContent}`:this.handelFinish=''
        },
        methods:{
            //返回上一页
            goBack() {
                this.$router.push('/alarmControl/switchSensorAlarm');
            }
        }
    }
</script>

<style scoped>
    /*步骤条样式*/
    .steps {
        margin-top: 30px;
        width: 60%;
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
    >>>.el-step__description{
        white-space: pre-wrap;
    }
</style>

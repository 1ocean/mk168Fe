<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/alarmControl/gatewayAlarm' }">网关报警</el-breadcrumb-item>
            <el-breadcrumb-item>网关报警详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="steps">
            <el-steps :active="active">
                <el-step title="网关离线" :description="info.ofLineTime"></el-step>
                <el-step title="触发报警" :description="info.warnTime"></el-step>
                <el-step title="恢复正常" :description="info.lrestoreTime"></el-step>
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
                    报警网关：<span class="info-content" v-if="info.gatewayName&&info.gatewayName!=''">{{info.gatewayName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    状态：
                    <span v-if="info.state==0" class="info-content"><span
                            style="color: rgb(240,65,52)">●</span> 报警中</span>
                    <span v-else class="info-content"><span style="color: rgb(0,168,84)">●</span> 已恢复</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    网关编号：<span class="info-content" v-if="info.gatewayCode&&info.gatewayCode!=''">{{info.gatewayCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    最大离线时长：<span class="info-content" v-if="info.maxOfLineTime&&info.maxOfLineTime!=''">{{info.maxOfLineTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    实际离线时长：<span class="info-content" v-if="info.ofLineTimeLength&&info.ofLineTimeLength!=''">{{info.ofLineTimeLength}}</span>
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
        name: "gatewayAlarmDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                //步骤条显示哪一段
                active: 2,
            }
        },
        created() {
            this.$store.state.nowName='网关报警详情';
            this.info = this.$store.state.gatewayAlarmData;
            this.info.state == 0 ? this.active = 0 : this.info.state == 1? this.active = 2:this.active = 3;
        },
        methods:{
            //返回上一页
            goBack() {
                this.$router.push('/alarmControl/gatewayAlarm');
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
</style>

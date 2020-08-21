<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/alarmControl/variableAlarm' }">变量报警</el-breadcrumb-item>
            <el-breadcrumb-item>变量报警详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="steps">
            <el-steps :active="active">
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
                    状态：
                    <span v-if="info.state==0" class="info-content"><span style="color: rgb(240,65,52)">●</span> 报警中</span>
                    <span v-else class="info-content"><span style="color: rgb(0,168,84)">●</span> 已恢复</span>
                </el-col>
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    变量名称：<span class="info-content" v-if="info.variableName&&info.variableName!=''">{{info.variableName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    变量编号：<span class="info-content" v-if="info.variableCode&&info.variableCode!=''">{{info.variableCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    触发条件：
                    <span class="info-content" v-if="info.triggerConditionFe==0">数值等于{{info.firstValue}}</span>
                    <span class="info-content" v-else-if="info.triggerConditionFe==1" >数值大于{{info.firstValue}}小于{{info.secondValue}}</span>
                    <span class="info-content" v-else-if="info.triggerConditionFe==2">数值大于{{info.firstValue}}</span>
                    <span class="info-content" v-else-if="info.triggerConditionFe==3">数值小于{{info.firstValue}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    报警值：<span class="info-content" v-if="info.warnValue&&info.warnValue!=''">{{info.warnValue}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    报警机制：<span class="info-content" v-if="info.warnMechanism==0" >仅第一次推送</span>
                    <span class="info-content" v-if="info.warnMechanism==1" >间隔{{info.pushInterval}}分钟</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    报警时间：<span class="info-content" v-if="info.warnTime&&info.warnTime!=''">{{info.warnTime}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    恢复正常时间：<span class="info-content" v-if="info.lrestoreTime&&info.lrestoreTime!=''">{{info.lrestoreTime}}</span>
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
        <el-divider></el-divider>
        <div class="title">触发报警联动</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    是否触发报警联动：<span v-if="info.triggerOrderId" class="info-content"> 是</span>
                    <span v-else class="info-content"> 否</span>
                </el-col>
                <el-col :span="8">
                    操作结果： <span v-if="info.triggerResult==0" class="info-content"><span style="color: rgb(240,65,52)">●</span> 失败</span>
                    <span v-if="info.triggerResult==1" class="info-content"><span style="color: rgb(0,168,84)">●</span> 成功</span>
                </el-col>
                <el-col :span="8">
                    所属网关：
                    <span class="info-content"  v-if="triggerGateway&&triggerGateway!=''">{{triggerGateway}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    操作指令：<span class="info-content" v-if="triggerDo&&triggerDo!=''">{{triggerDo}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    控制设备名称：<span class="info-content" v-if="triggerName&&triggerName!=''">{{triggerName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">恢复正常联动</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    是否恢复正常联动：<span v-if="info.restoreOrderId" class="info-content"> 是</span>
                    <span v-else class="info-content"> 否</span>
                </el-col>
                <el-col :span="8">
                    操作结果：  <span v-if="info.restoreResult==0" class="info-content"><span style="color: rgb(240,65,52)">●</span> 失败</span>
                    <span v-if="info.restoreResult==1" class="info-content"><span style="color: rgb(0,168,84)">●</span> 成功</span>
                </el-col>
                <el-col :span="8">
                    所属网关：
                    <span class="info-content" v-if="restoreOrderGateway&&restoreOrderGateway!=''">{{restoreOrderGateway}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    操作指令：<span class="info-content" v-if="restoreOrderDo&&restoreOrderDo!=''">{{restoreOrderDo}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    控制设备名称：<span class="info-content" v-if="restoreOrderName&&restoreOrderName!=''">{{restoreOrderName}}</span>
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
        name: "variableAlarmDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                //步骤条显示哪一段
                active: 2,
                //触发报警数据
                triggerGateway:'',
                triggerDo:'',
                triggerName:'',
                //恢复联动数据
                restoreOrderGateway:'',
                restoreOrderDo:'',
                restoreOrderName:'',
            }
        },
        created() {
            this.$store.state.nowName='变量报警详情';
            this.info = this.$store.state.variableAlarmData;
            console.log(this.info)
            this.info.state == 0 ? this.active = 1 : this.active = 2;
            if (this.$store.state.variableAlarmData.triggerOrderId != null) {
                this.getTriggerData();
            }
            if (this.$store.state.variableAlarmData.restoreOrderId != null) {
                this.getRestoreOrderData();
            }
        },
        methods:{
            //获取触发操作指令
            getTriggerData() {
                this.$axios({
                    url: this.$BaseUrl + '/variableWarn/getOperateOrderByPrimaryKey',
                    method: 'post',
                    data: {
                        operateOrderId: this.$store.state.variableAlarmData.triggerOrderId
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.triggerGateway = res.data.data.gatewayName;
                        this.triggerDo = res.data.data.operateOrderName;
                        this.triggerName = res.data.data.operateOrderName;
                    }
                })
            },
            //获取恢复操作指令
            getRestoreOrderData() {
                this.$axios({
                    url: this.$BaseUrl + '/variableWarn/getOperateOrderByPrimaryKey',
                    method: 'post',
                    data: {
                        operateOrderId: this.$store.state.variableAlarmData.restoreOrderId
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.restoreOrderGateway = res.data.data.gatewayName;
                        this.restoreOrderDo = res.data.data.operateOrderName;
                        this.restoreOrderName = res.data.data.operateOrderName;
                    }
                })
            },
            //返回上一页
            goBack() {
                this.$router.push('/alarmControl/variableAlarm');
            }
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

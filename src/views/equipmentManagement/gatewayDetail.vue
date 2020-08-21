<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/equipmentManagement/gatewayManagement' }">网关管理</el-breadcrumb-item>
            <el-breadcrumb-item>网关详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    网关编号：<span class="info-content"
                               v-if="info.gatewayCode&&info.gatewayCode!=''">{{info.gatewayCode}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    状态：<span class="info-content" v-if="this.info.gatewayState==1"><span
                        style="color: rgb(0,168,84)">●</span> 在线</span>
                    <span class="info-content" v-else><span style="color: rgb(240,65,52)">●</span>  离线</span>
                </el-col>
                <el-col :span="8">
                    所属项目：<span class="info-content"
                               v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    网关名称：<span class="info-content"
                               v-if="info.gatewayName&&info.gatewayName!=''">{{info.gatewayName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    最大离线时长：<span class="info-content" v-if="info.maxOfLineTimeName&&info.maxOfLineTimeName!=''">{{info.maxOfLineTimeName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    采集方式：<span class="info-content" v-if="this.info.collectType==1">主动式</span><span class="info-content"
                                                                                                    v-else>被动式</span>
                </el-col>
                <el-col :span="8">
                    网关协议：<span class="info-content" v-if="info.gatewayAgreementName&&info.gatewayAgreementName!=''">{{info.gatewayAgreementName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    采样时长：<span class="info-content" v-if="info.collectCycleName&&info.collectCycleName!=''">{{info.collectCycleName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">报警规则</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    推送方式：
                    <span v-if="warnData.pushType&&warnData.pushType.split(',').length>0">
                        <span v-if="warnData.pushType.indexOf('0')!=-1" class="info-content">微信 </span>
                        <span v-if="warnData.pushType.indexOf('1')!=-1" class="info-content">短信 </span>
                        <span v-if="warnData.pushType.indexOf('2')!=-1" class="info-content">app </span>
                        <span v-if="warnData.pushType.indexOf('3')!=-1" class="info-content">邮箱 </span>
                    </span>
                    <span v-else class="info-content">
                                                -
                                        </span>
                </el-col>
                <el-col :span="8">
                    报警联系人：<span class="info-content" v-if="warnData.warnUserName&&warnData.warnUserName!=''">{{warnData.warnUserName}}</span>
                    <span class="info-content" v-else>-</span>
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
        name: "gatewayDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                loading: false,
                //网关表格一套数据
                sensorPageNum: 1,
                sensorPageSize: 5,
                sensorTotal: 0,
                sensorTableData: [],

                //变量表格一套数据
                equipmentPageNum: 1,
                equipmentPageSize: 5,
                equipmentTotal: 0,
                equipmentTableData: [],

                //当前网关得报警规则
                warnData: {}
            }
        },
        created() {
            this.$store.state.nowName = '网关详情';
            this.info = this.$store.state.gatewayData;
            this.info.maxOfLineTime = this.changeTime(this.info.maxOfLineTime);
            this.getWarnData();
        },
        mounted() {
        },
        methods: {
            //计算时分秒
            changeTime(time) {
                let h = time / 3600;
                let m = (time % 3600) / 60;
                let s = (time % 3600) % 60;
                let date = '';
                if (h >= 1) {
                    date = parseInt(h) + '时'
                }
                if (m >= 1) {
                    date = date + parseInt(m) + '分'
                }
                if (s > 0) {
                    date = date + parseInt(s) + '秒'
                }
                return date;
            },
            //获取报警规则
            getWarnData() {
                this.$axios({
                    url: this.$BaseUrl + '/gateway/getWarnRuleByGatewayId',
                    method: 'post',
                    data: {
                        pageNum: this.sensorPageNum,
                        pageSize: this.sensorPageSize,
                        gatewayId: this.$store.state.gatewayData.gatewayId,
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data!=null){
                            this.warnData = res.data.data;
                        }else {
                            this.warnData = {
                                warnUserName:'',
                                pushType:''
                            }
                        }
                    }
                })
            },

            //返回上一页
            goBack() {
                this.$router.push('/equipmentManagement/gatewayManagement');
            }
        },

    }
</script>

<style scoped>
    /*步骤条样式*/
    .steps {
        margin-top: 30px;
        width: 100%;
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

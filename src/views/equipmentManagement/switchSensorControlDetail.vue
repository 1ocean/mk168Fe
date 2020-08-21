<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/equipmentManagement/switchSensorControl' }">报警设备</el-breadcrumb-item>
            <el-breadcrumb-item>报警设备详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    传感器编号：<span class="info-content"
                               v-if="info.switchSensorCode&&info.switchSensorCode!=''">{{info.switchSensorCode}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    传感器类型：<span class="info-content"
                                v-if="info.switchSensorTypeName&&info.switchSensorTypeName!=''">{{info.switchSensorTypeName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    所属网关：<span class="info-content"
                               v-if="info.gatewayName&&info.gatewayName!=''">{{info.gatewayName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    传感器名称：<span class="info-content"
                               v-if="info.switchSensorName&&info.switchSensorName!=''">{{info.switchSensorName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    传感器协议：<span class="info-content" v-if="info.sensorAgreementName&&info.sensorAgreementName!=''">{{info.sensorAgreementName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    最新数据上报时间：<span class="info-content" v-if="info.reportTime&&info.reportTime!=''">{{info.reportTime}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="24">
                    说明：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
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
        name: "switchSensorControlDetail",
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
            this.$store.state.nowName = '报警设备详情';
            this.info = this.$store.state.switchSensorData;
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
                    url: this.$BaseUrl + '/switchSensor/getWarnRuleBySwitchSensorId',
                    method: 'post',
                    data: {
                        pageNum: this.sensorPageNum,
                        pageSize: this.sensorPageSize,
                        switchSensorId: this.$store.state.switchSensorData.switchSensorId,
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
                this.$router.push('/equipmentManagement/switchSensorControl');
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

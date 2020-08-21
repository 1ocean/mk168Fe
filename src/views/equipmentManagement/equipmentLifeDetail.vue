<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/equipmentManagement/equipmentLifeControl' }">设备年限管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">标准记录</div>
        <div class="steps">
            <el-steps :active="active">
                <el-step v-for="(i,index) in recordData" :key="index" :title="i.name" :description="i.value"></el-step>
            </el-steps>
        </div>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    {{nowName}}编号：<span class="info-content" v-if="info.code&&info.code!=''">{{info.code}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    {{nowName}}名称：<span class="info-content" v-if="info.name&&info.name!=''">{{info.name}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    最近一次校准日期：<span class="info-content" v-if="info.lastCalibrateDate&&info.lastCalibrateDate!=''">{{info.lastCalibrateDate}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    校准周期：<span class="info-content" v-if="info.calibrateCycle&&info.calibrateCycle!=''">{{info.calibrateCycle}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="16">
                    使用截止日期：<span class="info-content" v-if="info.deadline&&info.deadline!=''">{{info.deadline}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle" v-if="nowName=='传感器'">
                <el-col :span="24">
                    备注：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">报警规则</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    提前报警时长： <span class="info-content" v-if="info.earlyWarnTimeName&&info.earlyWarnTimeName!=''">{{info.earlyWarnTimeName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    报警联系人： <span class="info-content" v-if="info.warnUserName&&info.warnUserName!=''">{{info.warnUserName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    推送方式：<span v-if="info.pushType&&info.pushType!=''">
                        <span v-if="info.pushType.indexOf('0')!=-1" class="info-content">微信 </span>
                        <span v-if="info.pushType.indexOf('1')!=-1" class="info-content">短信 </span>
                        <span v-if="info.pushType.indexOf('2')!=-1" class="info-content">APP </span>
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
        name: "equipmentLifeDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {
                    pushType: '',
                    warnUser: '',
                },
                //步骤条显示哪一段
                active: 0,
                //标题
                title: '',
                //时间轴数据
                recordData: [],
                //当前是网关还是传感器
                nowName:''
            }
        },
        created() {
            this.$store.state.nowName='设备年限管理详情';
        },
        mounted() {
            //通过独有数据判断是哪一个详情
            if (this.$store.state.equipmentLifeData.gatewayCode) {
                this.title = '网关校准记录';
                this.nowName = '网关';
                this.$axios({
                    url: this.$BaseUrl + '/gatewayYearManage/getWarnYearRuleByGatewayId',
                    method: 'post',
                    data: {
                        gatewayId: this.$store.state.equipmentLifeData.gatewayId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        //没有写在外面是因为从vuex中拿数据比从接口慢，只能写在里面，不然会覆盖
                        this.info = this.$store.state.equipmentLifeData;
                        this.info.calibrateCycle = this.changeTime(this.info.calibrateCycle);
                        if (res.data.data !== '' && res.data.data != null && res.data.data.pushType != null) {
                            this.info.pushType = res.data.data.pushType.split(',');
                            this.info.warnUserName = res.data.data.warnUserName;
                        } else {
                            this.info.pushType = '';
                            this.info.warnUser = '';
                        }
                        this.info.code = this.$store.state.equipmentLifeData.gatewayCode;
                        this.info.name = this.$store.state.equipmentLifeData.gatewayName;
                        console.log(this.info)

                    }
                });
                //获取网关校准记录
                this.$axios({
                    url: this.$BaseUrl + '/gatewayYearManage/getCalibrateRecordByGatewayId',
                    method: 'post',
                    data: {
                        gatewayId: this.$store.state.equipmentLifeData.gatewayId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.recordData = [];
                        for (let i in res.data.data) {
                            this.recordData.push({
                                name: res.data.data[i].calibratePersonName,
                                value: this.$moment(res.data.data[i].calibrateDate).format('YYYY-MM-DD')
                            })
                        }
                        this.active = res.data.data.length;
                    }
                });
            } else {
                this.title = '传感器校准记录';
                this.nowName = '传感器';
                this.$axios({
                    url: this.$BaseUrl + '/sensorYearManage/getWarnYearRuleBySensorId',
                    method: 'post',
                    data: {
                        sensorId: this.$store.state.equipmentLifeData.sensorId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        //没有写在外面是因为从vuex中拿数据比从接口慢，只能写在里面，不然会覆盖
                        this.info = this.$store.state.equipmentLifeData;
                        this.info.calibrateCycle = this.changeTime(this.info.calibrateCycle);
                        if (res.data.data !== '' && res.data.data != null && res.data.data.pushType != null) {
                            this.info.pushType = res.data.data.pushType.split(',');
                            this.info.warnUserName = res.data.data.warnUserName;
                        } else {
                            this.info.pushType = '';
                            this.info.warnUser = '';
                        }
                        this.info.code = this.$store.state.equipmentLifeData.sensorCode;
                        this.info.name = this.$store.state.equipmentLifeData.sensorName;
                    }
                });
                //获取传感器校准记录
                this.$axios({
                    url: this.$BaseUrl + '/sensorYearManage/getCalibrateRecordBySensorId',
                    method: 'post',
                    data: {
                        sensorId: this.$store.state.equipmentLifeData.sensorId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.recordData = [];
                        for (let i in res.data.data) {
                            this.recordData.push({
                                name: res.data.data[i].calibratePersonName,
                                value: this.$moment(res.data.data[i].calibrateDate).format('YYYY-MM-DD')
                            })
                        }
                        this.active = res.data.data.length;
                    }
                });
            }
        },
        methods: {
            //计算年月日
            changeTime(time) {
                let h = time / 360;
                let m = (time % 360) / 30;
                let s = (time % 360) % 30;
                let date = '';
                if (h >= 1) {
                    date = parseInt(h) + '年'
                }
                if (m >= 1) {
                    date = date + parseInt(m) + '月'
                }
                if (s > 0) {
                    date = date + parseInt(s) + '天'
                }
                return date;
            },
            //返回上一页
            goBack() {
                this.title === '网关校准记录' ? this.$store.state.equipmentLifeActive = '0' : this.$store.state.equipmentLifeActive = '1';
                this.$router.push('/equipmentManagement/equipmentLifeControl');
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

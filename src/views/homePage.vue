<template>
    <div class="content-wrapper" v-cloak style="padding: 0;background: rgb(239,241,244)">
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="spancss">项目状态</span>
                </div>
                <el-row :gutter="100" style="margin: 10px">
                    <el-col :span="8">
                        <div class="grid-content" style="background-image: linear-gradient(to right,#90caf9, #047edf);">
                            <img src="../assets/image/index/project2.png"/>
                            <div class="whitefont">
                                <div style="text-align: center;">
                                    运营项目
                                </div>
                                <div style="margin-top: 10px;text-align: center;">
                                    {{proTotal}}
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" style="background-image: linear-gradient(to right,#84d9d2, #06b99d);">
                            <img src="../assets/image/index/running.png"/>
                            <div class="whitefont">
                                <div style="text-align: center;">
                                    运行中
                                </div>
                                <div style="margin-top: 10px;text-align: center;">
                                    {{proRunning}}
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" style="background-image: linear-gradient( to right,#ffbf96, #fe7096);">
                            <img src="../assets/image/index/stoped.png"/>
                            <div class="whitefont">
                                <div style="text-align: center;">
                                    已停止
                                </div>
                                <div style="margin-top: 10px;text-align: center;">
                                    {{proStop}}
                                </div>
                            </div>
                        </div>
                    </el-col>
<!--                    <el-col :span="6">-->
<!--                        <div class="grid-content" style="background-color: #ED5655;">-->
<!--                            <img src="../assets/image/index/abnormal.png"/>-->
<!--                            <div class="whitefont">-->
<!--                                <div style="text-align: center;">-->
<!--                                    异常-->
<!--                                </div>-->
<!--                                <div style="margin-top: 10px;text-align: center;">-->
<!--                                    {{proException}}-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </el-col>-->
                </el-row>
            </el-card>

        </div>
        <div style="display: flex;flex-direction: row;margin-top: 16px;">
            <el-card class="box-card" style="width: 49%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">网关总览</span>
                </div>
                <div style="width: 100%;height: 16vh;">
                    <div class="flex-around" style="height: 70%">
                        <img src="../assets/image/index/deviceManager.png" class="proimg"/>
                        <img src="../assets/image/index/online.png" class="proimg"/>
                        <img src="../assets/image/index/offline.png" class="proimg"/>
                    </div>
                    <div class="flex-around">
                        <div class="protext">
                            网关总量：
                            <span style="font-size: large;">{{gatewayTotal}}</span>
                        </div>
                        <div class="protext">
                            在线数量：
                            <span style="font-size: large;">{{gatewayOnlinee}}</span>
                        </div>
                        <div class="protext">
                            离线数量：
                            <span style="font-size: large;color: red;">{{gatewayOffline}}</span>
                        </div>
                    </div>
                </div>

            </el-card>
            <el-card class="box-card" style="width: 49%;margin-left: 2%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">传感器总览</span>
                </div>
                <div style="width: 100%;height: 16vh;">
                    <div class="flex-around" style="height: 70%">
                        <img src="../assets/image/index/sensorControl.png" class="proimg"/>
                        <img src="../assets/image/index/sensorOnline.png" class="proimg"/>
                        <img src="../assets/image/index/sensorOffline.png" class="proimg"/>
                    </div>
                    <div class="flex-around">
                        <div class="protext">
                            传感器总量：
                            <span style="font-size: large;">{{sensorTotal}}</span>
                        </div>
                        <div class="protext">
                            正常数量：
                            <span style="font-size: large;">{{sensorNormal}}</span>
                        </div>
                        <div class="protext">
                            异常数量：
                            <span style="font-size: large;color: red;">{{sensorException}}</span>
                        </div>
                    </div>
                </div>
                <!--                <div id="piechart"></div>-->

            </el-card>
        </div>
        <div style="display: flex;flex-direction: row;margin-top: 16px;">
            <el-card class="box-card" style="width: 49%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">最近一周报警次数</span>
                </div>
                <div id="barchart"></div>
            </el-card>
            <el-card class="box-card" style="width: 49%;margin-left: 2%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">最近一周报警趋势</span>
                </div>
                <div id="linechart"></div>
            </el-card>
        </div>

    </div>

</template>

<script>

    export default {
        name: "homePage",
        data() {
            return {
                gatewayOffline: '',//网关离线
                gatewayOnlinee: '',//网关在线
                gatewayTotal: '',//网关总数
                proException: '',//项目异常
                proRunning: '',//项目运行
                proStop: '',//项目停止
                proTotal: '',//项目总数
                sensorException: '',//传感器异常
                sensorNormal: '',//传感器正常
                sensorTotal: '',//传感器总数
                exceptionTotal: '',//告警总数
            };
        },
        created() {
            this.$store.state.nowName = '首页';
        },
        mounted() {
            this.getEchartData();
            this.getHomeData();
        },
        methods: {
            getEchartData() {
                this.$axios({
                    url: this.$BaseUrl + '/index/getHomeEChartsInfo',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        let barechartsData = [
                            ['网关报警', res.data.data.gatewayWarnSize],
                            ['网关年限报警', res.data.data.gatewayYearWarnSize],
                            ['传感器报警', res.data.data.sensorWarnSize],
                            ['传感器年限报警', res.data.data.sensorYearWarnSize],
                            ['变量报警', res.data.data.variableWarnSize],
                        ];
                        this.$chart.barEchart('barchart', barechartsData);

                        let linechartsData = [
                            {
                                "name": "网关报警",
                                "list": res.data.data.gatewayWarnRecord,
                            },
                            {
                                "name": "网关年限报警",
                                "list": res.data.data.gatewayYearWarnRecord,
                            },
                            {
                                "name": "传感器报警",
                                "list": res.data.data.sensorWarnRecord,
                            },
                            {
                                "name": "传感器年限报警",
                                "list": res.data.data.sensorYaerWarnRecord,
                            },
                            {
                                "name": "变量报警",
                                "list": res.data.data.variableWarnRecord,
                            },
                        ];
                        this.$chart.lineEchart('linechart', linechartsData);

                        this.exceptionTotal = res.data.data.gatewayWarnSize + res.data.data.gatewayYearWarnSize + res.data.data.sensorWarnSize + res.data.data.sensorYearWarnSize + res.data.data.variableWarnSize;
                    }
                });
            },
            getHomeData() {
                this.$axios({
                    url: this.$BaseUrl + '/index/getHomeInfo',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayOffline = res.data.data.gatewayOffline;
                        this.gatewayOnlinee = res.data.data.gatewayOnlinee;
                        this.gatewayTotal = res.data.data.gatewayTotal;
                        this.proException = res.data.data.proException;
                        this.proRunning = res.data.data.proRunning;
                        this.proStop = res.data.data.proStop;
                        this.proTotal = res.data.data.proTotal;
                        this.sensorException = res.data.data.sensorException;
                        this.sensorNormal = res.data.data.sensorNormal;
                        this.sensorTotal = res.data.data.sensorTotal;

                        let piechartData = [
                            {value: res.data.data.sensorNormal, name: '正常'},
                            {value: res.data.data.sensorException, name: '异常'},
                        ]
                        // this.$chart.pieEchart('piechart', piechartData);
                    }
                });
            },

        },

    }
</script>


<style scoped>
    #barchart {
        width: 100%;
        height: 25vh;
    }

    #linechart {
        width: 100%;
        height: 25vh;
    }

    #piechart {
        width: 100%;
        height: 130px;
    }

    .content-wrapper >>> .el-card__header {
        padding: 10px 10px !important;
    }

    .content-wrapper >>> .el-card__body {
        padding: 10px !important;
        height: 60%;
    }

    .clearfix {
        display: flex;
        align-items: center;
    }

    .spancss {
        margin-left: 1vw;
        font-size: 0.9vw;
        font-weight: 500;
    }

    .grid-content {
        width: 90%;
        height: 20vh;
        border-radius: 5px;
        display: flex;
        margin-left: 5%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .whitefont {
        font-size: 1.0vw;
        color: #FFFFFF;
        font-weight: bold;
        margin-left: 7%;
        width: 30%;
    }

    .procss {
        width: 33%;
    }

    .proimg {
        width: 47px;
        height: 47px;
    }

    .protext {
        text-align: center;
        width: 33%;
    }
</style>

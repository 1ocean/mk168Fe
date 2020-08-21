<template>
    <div class="content-wrapper" v-cloak style="padding: 0;background: rgb(239,241,244)">
        <div style="display: flex;flex-direction: row;">
            <el-card class="box-card" style="width: 23%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">网关总览</span>
                </div>
                <div id="piechart1"></div>
            </el-card>
            <el-card class="box-card" style="width: 50%;margin-left: 2%;">
                <div class="text item" id="map">
                </div>
            </el-card>
            <el-card class="box-card" style="width: 23%;margin-left: 2%;">
                <div slot="header" class="clearfix">
                    <span class="spancss">传感器总览</span>
                </div>
                <div id="piechart2"></div>
            </el-card>
        </div>
        <div style="display: flex;flex-direction: row;margin-top: 20px;">
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
                projectId: '',
                gatewayOffline: '',//网关离线
                gatewayOnlinee: '',//网关在线
                gatewayTotal: '',//网关总数
                sensorException: '',//传感器异常
                sensorNormal: '',//传感器正常
                sensorTotal: '',//传感器总数
            };
        },
        created() {
            this.$store.state.nowName='项目概览';
        },
        mounted() {
            this.projectId = this.$route.query.well;
            this.getEchartData();
            this.getHomeData();
			this.initMap();
		},
        methods: {
            //地图
            initMap() {
                let that = this;
                let geocoder, marker;
                console.log(that.$route.query.data.structureList[0].longitude)
                that.map = new AMap.Map('map', {
                    zoom: 4,//级别
                    center: [that.$route.query.data.structureList[0].longitude,that.$route.query.data.structureList[0].latitude],//中心点坐标
                    resizeEnable: true,
                });
                // 绘制折线
                let path = new AMap.Polyline({
                    path: null,
                    isOutline: false,     //线条是否带描边，默认false
                    outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
                    borderWeight: 1,    //描边的宽度，默认为1
                    strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                    strokeOpacity: 1,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                    strokeWeight: 2,    //线条宽度，单位：像素
                    // 折线样式还支持 'dashed'
                    strokeStyle: "dashed",  //线样式，实线:solid，虚线:dashed
                    // strokeStyle是dashed时有效
                    strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
                    lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                    lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                    zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
                });
                // 将折线添加至地图实例
                that.map.add(path);
                // 插件
                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    that.map.addControl(new AMap.ToolBar());
                    that.map.addControl(new AMap.Scale())
                });

                //增加坐标点
                let array = [];
                let addressData=that.$route.query.data.structureList;
                for (let i in addressData){
					marker = new AMap.Marker({
						position: [addressData[i].longitude, addressData[i].latitude],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
					});
					marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
						offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
						content: addressData[i].structureName
					});
					array.push(marker);
				}
                that.map.add(array);
            },
            //获取echarts数据
            getEchartData() {
                this.$axios({
                    url: this.$BaseUrl + '/project/getOverviewEChartsInfo',
                    method: 'post',
                    data: {
                        projectId: this.projectId,
                    }
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
                    }

                });
            },
            getHomeData() {
                this.$axios({
                    url: this.$BaseUrl + '/project/getOverviewInfo',
                    method: 'post',
                    data: {
                        projectId: this.projectId,
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayOffline = res.data.data.gatewayOffline;
                        this.gatewayOnlinee = res.data.data.gatewayOnlinee;
                        this.gatewayTotal = res.data.data.gatewayTotal;
                        this.sensorException = res.data.data.sensorException;
                        this.sensorNormal = res.data.data.sensorNormal;
                        this.sensorTotal = res.data.data.sensorTotal;

                        let piechartData1 = [
                            {value: res.data.data.gatewayOffline, name: '在线'},
                            {value: res.data.data.gatewayOffline, name: '离线'},
                        ]
                        this.$chart.pieEchart('piechart1', piechartData1,'gateway');

                        let piechartData2 = [
                            {value: res.data.data.sensorNormal, name: '正常'},
                            {value: res.data.data.sensorException, name: '异常'},
                        ]
                        this.$chart.pieEchart('piechart2', piechartData2,'sensor');
                    }

                });
            },

        },

    }
</script>


<style scoped>
    #barchart {
        width: 100%;
        height: 38vh;
    }

    #linechart {
        width: 100%;
        height: 38vh;
    }

    #piechart1 {
        width: 100%;
        height: 30vh;
    }

    #piechart2 {
        width: 100%;
        height: 30vh;
    }
	#map{
		width: 100%;
		height: 95%;
	}
    .content-wrapper >>> .el-card__header {
        padding: 10px 10px !important;
    }

    .content-wrapper >>> .el-card__body {
        padding: 10px !important;
		height: 100%;

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
</style>

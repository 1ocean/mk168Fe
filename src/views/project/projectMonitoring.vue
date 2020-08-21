<template>
    <div class="content-wrapper monitoring" v-cloak>
        <el-tabs v-model="activeName" type="card" @tab-click="tabsClick" style="padding: 20px 5px 0 5px">
            <el-tab-pane
                    :key="index"
                    v-for="(item, index) in projectData"
                    :label="item.projectName"
                    :name="item.projectId+''"
            >
            </el-tab-pane>
        </el-tabs>
        <el-card class="box-card">
            <div v-for="(i,index) in structureData" :key="index" v-if="structureData.length!=0">
                <div :class="{ structureList: true, structureActive: active==index }" @click="structureClick(i,index)">
                    {{i.structureName}}
                </div>
                <el-divider></el-divider>
            </div>
            <div v-if="structureData.length==0">
                <div class="structureList">
                    暂无现场
                </div>
                <el-divider></el-divider>
            </div>


        </el-card>


        <!-- 地图展示 -->
        <div id="track-map">
        </div>
    </div>
</template>

<script>
    export default {
        name: "projectMonitoring",
        data() {
            return {
                //选项卡标签控制
                tabs: '',
                //地图
                map: '',
                //当前坐标点数组
                pointList: [],
                //上方项目选择
                activeName: '',
                //所有项目数据
                projectData: [],
                //当前项目的现场数据
                structureData: [],
                //用来放坐标点的数组
                array: [],
                //当前选中的现场
                active: 0
            }

        },
        mounted() {
            this.getData('first');
        },
        methods: {
            //地图
            initMap() {
                let that = this;
                that.map = new AMap.Map('track-map', {
                    zoom: 9,//级别
                    center: [this.projectData[0].structureList[0].longitude, this.projectData[0].structureList[0].latitude],//中心点坐标
                    resizeEnable: true,
                });
                // 插件
                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    that.map.addControl(new AMap.ToolBar());
                    that.map.addControl(new AMap.Scale())
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
                //在视野中显示所有的点
               that.map.setFitView();

            },
            //移除所有坐标点
            removeAllOverlay() {
                this.map.clearMap()
            },
            //获取所有项目和数目
            getData(type) {
                this.$axios({
                    url: this.$BaseUrl + "/project/getIndexProjectList",
                    method: 'post'
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.projectData = res.data.data;
                        this.initMap();
                        this.addPoint(this.projectData[0].structureList);
                        this.structureData = this.projectData[0].structureList;
                        this.activeName = this.projectData[0].projectId + '';
                        this.openInfo(this.projectData[0].structureList[0]);
                    }
                })
            },

            //增加坐标点
            addPoint(pointList) {
                let that = this;
                let marker;
                for (let i in pointList) {
                    marker = new AMap.Marker({
                        position: new AMap.LngLat(pointList[i].longitude, pointList[i].latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        extData: {
                            id: i
                        }
                    });
                    // marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    //     offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                    //     content: pointList[i].structureName
                    // });
                    marker.on('click', function(e) {
                        that.openInfo(pointList[i])

                    });
                    marker.on('removeAllOverlay', this.removeAllOverlay);
                    that.array.push(marker)
                }
                that.map.add(that.array);
            },
            //上方项目切换
            tabsClick(tab, event) {
                //清除所有标记物
                this.removeAllOverlay();
                this.array = [];
                // 现场选中重置
                this.active = 0;
                // 重新添加点
                this.addPoint(this.projectData[tab.index].structureList);
                this.structureData = this.projectData[tab.index].structureList;
                //聚焦到切换的第一个点
                let markerPosition = [this.projectData[tab.index].structureList[0].longitude, this.projectData[tab.index].structureList[0].latitude];
                this.openInfo(this.projectData[tab.index].structureList[0]);
                this.map.panTo(markerPosition);
            },
            //现场点击
            structureClick(val, index) {
                this.active = index;
                let markerPosition = [val.longitude, val.latitude];
                this.openInfo(val);
                this.map.panTo(markerPosition);
            },
            //在指定位置打开信息窗体
            openInfo(data) {
                //构建信息窗体中显示的内容
                let info = [];
                info.push("<div class=\"content\">");
                info.push("<img style=\"width: 100%;cursor:pointer;\" onClick=\"turnToGateway();\"  src=" + this.$url + data.structureImg + ">");
                info.push("<div class=\"font_title\">" + data.structureName + "</div>");
                info.push("<div class=\"font_content\">现场说明:" + data.remark + "</div>");
                // info.push("<div class=\"font_content\">设备数量:" + 123 + "</div>");
                // info.push("<div class=\"font_content1\">异常数量:" + 123 + "</div>");

                let infoWindow = new AMap.InfoWindow({
                    content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
                });
                infoWindow.open(this.map, [data.longitude, data.latitude]);
            },
        }
    }
</script>

<style scoped>

    .el-card {
        position: absolute;
        top: 18%;
        right: 4%;
        width: 20vw;
        height: 60vh;
    }

    .box-card {
        z-index: 1999;
    }

    #track-map {
        margin-top: -15px;
        width: 100%;
        box-sizing: border-box;
        height: calc(100% - 65px);
    }

    .monitoring {
        padding: 0;
    }

    .structureList {
        text-align: center;
        height: 50px;
        line-height: 50px;
        width: 100%;
        overflow: auto;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .structureList:hover {
        background: #409eff;
        color: white;
    }

    .structureActive {
        background: #409eff;
        color: white;
    }

    .content-wrapper >>> .el-card__body {
        height: calc(100% - 20px);
        overflow: auto;
    }

    .box-card >>> .el-divider--horizontal {
        margin: 0;
    }
</style>

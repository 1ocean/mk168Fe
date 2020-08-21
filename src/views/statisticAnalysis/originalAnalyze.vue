<template>
    <div class="content-wrapper measurementFlex" v-cloak>
        <!--        树形数据-->
        <div class="treeData">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <div ref="treeDiv" class="tree-container">
                <el-tree
                        id="tree" class="tree"
                        :indent='0'
                        :data="data"
                        :props="defaultProps"
                        default-expand-all
                        highlight-current
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        ref="tree">
                </el-tree>
            </div>


        </div>
        <div class="tabs">
            <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="70px">
                <el-row :gutter="0">
                    <el-col :span="8">
                        <el-form-item label="原始测值：">
                            <el-select
                                    v-model="searchArea.sensorMeasureId"
                                    multiple
                                    collapse-tags
                                    clearable
                                    size="small"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.sensorMeasureName"
                                        :value="item.sensorMeasureId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起止日期：">
                            <el-date-picker
                                    size="small"
                                    v-model="searchArea.time"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                            <el-button size="small" @click="exprot"
                                       v-if="activeName==2&&$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='realTimeData:export')!=-1">
                                导出
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--        表格数据-->
            <div class="valueTable">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="图表数据" name="1">
                        <div id="echarts" ref="chart" v-show="nowShow==='echarts'">

                        </div>
                        <div id="map" ref="map" v-show="nowShow==='map'">

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="表格数据" name="2">
                        <div style="white-space: nowrap">
                            <el-table
                                    v-for="(i,index) in tableData"
                                    :key="index"
                                    :header-cell-style="{background:'rgb(250,250,250)'}"
                                    :class="index==0?contentTable:contentTable2"
                                    :data="i"
                                    v-if="i.length!=0"
                                    stripe
                            >
                                <el-table-column
                                        v-if="index==0"
                                        type="index"
                                        label="序号"
                                        width="100">
                                </el-table-column>
                                <el-table-column
                                        prop="measureValue"
                                        :label="tableData[0].length!=0?i.name+'':''"
                                        width="220">
                                </el-table-column>
                            </el-table>
                            <el-table
                                    :header-cell-style="{background:'rgb(250,250,250)'}"
                                    :data="tableData[0]"
                                    stripe
                                    style="width: 180px !important;display: inline-block;vertical-align: top">
                                <el-table-column
                                        prop="reportTime"
                                        label="时间"
                                        width="180">
                                </el-table-column>
                            </el-table>
                        </div>

                        <!--                        &lt;!&ndash;        分页区域&ndash;&gt;-->
                        <!--                        <div class="valuePagination">-->
                        <!--                            <el-pagination-->
                        <!--                                    @size-change="handleSizeChange"-->
                        <!--                                    @current-change="handleCurrentChange"-->
                        <!--                                    :current-page="pageNum"-->
                        <!--                                    :page-sizes="[8, 16, 24, 32]"-->
                        <!--                                    :page-size="pageSize"-->
                        <!--                                    background-->
                        <!--                                    layout="total, sizes, prev, pager, next, jumper"-->
                        <!--                                    :total="total">-->
                        <!--                            </el-pagination>-->
                        <!--                        </div>-->
                    </el-tab-pane>
                    <el-tab-pane label="平均值数据" name="3">
                        <el-table
                                :header-cell-style="{background:'rgb(250,250,250)'}"
                                :data="averageTableData"
                                stripe
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    label="序号"
                                    width="50">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="测值名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="average"
                                    label="平均值"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="max"
                                    label="最大值"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="min"
                                    label="最小值"
                                    width="120">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "originalAnalyze.vue",
        data() {
            return {
                //用来判断echarts是否已经绘制过
                echartsAlready: false,
                //表格样式名
                contentTable: 'contentTable',
                contentTable2: 'contentTable2',
                //原始测值数据
                options: [],
                //树形数据过滤字段
                filterText: '',
                //树形数据
                data: [],
                //表格数据
                tableData: [],
                //树形数据匹配方式
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                //表格页码
                pageNum: 1,
                //表格宽度
                pageSize: 8,
                //表格总数
                total: 0,
                //平均表格数据
                averageTableData: [],
                //搜索数据
                searchArea: {
                    sensorMeasureId: '',
                    time: ''
                },
                //地图
                map: '',
                //当前展示echarts还是地图
                nowShow:'',
                //左标点
                array: [],
                //起止时间数据控制
                pickerOptions: {
                    disabledDate(time) {
                        //计算当前时间
                        return time.getTime() > Date.now() - 8.64e6 + 2 * 60 * 60 * 1000 + 23 * 60 * 1000
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                //tabs控制页面
                activeName: '1'
            };
        },
        mounted() {
        },
        beforeDestroy() {
            //离开页面时清空数据
            this.$route.params.treeId = undefined;
        },
        watch: {
            //监测搜索数据变化
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.$store.state.nowName = '历史记录';
            this.getTreeData();
        },
        methods: {
            //tabs点击
            handleClick(tab, event) {
            },
            //过滤数据方法
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //获取传感器树形列表
            getTreeData() {
                this.$axios({
                    url: this.$BaseUrl + '/measureStatistic/getTreeSensorList',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            this.data = res.data.data;
                            //当发现是页面跳转时，重新获取
                            if (this.$route.params.treeId != undefined) {
                                this.getTypeData(this.$route.params.treeId, 'router');
                            } else if (this.data[0] && this.data[0].children && this.data[0].children[0] && this.data[0].children[0].children && this.data[0].children[0].children[0] && this.data[0].children[0].children[0].children && this.data[0].children[0].children[0].children[0]) {
                                //不是得时候如果第一个有值默认第一个
                                this.getTypeData(this.data[0].children[0].children[0].children[0].id);
                            }

                        } else {
                            this.data = [];
                        }
                    }
                })
            },
            //获取测值
            getTypeData(id, type) {
                this.$axios({
                    url: this.$BaseUrl + '/measureStatistic/getSensorMeasureListBySensorid',
                    method: 'post',
                    data: {
                        sensorId: id
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            this.options = res.data.data;
                            this.searchArea.sensorMeasureId = [];
                            //设置起止时间默认值
                            this.searchArea.time = [new Date() - 1260 * 1000, new Date()-60*1000];
                            //判断是否是router跳转过来的
                            if (type === 'router') {
                                this.searchArea.sensorMeasureId.push(this.$route.params.sensorMeasureId);
                            } else {
                                this.searchArea.sensorMeasureId.push(this.options[0].sensorMeasureId);
                            }
                            this.onSubmit()
                        } else {
                            this.options = [];
                        }
                    }
                })
            },
            //树形数据点击事件
            handleNodeClick(data) {
                if (data.level == 4) {
                    this.getTypeData(data.id);
                    this.searchArea.sensorMeasureId = [];
                    this.searchArea.time = [];
                    //判断是否有绘制过再执行清理
                    this.echartsAlready && this.$chart.line('echarts', [], 'clear');
                    this.echartsAlready = false;
                    this.tableData = [
                        []
                    ];
                    this.$message({
                        message: '选择传感器成功',
                        type: 'success'
                    })
                }
            },
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum = 1;
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.pageNum = val;
            },
            //导出
            exprot() {
                if (this.searchArea.sensorMeasureId == '') {
                    this.$message.error('请选择原始测值')
                } else if (this.searchArea.time == null || this.searchArea.time.length == 0 || this.searchArea.time == []) {
                    this.$message.error('请选择起止时间')
                } else {
                    this.$axios({
                        url: this.$BaseUrl + '/measureStatistic/exportExcel',
                        method: 'post',
                        data: {
                            sensorMeasureIds: this.searchArea.sensorMeasureId,
                            startTime: this.$moment(this.searchArea.time[0]).format('YYYY-MM-DD HH:mm:ss'),
                            endTime: this.$moment(this.searchArea.time[1]).format('YYYY-MM-DD HH:mm:ss'),
                        },
                        responseType: 'blob'
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (!res.data) {
                                return;
                            }
                            let blob = new Blob([res.data], {
                                type:
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"
                            });
                            let url = window.URL.createObjectURL(blob);
                            let fileName = decodeURI(res.headers.filename);
                            if ("download" in document.createElement("a")) {
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = fileName;
                                a.style.display = "none";
                                document.body.appendChild(a);
                                a.click();
                                URL.revokeObjectURL(a.href);
                                document.body.removeChild(a);
                            } else {
                                navigator.msSaveBlob(blob, fileName);
                            }
                        }
                    });

                }
            },
            //查询
            onSubmit() {
                if (this.searchArea.sensorMeasureId == '') {
                    this.$message.error('请选择原始测值')
                } else if (this.searchArea.time == null || this.searchArea.time.length == 0 || this.searchArea.time == []) {
                    this.$message.error('请选择起止时间')
                } else {
                    this.$axios({
                        url: this.$BaseUrl + '/measureStatistic/getMeasureValueList',
                        method: 'post',
                        data: {
                            sensorMeasureIds: this.searchArea.sensorMeasureId,
                            startTime: this.$moment(this.searchArea.time[0]).format('YYYY-MM-DD HH:mm:ss'),
                            endTime: this.$moment(this.searchArea.time[1]).format('YYYY-MM-DD HH:mm:ss'),
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (res.data.data.length != 0) {
                                let data = res.data.data;
                                if (data.echarts.length == 0) {
                                    this.$message.error('当前时间段内没有数据！');
                                    return
                                }
                                // if (data.echarts[0].type == 0) {
                                    this.nowShow='echarts';
                                    //异步处理
                                    setTimeout(()=>{
                                        this.tableData = data.table;
                                        for (let i in data.table) {
                                            if (this.tableData[i].length != 0) {
                                                this.tableData[i].name = data.tableName[i]
                                            } else {
                                                this.tableData[i].name = ''
                                            }
                                        }
                                        this.$chart.line('echarts', data.echarts);
                                        this.averageTableData = [];
                                        for (let s in data.echarts) {
                                            data.echarts[s].cutline.name = data.echarts[s].name;
                                            this.averageTableData.push(data.echarts[s].cutline);
                                        }
                                        this.$message({
                                            message: '查询成功',
                                            type: 'success'
                                        });
                                        //echarts 已经绘制过
                                        this.echartsAlready = true;
                                    },100)
                                // } else if (data.echarts[0].type == 1) {
                                //     this.nowShow='map';
                                //     //异步处理
                                //     setTimeout(()=>{
                                //         //销毁之前得
                                //         this.map && this.map.destroy();
                                //
                                //         this.tableData = data.table;
                                //         this.averageTableData = [];
                                //         for (let i in data.table) {
                                //             if (this.tableData[i].length != 0) {
                                //                 this.tableData[i].name = data.tableName[i]
                                //             } else {
                                //                 this.tableData[i].name = ''
                                //             }
                                //         }
                                //         let array = [];
                                //         let point = [];
                                //         for (let d in data.echarts) {
                                //             array[d] = [];
                                //             for (let f in data.echarts[d].list) {
                                //                 array[d].push(data.echarts[d].list[f][1]);
                                //                 point.push([data.echarts[d].list[f][1].split(','), this.$moment(data.echarts[d].list[f][0]).format('YYYY-MM-DD HH:mm:ss')])
                                //             }
                                //         }
                                //         this.initMap(array)
                                //         this.addPoint(point)
                                //     },100)
                                //
                                // }
                            }
                        }
                    });

                }

            },
            //地图
            initMap(array) {
                let that = this;
                that.map = new AMap.Map('map', {
                    zoom: 5,//级别
                    center: [array[0][0].split(',')[0], array[0][0].split(',')[1]],//中心点坐标
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

                let lineArr = new Array();
                let lineArr2 = new Array();
                for (let a in array) {
                    for (let i in array[a]) {
                        lineArr[i] = array[a][i];
                        lineArr2[i] = new Array();
                        for (let j = 0; j < lineArr[i].split(',').length; j++) {
                            lineArr2[i][j] = lineArr[i].split(',')[j];
                        }
                        let polyline = new AMap.Polyline({
                            path: lineArr2,
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            strokeStyle: 'solid',
                            strokeDasharray: [10, 5],
                            geodesic: true

                        });
                        polyline.setMap(that.map);
                    }
                }

            },
            //移除所有坐标点
            removeAllOverlay() {
                this.map.clearMap()
            },
            //增加坐标点
            addPoint(pointList) {
                let that = this;
                let marker;
                for (let i in pointList) {
                    marker = new AMap.Marker({
                        position: new AMap.LngLat(pointList[i][0][0], pointList[i][0][1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        extData: {
                            id: i
                        }
                    });
                    // marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    //     offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                    //     content: pointList[i].structureName
                    // });
                    marker.on('click', function (e) {
                        that.openInfo(pointList[i])

                    });
                    // marker.on('removeAllOverlay', this.removeAllOverlay);
                    that.array.push(marker)
                }
                that.map.add(that.array);
            },
            regeocoder(data) {  //逆地理编码


            },
            //在指定位置打开信息窗体
            openInfo(data) {
                let that=this;
                let geocoder = new AMap.Geocoder();
                let address='';
                geocoder.getAddress([data[0][0],data[0][1]], function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                         address= result.regeocode.formattedAddress;
                    }
                });
                setTimeout(()=>{
                    address==''?address='暂无数据':address=address;
                    //构建信息窗体中显示的内容
                    let info = [];
                    info.push("<div class=\"content\" style='margin-top: -10px'>");
                    info.push("<div class=\"font_title\">时间：" + data[1] + "</div>");
                    info.push("<div class=\"font_title\">地址：" + address + "</div>");
                    let infoWindow = new AMap.InfoWindow({
                        content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
                    });
                    infoWindow.open(that.map, [data[0][0], data[0][1]]);
                },200)

            },
        },
    }
</script>

<style scoped>
    /*左侧tree控件样式*/
    .treeData {
        width: 300px;
        border-right: 1px solid rgb(220, 220, 220);
        height: 80vh;
        overflow: auto;
        padding-right: 20px;
        box-sizing: border-box;
    }

    /*右侧表格样式*/
    .valueTable {
        box-sizing: border-box;
        min-height: 92%;
        width: 100%;
        overflow: auto;
    }

    .contentTable {
        height: 70%;
    }

    /*分页样式*/
    .valuePagination {
        position: relative;
        top: 10%;
    }

    /*右侧整体样式*/
    .tabs {
        padding-left: 3%;
        box-sizing: border-box;
        height: 100%;
        width: calc(100% - 300px);
    }

    /*搜素区域距离底部距离*/
    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    /*设置form表单子元素宽度*/
    .content-wrapper >>> .el-form--inline .el-form-item__content {
        width: 60% !important;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }

    /*改变tabs内部样式*/
    .tabs >>> .el-range-editor--small.el-input__inner {
        width: 130%;
    }

    .valueTable >>> .el-tabs {
        height: 69.5vh;
    }

    .valueTable >>> .el-tabs__content {
        height: 88%;
        overflow: auto;
    }

    .valueTable >>> .el-tab-pane {
        width: 100%;
        height: 100%;
    }

    /*控制表格得样式 带序号得*/
    .contentTable {
        max-width: 320px;
        display: inline-block;
        vertical-align: top;
    }

    /*控制表格得样式 带序号得*/
    .contentTable2 {
        max-width: 320px;
        display: inline-block;
        vertical-align: top;
    }

    #echarts {
        width: 98%;
        height: 520px;
    }
    #map{
        width: 98%;
        height: 520px;
    }
    /*地图得infowindow 叉号位置*/
    >>>.amap-info-close{
        top: 25px;
    }
</style>

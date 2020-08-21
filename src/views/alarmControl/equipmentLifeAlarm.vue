<template>
    <div class="content-wrapper">
        <el-tabs v-model="$store.state.equipmentAlarmActive" @tab-click="handleClick">
            <el-tab-pane label=" 网 关 " name="0">
                <!--        搜索区域-->
                <el-form :inline="true" :model="gatewaySearchArea" class="demo-form-inline formInline"
                         label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="网关名称：">
                                <el-input v-model="gatewaySearchArea.gatewayName" size="small" placeholder="请输入网关名称"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="网关编号：">
                                <el-input v-model="gatewaySearchArea.gatewayCode" size="small" placeholder="请输入网关编号"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="所属项目/现场：">
                                <el-cascader
                                        size="small"
                                        v-model="gatewaySearchArea.psId"
                                        :props="props"
                                        clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="14">
                            <el-form-item label="报警时间：">
                                <el-date-picker
                                        size="small"
                                        v-model="gatewaySearchArea.time"
                                        type="daterange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" @click="onGateWaySubmit">查询</el-button>
                                <el-button size="small" @click="onGateWayReset">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--        表格区域-->
                <div class="gatewayTable">
                    <el-table
                            :header-cell-style="{background:'rgb(250,250,250)'}"
                            :data="gatewayTableData"
                            stripe
                            v-loading="loading"
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                label="报警编号"
                                width="210">
                            <template slot-scope="scope">
                                <a @click="goDetail(scope.row,'gateway')">{{scope.row.warnCode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="gateway.gatewayCode"
                                label="网关编号"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="gateway.gatewayName"
                                label="网关名称"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="所属项目"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="structureName"
                                label="所属现场"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="lastCalibrateDate"
                                label="最近一次校准日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="calibrateCycle"
                                label="校准周期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="deadline"
                                label="使用截止日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="warnTime"
                                label="报警时间"
                                min-width="160">
                        </el-table-column>
                    </el-table>
                </div>
                <!--        分页区域-->
                <div class="pagination">
                    <el-pagination
                            @size-change="gatewayHandleSizeChange"
                            @current-change="gatewayHandleCurrentChange"
                            :current-page="gatewaySearchArea.pageNum"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="gatewaySearchArea.pageSize"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="gatewayTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="传感器" name="1">
                <!--        搜索区域-->
                <el-form :inline="true" :model="sensorSearchArea" class="demo-form-inline formInline"
                         label-width="140px">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="传感器名称：">
                                <el-input v-model="sensorSearchArea.sensorName" size="small" placeholder="请输入传感器名称"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="传感器编号：">
                                <el-input v-model="sensorSearchArea.sensorCode" size="small" placeholder="请输入传感器编号"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="所属项目/现场/网关：">
                                <el-cascader
                                        size="small"
                                        v-model="sensorSearchArea.psId"
                                        :props="sensorProps"
                                        clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="14">
                            <el-form-item label="报警时间：">
                                <el-date-picker
                                        size="small"
                                        v-model="sensorSearchArea.time"
                                        type="daterange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" @click="onSensorSubmit">查询</el-button>
                                <el-button size="small" @click="onSensorReset">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--        表格区域-->
                <div class="gatewayTable">
                    <el-table
                            :header-cell-style="{background:'rgb(250,250,250)'}"
                            :data="sensorTableData"
                            stripe
                            v-loading="loading"
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                label="报警编号"
                                width="200">
                            <template slot-scope="scope">
                                <a @click="goDetail(scope.row,'sensor')">{{scope.row.warnCode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="sensor.sensorCode"
                                label="传感器编号"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="sensor.sensorName"
                                label="传感器名称"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="所属项目"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="structureName"
                                label="所属现场"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="warnUser"
                                label="报警联系人"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="lastCalibrateDate"
                                label="最近一次校准日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="calibrateCycle"
                                label="校准周期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="deadline"
                                label="使用截止日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="warnTime"
                                label="报警时间"
                                min-width="160">
                        </el-table-column>
                    </el-table>
                </div>
                <!--        分页区域-->
                <div class="pagination">
                    <el-pagination
                            @size-change="gatewayHandleSizeChange"
                            @current-change="gatewayHandleCurrentChange"
                            :current-page="sensorSearchArea.pageNum"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="sensorSearchArea.pageSize"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="sensorTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "equipmentLifeAlarm",
        data() {
            let that = this;
            return {
                //网关搜索区域
                gatewaySearchArea: {
                    gatewayName: '',
                    gatewayCode: '',
                    psId: [],
                    pageNum: 1,
                    pageSize: 5,
                    time:[]
                },

                //传感器搜索区域
                sensorSearchArea:{
                    sensorName: '',
                    sensorCode: '',
                    time: [],
                    psId: [],
                    pageNum: 1,
                    pageSize: 5,
                },


                //网关表格数据
                gatewayTableData: [],
                //网关数据总数
                gatewayTotal: 0,
                //表格loading
                loading: true,
                props: {
                    //点击加载
                    lazy: true,
                    //控制可不可单选每一个
                    checkStrictly: true,
                    lazyLoad(node, resolve) {
                        const {level} = node;
                        //根据level调取不同的数据
                        //根据leaf控制还能不能显示下一个框
                        setTimeout(() => {
                            if (level === 0) {
                                that.$axios({
                                    url: that.$BaseUrl + '/project/getProjectList',
                                    method: 'post'
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].projectName,
                                            value: data[i].projectId,
                                            leaf: level >= 1
                                        })
                                    }
                                    resolve(nodes);
                                });
                            } else {
                                that.$axios({
                                    url: that.$BaseUrl + '/structure/getStructureListByProjectId',
                                    method: 'post',
                                    data: {
                                        projectId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].structureName,
                                            value: data[i].structureId,
                                            leaf: level >= 1
                                        })
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },
                sensorProps: {
                    //点击加载
                    lazy: true,
                    //控制可不可单选每一个
                    checkStrictly: true,
                    lazyLoad(node, resolve) {
                        const {level} = node;
                        //根据level调取不同的数据
                        //根据leaf控制还能不能显示下一个框
                        setTimeout(() => {
                            if (level === 0) {
                                that.$axios({
                                    url: that.$BaseUrl + '/project/getProjectList',
                                    method: 'post'
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].projectName,
                                            value: data[i].projectId,
                                            leaf: level >= 2
                                        })
                                    }
                                    resolve(nodes);
                                });
                            } else if (level === 1) {
                                that.$axios({
                                    url: that.$BaseUrl + '/structure/getStructureListByProjectId',
                                    method: 'post',
                                    data: {
                                        projectId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].structureName,
                                            value: data[i].structureId,
                                            leaf: level >= 2
                                        })
                                    }
                                    resolve(nodes);
                                });
                            } else {
                                that.$axios({
                                    url: that.$BaseUrl + '/gateway/getGatewayListByStructureId',
                                    method: 'post',
                                    data: {
                                        structureId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].gatewayName,
                                            value: data[i].gatewayId,
                                            leaf: level >= 2
                                        })
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },
                //传感器表格数据
                sensorTableData: [],
                //传感器数据总数
                sensorTotal: 0,

                //起止时间数据控制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
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
            }
        },
        created() {
            this.$store.state.nowName='设备年限报警';
            this.getGatewayTableData();
            this.getSensorTableData();
        },
        methods: {
            //计算年月日的方法
            countTime(time) {
                let h = time / 360;
                let m = (time % 360) / 30;
                let s = (time % 360) % 30;
                let times = '';
                if (h >= 1) {
                    times = parseInt(h) + '年'
                }
                if (m >= 1) {
                    times = times + parseInt(m) + '月'
                }
                if (s > 0) {
                    times = times + s + '天'
                }
                return times;
            },
            //获取网关表格数据
            getGatewayTableData() {
                let data = {...this.gatewaySearchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.gatewaySearchArea.psId.length === 1) {
                    data.projectId = this.gatewaySearchArea.psId[0]
                } else if (this.gatewaySearchArea.psId.length === 2) {
                    data.structureId = this.gatewaySearchArea.psId[1];
                }
                if (data.time!=null&&data.time.length != 0) {
                    data.startTime = this.$moment(data.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    data.endTime = this.$moment(data.time[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                this.$axios({
                    url: this.$BaseUrl + '/gatewayYearWarn/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayTableData = [];
                        if (res.data.data != null) {
                            this.gatewayTableData = res.data.data.list;
                            for (let i in this.gatewayTableData){
                                this.gatewayTableData[i].calibrateCycle=this.countTime(this.gatewayTableData[i].calibrateCycle);
                                this.gatewayTableData[i].lastCalibrateDate=this.$moment(this.gatewayTableData[i].lastCalibrateDate).format('YYYY-MM-DD');
                                this.gatewayTableData[i].deadline=this.$moment(this.gatewayTableData[i].deadline).format('YYYY-MM-DD');
                                this.gatewayTableData[i].warnTime=this.$moment(this.gatewayTableData[i].warnTime).format('YYYY-MM-DD');
                            }
                            this.gatewayTotal = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.gatewayTableData = [];
                            this.gatewayTotal = 0;
                            this.loading = false;
                        }

                    }

                })
            },
            //获取传感器表格数据
            getSensorTableData() {
                let data = {...this.sensorSearchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.sensorSearchArea.psId.length === 1) {
                    data.projectId = this.sensorSearchArea.psId[0]
                } else if (this.sensorSearchArea.psId.length === 2) {
                    data.structureId = this.sensorSearchArea.psId[1];
                }
                if (data.time!=null&&data.time.length != 0) {
                    data.startTime = this.$moment(data.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    data.endTime = this.$moment(data.time[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                this.$axios({
                    url: this.$BaseUrl + '/sensorYearWarn/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.sensorTableData = [];
                        if (res.data.data != null) {
                            this.sensorTableData = res.data.data.list;
                            for (let i in this.sensorTableData){
                                this.sensorTableData[i].calibrateCycle=this.countTime(this.sensorTableData[i].calibrateCycle)
                                this.sensorTableData[i].lastCalibrateDate=this.$moment(this.sensorTableData[i].lastCalibrateDate).format('YYYY-MM-DD');
                                this.sensorTableData[i].deadline=this.$moment(this.sensorTableData[i].deadline).format('YYYY-MM-DD');
                                this.sensorTableData[i].warnTime=this.$moment(this.sensorTableData[i].warnTime).format('YYYY-MM-DD');
                            }
                            this.sensorTotal = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.sensorTableData = [];
                            this.sensorTotal = 0;
                            this.loading = false;
                        }
                    }
                })
            },
            //tabs点击
            handleClick(tab, event) {
            },
            //网关查询
            onGateWaySubmit() {
                this.gatewaySearchArea.pageNum = 1;
                this.loading = true;
                this.getGatewayTableData()
            },
            //网关重置
            onGateWayReset() {
                this.gatewaySearchArea.gatewayName = '';
                this.gatewaySearchArea.gatewayCode = '';
                this.gatewaySearchArea.time = [];
                this.gatewaySearchArea.psId = [];
            },
            //传感器查询
            onSensorSubmit() {
                this.sensorSearchArea.pageNum = 1;
                this.loading = true;
                this.getSensorTableData()
            },
            //传感器重置
            onSensorReset() {
                this.sensorSearchArea.sensorName = '';
                this.sensorSearchArea.sensorCode = '';
                this.sensorSearchArea.time = [];
                this.sensorSearchArea.psId = [];
            },
            //计算天数的方法
            changeData(time) {
                let y = time / 360;
                let m = (time % 360) / 30;
                let d = (time % 360) % 30;
                let date = [];
                y>0?date.push(parseInt(y)):date.push(0);
                m>0?date.push(parseInt(m)):date.push(0);
                d>0?date.push(parseInt(d)):date.push(0);
                return date;
            },
            //网关表格每页展示多少设置
            gatewayHandleSizeChange(val) {
                this.gatewaySearchArea.pageSize = val;
                this.gatewaySearchArea.pageNum = 1;
                this.loading = true;
                this.getGatewayTableData()
            },
            //网关跳转页码  以及页码点击
            gatewayHandleCurrentChange(val) {
                //设置页面为点击的页码
                this.gatewaySearchArea.pageNum = val;
                this.loading = true;
                this.getGatewayTableData()
            },

            //去详情页面
            goDetail(row,type) {
                this.$store.state.equipmentLifeAlarmData = row;

                this.$router.push({name: 'equipmentLifeAlarmDetail'});
            },
        }

    }
</script>

<style scoped>
    /*搜素区域距离底部距离*/
    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    /*设置form表单子元素宽度*/
    .content-wrapper >>> .el-form--inline .el-form-item__content {
        width: 55% !important;
        vertical-align: baseline;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }


    /*网关表格样式*/
    .gatewayTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }
</style>

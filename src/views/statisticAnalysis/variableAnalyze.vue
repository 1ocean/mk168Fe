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
                        <el-form-item label="变量：">
                            <el-select
                                    v-model="searchArea.variableId"
                                    multiple
                                    collapse-tags
                                    clearable
                                    size="small"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.variableName"
                                        :value="item.variableId">
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
                            <el-button size="small" @click="exprot" v-if="activeName==2&&$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableRealTimeData:export')!=-1" >导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--        表格数据-->
            <div class="valueTable">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="图表数据" name="1">
                        <div id="echarts" ref="chart">

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="表格数据" name="2">
                        <div style="white-space: nowrap">
                            <el-table
                                    v-for="(i,index) in tableData"
                                    :key="index"
                                    :header-cell-style="{background:'rgb(250,250,250)'}"
                                    :data="i"
                                    v-if="i.length!=0"
                                    style="width: 320px !important;display: inline-block;vertical-align: top;"
                                    stripe
                            >
                                <el-table-column
                                        prop="variableValue"
                                        :label="tableData[0].length!=0?i.name+'':''"
                                        width="140">
                                </el-table-column>
                                <el-table-column
                                        prop="reportTime"
                                        label="时间"
                                        width="180">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="平均值数据" name="3">
                        <el-table
                                :header-cell-style="{background:'rgb(250,250,250)'}"
                                :data=" averageTableData"
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
        name: "variableAnalyze.vue",
        data() {
            return {
                //用来判断echarts是否已经绘制过
                echartsAlready:false,
                //表格样式名
                contentTable: 'contentTable',
                contentTable2: 'contentTable2',
                //变量数据
                options: [],
                //树形数据过滤字段
                filterText: '',
                //树形数据
                data: [],
                //表格数据
                tableData: [

                ],
                //平均表格数据
                averageTableData:[],
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
                //搜索数据
                searchArea: {
                    variableId: '',
                    time: []
                },
                //起止时间数据控制
                pickerOptions: {
                    disabledDate(time) {
                        //计算当前时间
                        return time.getTime() > Date.now() - 8.64e6+2*60*60*1000+23*60*1000
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
            this.$route.params.treeId=undefined;
        },
        watch: {
            //监测搜索数据变化
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.$store.state.nowName='变量分析';
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
                    url: this.$BaseUrl + '/variableStatistic/getTreeVariableList',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            this.data = res.data.data;

                            //当发现是页面跳转时，重新获取
                            if (this.$route.params.treeId!=undefined){
                                this.getTypeData(this.$route.params.treeId,'router');
                            }else if (this.data[0] && this.data[0].children && this.data[0].children[0] ) {
                                //不是得时候如果第一个有值默认第一个
                                this.getTypeData(this.data[0].children[0].id);

                            }
                        } else {
                            this.data = [];
                        }
                    }
                })
            },
            //获取变量
            getTypeData(id,type) {
                this.$axios({
                    url: this.$BaseUrl + '/variableStatistic/getVariableListByStructureId',
                    method: 'post',
                    data: {
                        structureId: id
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            this.options = res.data.data;
                            this.searchArea.variableId=[];
                            //设置起止时间默认值
                            this.searchArea.time=[new Date() - 1260 * 1000, new Date()-60*1000];
                            //判断是否是router跳转过来的
                            if (type==='router'){
                                this.searchArea.variableId.push(this.$route.params.variableId);
                            }else {
                                this.searchArea.variableId.push(this.options[0].variableId);
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
                if (data.level == 2) {
                    this.getTypeData(data.id);
                    this.searchArea.variableId=[];
                    this.searchArea.time=[];
                    //判断是否有绘制过再执行清理
                    this.echartsAlready&&this.$chart.line('echarts',[],'clear');
                    this.echartsAlready=false;
                    this.tableData=[
                        [
                        ]
                    ];
                    this.$message({
                        message: '选择变量成功',
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
                if (this.searchArea.variableId == '') {
                    this.$message.error('请选择变量')
                } else if (this.searchArea.time==null||this.searchArea.time.length == 0 || this.searchArea.time == []) {
                    this.$message.error('请选择起止时间')
                } else {
                    this.$axios({
                        url: this.$BaseUrl + '/variableStatistic/exportExcel',
                        method: 'post',
                        data: {
                            variableIds: this.searchArea.variableId,
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
                if (this.searchArea.variableId == '') {
                    this.$message.error('请选择变量')
                } else if (this.searchArea.time==null||this.searchArea.time.length == 0 || this.searchArea.time == []) {
                    this.$message.error('请选择起止时间')
                } else {
                    this.$axios({
                        url: this.$BaseUrl + '/variableStatistic/getVariableValueList',
                        method: 'post',
                        data: {
                            variableIds: this.searchArea.variableId,
                            startTime: this.$moment(this.searchArea.time[0]).format('YYYY-MM-DD HH:mm:ss'),
                            endTime: this.$moment(this.searchArea.time[1]).format('YYYY-MM-DD HH:mm:ss'),
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (res.data.data.length != 0) {
                                let data = res.data.data;
                                if (data.echarts.length==0){
                                    this.$message.error('当前时间段内没有数据！');
                                    return
                                }
                                this.tableData = data.table;
                                for (let i in data.table) {
                                    if (this.tableData[i].length != 0) {
                                        this.tableData[i].name = data.tableName[i]
                                    } else {
                                        this.tableData[i].name = ''
                                    }
                                }
                                this.$chart.line('echarts', data.echarts);
                                this.averageTableData=[];
                                for (let s in data.echarts){
                                    data.echarts[s].cutline.name=data.echarts[s].name;
                                    this.averageTableData.push(data.echarts[s].cutline);
                                }
                                //echarts 已经绘制过
                                this.echartsAlready=true;
                            }
                        }

                    });

                }

            }
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
        /*width: 100%;*/
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
        width: 55% !important;
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
        min-width: 100%;
        height: 100%;
    }

    #echarts {
        width: 98%;
        height: 520px;
    }
</style>

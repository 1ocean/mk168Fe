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
                        highlight-current
                        default-expand-all
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        ref="tree">
                </el-tree>
            </div>


        </div>
        <!--        表格数据-->
        <div class="valueTable">
            <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="70px">
                <el-row :gutter="0">
                    <el-col :span="9">
                        <el-form-item label="监测因素：">
                            <el-select
                                    v-model="searchArea.monitorFactorId"
                                    clearable
                                    size="small"
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in elementOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="状态：">
                            <el-select
                                    v-model="searchArea.variableState"
                                    clearable
                                    size="small"
                                    placeholder="请选择">
                                <el-option label="异常" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                            <el-button size="small" @click="exprot"> 导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                    :header-cell-style="{background:'rgb(250,250,250)'}"
                    class="contentTable"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="variableCode"
                        label="变量编号"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="variableName"
                        label="变量名称"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="monitorFactorName"
                        label="监测因素"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="lastVariableValue"
                        label="最新数据"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="collectCycle"
                        label="采集频率"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        prop="getDataTime"
                        label="最新采集时间"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.variableState==1"><span style="color: rgb(0,168,84)">●</span> 正常</span>
                        <span v-else><span style="color: rgb(240,65,52)">●</span> 异常</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableStatistic:list')!=-1">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableStatistic:list')!=-1"
                                @click="historyCheck(scope.row)">历史查询
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--        分页区域-->
            <div class="valuePagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "variableValue",
        data() {
            return {
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
                //表格loading
                loading: false,
                //表格页码
                pageNum: 1,
                //表格宽度
                pageSize: 10,
                //表格总数
                total: 0,
                //当前选择的变量的id
                nowTreeDataId: '',
                //搜索区域
                searchArea: {
                    monitorFactorId: '',
                    pageNum: 1,
                    pageSize: 10,
                    structureId: '',
                    variableState: ''
                },
                //监测因素数据
                elementOptions: []
            };
        },
        watch: {
            //监测搜索数据变化
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.$store.state.nowName = '变量实时数据';
            this.getTypeData();
            this.getTreeData();
        },
        methods: {
            //过滤数据方法
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //获取变量树形列表
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
                            if (this.data[0] && this.data[0].children && this.data[0].children[0]) {
                                //不是得时候如果第一个有值默认第一个
                                this.nowTreeDataId = this.data[0].children[0].id;
                                this.searchArea.structureId = this.data[0].children[0].id;
                                this.getTableData();
                            }
                        } else {
                            this.data = [];
                        }
                    }
                })
            },
            //获取变量类型，监测因素
            getTypeData() {
                //监测因素
                this.$axios({
                    url: this.$BaseUrl + '/monitorFactor/getPageList',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.elementOptions = [];
                        for (let i in res.data.data.list) {
                            this.elementOptions.push({
                                label: res.data.data.list[i].monitorFactorName,
                                value: res.data.data.list[i].monitorFactorId
                            })
                        }
                    }
                })
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/variable/getPageList',
                    method: 'post',
                    data: {...this.searchArea}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if (res.data.data != null) {
                            this.tableData = res.data.data.list;
                            for (let i in this.tableData) {
                                this.tableData[i].collectCycle = this.changeTime(this.tableData[i].collectCycle)
                            }
                            this.total = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.tableData = [];
                            this.total = 0;
                            this.loading = false;
                        }
                    }
                })
            },
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
            //树形数据点击事件
            handleNodeClick(data) {
                if (data.level == 2) {
                    this.nowTreeDataId = data.id;
                    this.searchArea.structureId = data.id;
                    this.loading = true;
                    this.getTableData();
                    this.$message({
                        message: '选择现场成功',
                        type: 'success'
                    })
                }
            },
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.loading = true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //历史查询
            historyCheck(row) {
                //修改左侧菜单点击
                this.$store.state.defaultActive = '/statisticAnalysis/variableAnalyze';
                this.$router.push({
                    name: 'variableAnalyze',
                    params: {treeId: row.structureId, variableId: row.variableId}
                })
            },
            //导出
            exprot() {
                this.$axios({
                    url: this.$BaseUrl + '/variableRealTimeData/exportExcel',
                    method: 'post',
                    data: {...this.searchArea},
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

                })
            },
            //查询
            onSubmit() {
                this.searchArea.pageNum = 1;
                this.loading = true;
                this.getTableData();
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
        padding: 0 3%;
        box-sizing: border-box;
        height: 100%;
        width: calc(100% - 300px);
    }

    .contentTable {
        /*height: 80%;*/
    }

    /*分页样式*/
    .valuePagination {
        position: relative;
        top: 10%;
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
        width: 75% !important;
    }
</style>

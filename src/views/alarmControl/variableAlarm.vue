<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="150px">
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="所属项目/现场/变量：">
                        <el-cascader
                                size="small"
                                v-model="searchArea.psId"
                                :props="props"
                                @change="cascaderChange"
                                clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="变量名称：">
                        <el-input v-model="searchArea.variableName" size="small" placeholder="请输入编号" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="变量编号：">
                        <el-input v-model="searchArea.variableCode" size="small" placeholder="请输入名称" clearable></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="状态：">
                        <el-select v-model="searchArea.state" size="small" clearable placeholder="请选择">
                            <el-option label="报警中" value="0"></el-option>
                            <el-option label="已恢复" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="14">
                    <el-form-item label="报警时间：">
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
                        <el-button size="small" @click="reset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="table roleTable">
            <el-table
                    :header-cell-style="{background:'rgb(250,250,250)'}"
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
                        label="报警编号"
                        width="200">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.warnCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="projectName"
                        label="项目名称"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="structureName"
                        label="现场名称"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="variableName"
                        label="变量名称"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="variableCode"
                        label="变量编号"
                        width="130">
                </el-table-column>
                <el-table-column
                        label="触发条件"
                        width="180">
                    <template slot-scope="scope">
                        <span class="info-content" v-if="scope.row.triggerConditionFe==0">数值等于{{scope.row.firstValue}}</span>
                        <span class="info-content" v-else-if="scope.row.triggerConditionFe==1" >数值大于{{scope.row.firstValue}}小于{{scope.row.secondValue}}</span>
                        <span class="info-content" v-else-if="scope.row.triggerConditionFe==2">数值大于{{scope.row.firstValue}}</span>
                        <span class="info-content" v-else-if="scope.row.triggerConditionFe==3">数值小于{{scope.row.firstValue}}</span>
                        <span v-else class="info-content">-</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="warnValue"
                        label="报警值"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="warnTime"
                        label="报警时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="lrestoreTime"
                        label="恢复时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        label="状态"
                        min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==0"><span style="color: rgb(240,65,52)">●</span> 报警中</span>
                        <span v-else><span style="color: rgb(0,168,84)">●</span> 已恢复</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--        分页区域-->
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchArea.pageNum"
                    :page-sizes="[8, 16, 24, 32]"
                    :page-size="searchArea.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "variableAlarm",
        data() {
            let that = this;
            return {
                //搜索区域数据
                searchArea: {
                    pageNum: 1,
                    pageSize: 8,
                    state: '',
                    variableName: '',
                    variableCode: '',
                    psId: [],
                    time: []
                },
                //表格loading
                loading: true,
                //表格数据
                tableData: [],
                //total总数
                total: 0,
                //级联选择框数据
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
                            } else if (level === 2) {
                                that.$axios({
                                    url: that.$BaseUrl + '/variable/getPageList',
                                    method: 'post',
                                    data: {
                                        structureId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data.list;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].variableName,
                                            value: data[i].variableId,
                                            leaf: level >= 2
                                        });
                                    }
                                    resolve(nodes);
                                })
                            }

                        }, 0);
                    }
                },
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
            this.$store.state.nowName='变量报警';
            this.getTableData()
        },
        methods: {
            //查询
            onSubmit() {
                this.loading = true;
                this.searchArea.pageNum = 1;
                this.getTableData()
            },
            //重置查询参数
            reset() {
                this.searchArea.state = '';
                this.searchArea.variableName = '';
                this.searchArea.psId = [];
                this.searchArea.variableCode = '';
                this.searchArea.time = [];
            },

            //获取表格数据
            getTableData() {
                let data = {...this.searchArea};

                if (data.psId.length == 1) {
                    data.projectId = data.psId[0];
                } else if (data.psId.length == 2) {
                    data.structureId = data.psId[1];
                } else if (data.psId.length == 3) {
                    data.variableId = data.psId[2];
                }
                if (data.time!=null&&data.time.length != 0) {
                    data.startTime = this.$moment(data.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    data.endTime = this.$moment(data.time[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                this.$axios({
                    url: this.$BaseUrl + '/variableWarn/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if (res.data.data != null) {
                            this.tableData = res.data.data.list;
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
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.searchArea.pageSize = val;
                this.searchArea.pageNum = 1;
                this.loading = true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.searchArea.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //级联选择框值改变
            cascaderChange(value) {
            },
            //去变量报警详情
            goDetail(row) {
                this.$router.push({name: 'variableAlarmDetail'});
                this.$store.state.variableAlarmData = row;
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
        width: 65% !important;
    }

    /*表格class*/
    .roleTable {
        /*height: 70%;*/
    }
</style>

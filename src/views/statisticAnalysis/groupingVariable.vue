<template>
    <div class="content-wrapper" v-cloak>
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="120px">
            <el-row :gutter="80">
                <el-col :span="7">
                    <el-form-item label="变量分组名称：">
                        <el-input size="small" v-model="searchArea.variableGroupName" placeholder="请输入变量分组名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="变量分组编号：">
                        <el-input size="small" v-model="searchArea.variableGroupCode" placeholder="请输入变量分组编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="80">
                <el-col :span="7">
                    <el-form-item label="所属项目：">
                        <el-select size="small" v-model="searchArea.projectId" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in projectOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:add')!=-1"
                                   @click="groupingControl('add')">新增变量分组
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="groupingTable">
            <el-table
                    :header-cell-style="{background:'rgb(250,250,250)'}"
                    :data="tableData"
                    v-loading="loading"
                    stripe
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="变量分组编号"
                        width="150">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.variableGroupCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="variableGroupName"
                        label="变量分组名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="projectName"
                        label="所属项目"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="说明"
                        min-width="220">
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:update')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:del')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:setVariable')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:update')!=-1"
                                @click="groupingControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:del')!=-1"
                                @click="groupingDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableGroup:setVariable')!=-1"
                                @click="variableControl(scope.$index, scope.row)">配置变量
                        </el-button>

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
        <el-dialog
                :title="groupingTitle"
                :visible.sync="groupingVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="groupingHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="变量分组名称：" prop="variableGroupName">
                    <el-input size="small" v-model="ruleForm.variableGroupName"></el-input>
                </el-form-item>
                <el-form-item label="变量分组编号：" prop="variableGroupCode">
                    <el-input size="small" v-model="ruleForm.variableGroupCode"></el-input>
                </el-form-item>
                <el-form-item label="所属项目：" prop="projectId">
                    <el-select size="small" v-model="ruleForm.projectId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in projectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input size="small" v-model="ruleForm.remark" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupingCancel('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="groupingSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="配置变量"
                :visible.sync="variableVisible"
                :close-on-click-modal="false"
                width="670px"
                :before-close="variableHandleClose">
            <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    :titles="['未选择变量量', '已选择变量']"
                    :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                    filter-placeholder="请输入变量名称"
                    v-model="transferValue"
                    :data="data">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-button @click="variableCancel()">取 消</el-button>
                <el-button type="primary" @click="variableSure()">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "groupingVariable",
        data() {
            return {
                //穿梭框数据
                data: [],
                transferValue: [],
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1;
                },
                //搜索区域
                searchArea: {
                    variableGroupName: '',
                    variableGroupCode: '',
                    projectId: '',
                    pageNum: 1,
                    pageSize: 8,
                },
                //表格loading
                loading: false,
                //表格数据
                tableData: [],
                //表格数据总数
                total: 0,


                //新增/编辑协议弹窗显示
                groupingVisible: false,
                //新增编辑协议title
                groupingTitle: '',
                //新增/编辑协议 弹窗内数据
                ruleForm: {
                    variableGroupName: '',
                    variableGroupCode: '',
                    projectId: '',
                    remark: '',
                },
                //新增/编辑协议 数据规则
                rules: {
                    variableGroupName: [
                        {required: true, message: '请输入变量分组名称', trigger: 'blur'},
                    ],
                    variableGroupCode: [
                        {required: true, message: '请输入变量分组编号', trigger: 'blur'}
                    ],
                    projectId: [
                        {required: true, message: '请选择所属项目', trigger: 'change'}
                    ]
                },
                //编辑当前行的id
                variableGroupId: '',
                //所有项目数据
                projectOptions: [],

                //配置变量弹窗显示
                variableVisible: false
            }
        },
        created() {
            this.$store.state.nowName='变量分组管理';
            this.loading = true;
            this.getProjectData();
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
                this.searchArea.agreementName = '';
                this.searchArea.agreementType = '';
                this.searchArea.agreementCode = '';
            },
            //获取项目数据
            getProjectData() {
                this.$axios({
                    url: this.$BaseUrl + '/project/getProjectList',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.projectOptions = [];
                        for (let i in res.data.data) {
                            this.projectOptions.push({
                                label: res.data.data[i].projectName,
                                value: res.data.data[i].projectId
                            })
                        }
                    }
                })
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/variableGroup/getPageList',
                    method: 'post',
                    data: {...this.searchArea}
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
            //新增/编辑变量分组
            groupingControl(type, row) {
                if (type === 'add') {
                    this.groupingTitle = '新增变量分组';
                    this.ruleForm.variableGroupCode=this.$round.random('VG');
                } else {
                    this.groupingTitle = '编辑变量分组';
                    this.variableGroupId = row.variableGroupId;
                    this.ruleForm.variableGroupName = row.variableGroupName;
                    this.ruleForm.variableGroupCode = row.variableGroupCode;
                    this.ruleForm.projectId = row.projectId;
                    this.ruleForm.remark = row.remark;
                }

                this.groupingVisible = true;
            },
            //删除变量分组
            groupingDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/variableGroup/delVariableGroup',
                        method: 'post',
                        data: {
                            variableGroupId: row.variableGroupId,
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除变量分组成功!'
                            });
                            this.loading = true;
                            this.getTableData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            //新增/编辑变量分组弹窗右上角关闭
            groupingHandleClose(done) {
                this.clear();
                done();
            },
            //查看测值右上角关闭
            checkHandleClose(done) {
                this.ruleForm.variableGroupName = '';
                this.ruleForm.variableGroupCode = '';
                this.ruleForm.projectId = '';
                this.ruleForm.remark = '';
                done();
            },
            //新增/编辑变量分组弹窗数据清除
            clear() {
                this.ruleForm.variableGroupName = '';
                this.ruleForm.variableGroupCode = '';
                this.ruleForm.projectId = '';
                this.ruleForm.remark = '';
                this.groupingVisible = false;
                //异步操作
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
            },
            //新增/编辑变量分组弹窗取消
            groupingCancel() {
                this.clear();
            },
            //新增/编辑变量分组弹窗确定
            groupingSure(formName) {
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let data = {...this.ruleForm};

                            if (this.groupingTitle === '新增变量分组') {
                                this.$axios({
                                    url: this.$BaseUrl + '/variableGroup/addVariableGroup',
                                    method: 'post',
                                    data: data
                                }).then(res => {
                                    if (res.data.success == false) {
                                        this.$message.error(res.data.msg);
                                    } else {
                                        this.$message({
                                            message: '新增成功!',
                                            type: 'success'
                                        });
                                        this.loading = true;
                                        this.getTableData();
                                        this.clear();
                                    }
                                })
                            } else {
                                data.variableGroupId = this.variableGroupId;
                                this.$axios({
                                    url: this.$BaseUrl + '/variableGroup/updateVariableGroup',
                                    method: 'post',
                                    data: data
                                }).then(res => {
                                    if (res.data.success == false) {
                                        this.$message.error(res.data.msg);
                                    } else {
                                        this.$message({
                                            message: '编辑成功!',
                                            type: 'success'
                                        });
                                        this.loading = true;
                                        this.getTableData();
                                        this.clear();
                                    }
                                })
                            }

                        } else {
                            return false;
                        }
                    }
                );
            },
            //配置变量
            variableControl(index, row) {
                this.variableGroupId = row.variableGroupId;
                //获取所有的数据
                this.$axios({
                    url: this.$BaseUrl + '/variable/getPageList',
                    method: 'post',
                    data: {
                        projectId: row.projectId
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.data = [];
                        if (res.data.data != null) {
                            for (let i in res.data.data.list) {
                                this.data.push({
                                    label: res.data.data.list[i].variableName,
                                    key: res.data.data.list[i].variableId
                                })
                            }
                        }
                        //获取已选中的数据的数据
                        this.$axios({
                            url: this.$BaseUrl + '/variable/getVariableListByGroupId',
                            method: 'post',
                            data: {
                                variableGroupId: row.variableGroupId
                            }
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                this.transferValue = [];
                                if (res.data.data != null) {
                                    for (let i in res.data.data) {
                                        this.transferValue.push(
                                            res.data.data[i].variableId
                                        )
                                    }
                                }
                                this.variableVisible = true;
                            }
                        });
                    }

                });

            },
            //配置变量右上角关闭
            variableHandleClose(done) {
                done()
            },
            //配置变量关闭
            variableCancel() {
                this.variableVisible = false;
            },
            //配置变量确认
            variableSure() {
                this.$axios({
                    url: this.$BaseUrl + '/variableGroup/setVariable',
                    method: 'post',
                    data: {
                        variableGroupId: this.variableGroupId,
                        variableIds:this.transferValue
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.$message({
                            message: '配置成功!',
                            type: 'success'
                        });
                        this.loading=true;
                        this.getTableData();
                        this.variableVisible = false;
                    }
                });
            },
            //去详情
            goDetail(row){
                this.$store.state.groupingData=row;
                this.$router.push('groupingDetail')
            }

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
        width: 75% !important;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }

    /*设置表格高度*/
    .groupingTable {
        /*height: 63%;*/
        overflow: auto;
    }
</style>

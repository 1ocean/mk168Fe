<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="110px">
            <el-row :gutter="80">
                <el-col :span="7">
                    <el-form-item label="监测因素名称：">
                        <el-input v-model="searchArea.monitorFactorName" size="small" placeholder="请输入监测因素名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="监测因素编号：">
                        <el-input v-model="searchArea.monitorFactorCode" size="small" placeholder="请输入监测因素编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item style="width: 100% !important">
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='monitorFactor:add')!=-1"
                                   @click="elementControl('add')">新增监测因素
                        </el-button>
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
                        prop="monitorFactorCode"
                        label="监测因素编号"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="monitorFactorName"
                        label="监测因素名称"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        label="监测因素单位"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="说明"
                >
                </el-table-column>
                <el-table-column label="操作" width="180"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='monitorFactor:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='monitorFactor:del')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='monitorFactor:update')!=-1"
                                @click="elementControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='monitorFactor:del')!=-1"
                                @click="elementDelete(scope.$index, scope.row)">删除
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
                :title="elementTitle"
                :visible.sync="elementVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="elementHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="监测因素名称：" prop="monitorFactorName">
                    <el-input size="small" v-model="ruleForm.monitorFactorName"></el-input>
                </el-form-item>
                <el-form-item label="监测因素编号：" prop="monitorFactorCode">
                    <el-input size="small" v-model="ruleForm.monitorFactorCode"></el-input>
                </el-form-item>
                <el-form-item label="监测因素单位：" prop="unit">
                    <el-input size="small" v-model="ruleForm.unit"></el-input>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="elementCancel()">取 消</el-button>
                    <el-button type="primary" @click="elementSure('ruleForm')">确 定</el-button>
                     </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "elementControl",
        data() {
            return {
                //搜索区域
                searchArea: {
                    pageNum: 1,
                    pageSize: 8,
                    monitorFactorName: '',
                    monitorFactorCode: ''
                },
                //表格数据
                tableData: [],
                //表格loading
                loading: true,
                //表格总数
                total: 0,
                //新增/编辑监测因素title
                elementTitle: '',
                //新增/编辑监测因素弹窗显示
                elementVisible: false,
                //新增/编辑监测因素数据
                ruleForm: {
                    monitorFactorName: '',
                    monitorFactorCode: '',
                    unit: '',
                    remark: '',
                },
                //新增/编辑算法 数据规则
                rules: {
                    monitorFactorName: [
                        {required: true, message: '请输入监测因素名称', trigger: 'blur'},
                    ],
                    monitorFactorCode: [
                        {required: true, message: '请输入监测因素编号', trigger: 'blur'}
                    ],
                    unit: [
                        {required: true, message: '请输入监测因素单位', trigger: 'blur'}
                    ]
                },
                //当前选中监测因素得id
                monitorFactorId: ''
            }
        },
        created() {
            this.$store.state.nowName='监测因素管理';
            this.getTableData();
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
                this.searchArea.algorithmName = '';
                this.searchArea.algorithmCode = '';
            },
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.searchArea.pageSize = val;
                this.searchArea.pageNum = 1;
                this.loading = true;
                this.getTableData()
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/monitorFactor/getPageList',
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
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.searchArea.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //新增/编辑算法点击
            elementControl(type, row) {
                if (type === 'add') {
                    this.elementTitle = '新增监测因素';
                    this.ruleForm.monitorFactorCode=this.$round.random('M');
                } else {
                    this.elementTitle = '编辑监测因素';
                    this.ruleForm.monitorFactorName = row.monitorFactorName;
                    this.ruleForm.monitorFactorCode = row.monitorFactorCode;
                    this.ruleForm.unit = row.unit;
                    this.ruleForm.remark = row.remark;
                    this.monitorFactorId = row.monitorFactorId;
                }
                this.elementVisible = true;
            },
            //新增/编辑算法弹窗右上角关闭
            elementHandleClose(done) {
                this.clear();
                done();
            },
            clear() {
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);
                this.ruleForm.monitorFactorName = '';
                this.ruleForm.monitorFactorCode = '';
                this.ruleForm.unit = '';
                this.ruleForm.remark = '';
                this.elementVisible = false;

            },
            //新增/编辑算法取消
            elementCancel() {
                this.clear();
            },
            //新增//编辑算法确认
            elementSure(formName) {
                this.$refs[formName].validate((valid) => {
                    let data ={...this.ruleForm};
                        let url, msg;
                        if (this.elementTitle === '新增监测因素') {
                            url = this.$BaseUrl + '/monitorFactor/addMonitorFactor';
                            msg = '新增成功';

                        } else {
                            url = this.$BaseUrl + '/monitorFactor/updateMonitorFactor';
                            msg = '编辑成功';
                            data.monitorFactorId=this.monitorFactorId;
                        }
                        if (valid) {
                            this.$axios({
                                url: url,
                                method: 'post',
                                data: data
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getTableData();
                                    this.clear();
                                }
                            })
                        } else {
                            return false;
                        }
                    }
                )
            },
            //删除算法协议
            elementDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/monitorFactor/delMonitorFactor',
                        method: 'post',
                        data: {
                            monitorFactorId: row.monitorFactorId
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.loading = true;
                            this.getTableData();
                            this.clear();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

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
        width: 75% !important;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }

    /*表格class*/
    .roleTable {
        /*height: 70%;*/
    }
</style>

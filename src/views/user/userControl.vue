<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="80px">
            <el-row :gutter="80">
                <el-col :span="5">
                    <el-form-item label="姓名：">
                        <el-input v-model="searchArea.name" size="small" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="角色：">
                        <el-select v-model="searchArea.roleId" size="small" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in roleOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="5">-->
                <!--                    <el-form-item label="用户类型：">-->
                <!--                        <el-select v-model="searchArea.userType" size="small" clearable placeholder="请选择" >-->
                <!--                            <el-option label="管理端" value="0"></el-option>-->
                <!--                            <el-option label="业主端" value="1"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
            </el-row>
            <el-row :gutter="80">
                <el-col :span="5">
                    <el-form-item label="手机号码：">
                        <el-input v-model="searchArea.mobile" size="small" placeholder="请输入手机号码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="状态：">
                        <el-select v-model="searchArea.doUse" size="small" clearable placeholder="请选择">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="停用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <!--                        运用findIndex去找这个按钮应不应该显示-->
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:add')!=-1"
                                   @click="userControl('add')">新增用户
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="table">
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
                        prop="userName"
                        label="用户名"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        label="性别"
                        width="60">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==1">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色"
                        min-width="120">
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        label="用户类型"-->
                <!--                        width="120">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <span v-if="scope.row.userType==0">管理端</span>-->
                <!--                        <span v-else>业主端</span>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="mobile"
                        label="手机号码"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注"
                        min-width="260">
                </el-table-column>
                <el-table-column
                        label="是否接受报警"
                        width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.receiveWarning==1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="是否绑定微信"
                        width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.openId!=null&&scope.row.openId!=''">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        min-width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.doUse==1"><span style="color: rgb(0,168,84)">●</span> 启用</div>
                        <div v-else><span style="color: rgb(240,65,52)">●</span> 禁用</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:update')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:del')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:updateDoUse')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:restPwd')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:update')!=-1"
                                @click="userControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:del')!=-1"
                                @click="userDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <span style="margin-left: 10px;"
                              v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:updateDoUse')!=-1">
                            <el-popover
                                    placement="bottom"
                                    width="10"
                                    trigger="hover">
                            <div style="text-align: center">
                                <el-button v-if="scope.row.doUse==0" size="mini" type="text"
                                           @click="changeStatus(1,'启用',scope.row)">启用</el-button>
                                <el-button v-else size="mini" type="text"
                                           @click="changeStatus(0,'停用',scope.row)">停用</el-button>
                            </div>
                            <div style="text-align: center"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='user:restPwd')!=-1">
                                <el-button size="mini" type="text" @click="resetPassword(scope.row)">重置密码</el-button>
                            </div>

                            <el-button size="mini" type="primary" round plain slot="reference">更多</el-button>
                        </el-popover>
                        </span>

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
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="searchArea.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog
                :title="userTitle"
                :visible.sync="userVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="userHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="用户名：" size="small" prop="userName" >
                    <el-input v-model="ruleForm.userName" :disabled="userTitle=='编辑用户'"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" size="small" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <el-select v-model="ruleForm.roleId" size="small" clearable placeholder="请选择">
                        <el-option
                                v-for="item in roleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-select v-model="ruleForm.sex" size="small" clearable placeholder="请选择">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <!--                <el-form-item label="用户类型：" prop="userType">-->
                <!--                    <el-select v-model="ruleForm.userType" size="small" clearable placeholder="请选择">-->
                <!--                        <el-option label="管理端" value="0"></el-option>-->
                <!--                        <el-option label="业主端" value="1"></el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
                <el-form-item label="是否接收报警：" prop="receiveWarning" >
                    <el-select v-model="ruleForm.receiveWarning" size="small" clearable placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码：" size="small" prop="mobile">
                    <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="userCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="userSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userControl",
        data() {
            return {
                //查询数据
                searchArea: {
                    name: '',
                    roleId: '',
                    mobile: '',
                    doUse: '',
                    userType: '',
                    //表格宽度
                    pageSize: 5,
                    //当前多少页
                    pageNum: 1,
                },
                //角色选择框数据
                roleOptions: [],
                //表格数据
                tableData: [],
                //表格数据总数
                total: 0,
                //新增/编辑用户 弹窗title
                userTitle: '',
                //新增/编辑用户 弹窗显示
                userVisible: false,
                //编辑时使用的当前选择用户的userId
                userId: '',
                //新增/编辑用户 弹窗内数据
                ruleForm: {
                    userName: '',
                    roleId: '',
                    name: '',
                    receiveWarning: '',
                    mobile: '',
                    sex: '',
                    userType: '0',
                    remark: ''
                },
                //新增/编辑用户 数据规则
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'change'}
                    ],
                    receiveWarning: [
                        {required: true, message: '请选择是否接收报警通知', trigger: 'change'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    // userType: [
                    //     {required: true, message: '请选择用户类型', trigger: 'change'}
                    // ],
                },
                //表格loading
                loading: true
            }
        },
        created() {
            this.$store.state.nowName='用户管理';
            this.getTableData();
            this.getRoleData();
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
                this.searchArea.name = '';
                this.searchArea.roleId = '';
                this.searchArea.mobile = '';
                this.searchArea.userType = '';
                this.searchArea.doUse = '';
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/user/getPageList',
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
            //获取角色数据
            getRoleData() {
                this.$axios({
                    url: this.$BaseUrl + '/role/getPageList',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        let array = res.data.data.list;
                        for (let i in array) {
                            this.roleOptions.push({label: array[i].roleName, value: array[i].roleId})
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
            //新增/编辑用户弹窗右上角关闭
            userHandleClose(done) {
                this.clear();
                done();
            },
            //新增/编辑用户点击
            userControl(type, row) {
                if (type === 'add') {
                    this.userTitle = '新增用户';
                } else {
                    this.userTitle = '编辑用户';
                    this.ruleForm.userName = row.userName;
                    this.ruleForm.roleId = row.roleId;
                    this.ruleForm.userType = row.userType+'';
                    this.ruleForm.name = row.name;
                    this.ruleForm.sex = row.sex + '';
                    this.ruleForm.receiveWarning = row.receiveWarning + '';
                    this.ruleForm.mobile = row.mobile;
                    this.ruleForm.remark = row.remark;
                    this.userId = row.userId;
                }
                this.userVisible = true;
            },
            //清空新增/编辑用户弹窗数据
            clear() {
                //异步操作
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);

                this.ruleForm.userName = '';
                this.ruleForm.roleId = '';
                this.ruleForm.userType = '0';
                this.ruleForm.name = '';
                this.ruleForm.sex = '';
                this.ruleForm.receiveWarning = '';
                this.ruleForm.mobile = '';
                this.ruleForm.remark = '';
                this.userId = '';
            },
            //新增/编辑用户弹窗取消
            userCancel() {
                this.clear();
                this.userVisible = false;
            },
            //新增/编辑用户弹窗确定
            userSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data={...this.ruleForm};
                        if (this.userTitle === '新增用户') {
                            this.$axios({
                                url: this.$BaseUrl + '/user/addUser',
                                method: 'post',
                                data:data
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
                                    this.userVisible = false;
                                }

                            })
                        } else {
                            data.userId = this.userId;
                            this.$axios({
                                url: this.$BaseUrl + '/user/updateUser',
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
                                    this.userVisible = false;
                                }
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            //删除用户
            userDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/user/delUser',
                        method: 'post',
                        data: {
                            userId: row.userId,
                            userName: row.userName
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loading = true;
                            this.getTableData();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //启用/停用用户
            changeStatus(type, typeName, row) {
                this.$confirm('确认' + typeName + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/user/updateDoUse',
                        method: 'post',
                        data: {
                            userId: row.userId,
                            doUse: type,
                            userName: row.userName
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: typeName + '成功!'
                            });
                            this.loading = true;
                            this.getTableData();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            //重置密码
            resetPassword(row) {
                this.$confirm('确认将密码重置为123456?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/user/restPwd',
                        method: 'post',
                        data: {
                            userId: row.userId,
                            userName: row.userName
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '重置成功!'
                            });
                            this.loading = true;
                            this.getTableData();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
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

</style>

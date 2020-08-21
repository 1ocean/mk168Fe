<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="90px">
            <el-row :gutter="80">
                <el-col :span="6">
                    <el-form-item label="角色名称：">
                        <el-input v-model="searchArea.roleName" size="small" placeholder="请输入角色名称" clearable></el-input>
                    </el-form-item>
                </el-col>
<!--                <el-col :span="6">-->
<!--                    <el-form-item label="角色类型：">-->
<!--                        <el-select v-model="searchArea.roleType" size="small" clearable placeholder="请选择">-->
<!--                            <el-option label="1" value="1"></el-option>-->
<!--                            <el-option label="0" value="0"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
                <el-col :span="12">
                    <el-form-item style="width: 100% !important">
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:add')!=-1"
                                   @click="roleControl('add')">新增角色
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
                        prop="roleName"
                        label="角色名称"
                        align="center"
                        min-width="200">
                </el-table-column>
<!--                <el-table-column-->
<!--                        prop="roleType"-->
<!--                        label="角色类型"-->
<!--                        align="center"-->
<!--                        min-width="200">-->
<!--                </el-table-column>-->
                <el-table-column
                        prop="remark"
                        label="角色描述"
                        align="center"
                        min-width="300"
                        >
                </el-table-column>
                <el-table-column label="操作" width="240"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:update')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:del')!=-1
||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:permissionConf')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:update')!=-1"
                                @click="roleControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:del')!=-1"
                                @click="roleDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='role:permissionConf')!=-1"
                                @click="permissionSetting(scope.$index, scope.row)">权限设置
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
                :title="roleTitle"
                :visible.sync="roleVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="roleHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称：" prop="roleName">
                    <el-input size="small" v-model="ruleForm.roleName"></el-input>
                </el-form-item>
<!--                <el-form-item label="角色类型：" prop="roleType">-->
<!--                    <el-select v-model="ruleForm.roleType" size="small" clearable placeholder="请选择">-->
<!--                        <el-option label="1" value="1"></el-option>-->
<!--                        <el-option label="0" value="0"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <el-form-item label="角色描述：">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="roleCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="roleSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="权限设置"
                :visible.sync="permissionVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="permissionHandleClose">
            <div style="height: 60vh;overflow: auto">
                <div ref="treeDiv" class="tree-container">
                    <el-tree
                            id="tree" class="tree"
                            :indent='0'
                            :data="treeData"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            @check-change="treeNodeClick"
                            :props="treeProps">
                    </el-tree>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="permissionCancel">取 消</el-button>
            <el-button type="primary" @click="permissionSure">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roleControl",
        data() {
            return {
                //查询数据
                searchArea: {
                    roleName: '',
                    roleType: '',
                    //表格宽度
                    pageSize: 8,
                    //当前多少页
                    pageNum: 1,
                },
                //表格数据
                tableData: [],
                //表格数据总数
                total: 0,
                //新增/编辑角色 弹窗title
                roleTitle: '',
                //新增/编辑角色 弹窗显示
                roleVisible: false,
                //权限 弹窗显示
                permissionVisible: false,
                //编辑时使用的当前选择角色的roleId
                roleId: '',
                //新增/编辑角色 弹窗内数据
                ruleForm: {
                    roleName: '',
                    roleType: '0',
                    remark: '',
                },
                //新增/编辑角色 数据规则
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                    ],

                },
                //tree 用来命名label 和 children的属性名
                treeProps: {
                    label: 'label',
                    children: 'children'
                },
                //权限树形的data
                treeData: [],
                //默认当前角色已选择的权限数组
                checked: [],
                //修改后选择的权限
                orginChecked: [],
                //当前选择的角色id
                nowRoleId: '',
                //当前选中的tree层级
                nowLevel: 1,
                //表格loading
                loading:true
            }
        },
        created() {
            this.$store.state.nowName='角色管理';
            this.getTableData();
        },
        methods: {
            //查询
            onSubmit() {
                this.loading=true;
                this.searchArea.pageNum = 1;
                this.getTableData()
            },
            //重置查询参数
            reset() {
                this.searchArea.roleName = '';
                this.searchArea.roleType = '';
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/role/getPageList',
                    method: 'post',
                    data: {...this.searchArea}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if(res.data.data!=null){
                            this.tableData = res.data.data.list;
                            this.total = res.data.data.total;
                            this.loading=false;
                        }else {
                            this.tableData = [];
                            this.total = 0;
                            this.loading=false;
                        }
                    }
                })
            },
            //权限编辑
            permissionSetting(index, row) {
                this.getTreeData(row);
                this.nowRoleId = row.roleId;
            },
            //获取当前人权限树形数据
            getTreeData(row) {
                //获取所有权限
                this.$axios({
                    url: this.$BaseUrl + '/role/getAllMenuList',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.treeData = [];
                        this.treeData = res.data.data;
                        this.$axios({
                            url: this.$BaseUrl + '/role/getPermissionsByRoleId',
                            method: 'post',
                            data: {roleId: row.roleId}
                        }).then(res => {
                            this.checked = [];
                            this.orginChecked = [];
                            for (let i in res.data.data) {
                                this.checked.push(res.data.data[i].permissionId);
                            }
                            if (this.checked != []) {
                                setTimeout(() => {
                                    this.$refs.tree.setCheckedKeys(this.checked)
                                }, 100)
                            }
                            this.permissionVisible = true;
                        })
                    }
                })
            },
            //权限树形选择点击
            treeNodeClick(data, checked, indeterminate) {
                if (checked) {
                    //恢复初始层数
                    this.nowLevel = 1;
                    this.checkLevel(data);
                    if (this.nowLevel == 1) {
                        this.orginChecked.push({permissionId: data.id});
                    }
                } else {
                    for (let i in this.orginChecked) {
                        if (data.id == this.orginChecked[i].permissionId) {
                            this.orginChecked.splice(i, 1)
                        }
                    }
                }
            },
            //判断el-tree当前是第几层
            checkLevel(data) {
                if (data.children != null) {
                    this.checkLevel(data.children);
                    this.nowLevel++
                }
            },
            //新增/编辑角色点击
            roleControl(type, row) {
                if (type === 'add') {
                    this.roleTitle = '新增角色';
                } else {
                    this.roleTitle = '编辑角色';
                    this.ruleForm.roleName = row.roleName;
                    this.ruleForm.remark = row.remark;
                    this.roleId = row.roleId;
                }
                this.roleVisible = true;
            },
            //新增/编辑角色弹窗右上角关闭
            roleHandleClose(done) {
                this.clear();
                done();
            },
            //权限配置窗口右上角关闭
            permissionHandleClose(done) {
                this.treeData = [];
                this.checked = [];
                this.orginChecked = [];
                done();
            },
            //清空新增/编辑角色弹窗数据
            clear() {
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);


                this.ruleForm.roleName = '';
                this.ruleForm.doUse = '';
                this.ruleForm.remark = '';
                this.userId = '';
            },
            //新增/编辑角色弹窗取消
            roleCancel() {
                this.clear();
                this.roleVisible = false;
            },
            //新增/编辑角色弹窗确定
            roleSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.roleTitle === '新增角色') {
                            this.$axios({
                                url: this.$BaseUrl + '/role/addRole',
                                method: 'post',
                                data: {...this.ruleForm}
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '新增成功!',
                                        type: 'success'
                                    });
                                    this.loading=true;
                                    this.getTableData();
                                    this.clear();
                                    this.roleVisible = false;
                                }
                            })
                        } else {
                            let data = {...this.ruleForm};
                            data.roleId = this.roleId;
                            this.$axios({
                                url: this.$BaseUrl + '/role/updateRole',
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
                                    this.loading=true;
                                    this.getTableData();
                                    this.clear();
                                    this.roleVisible = false;
                                }
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            //权限配置取消
            permissionCancel() {
                //置空树形数据
                this.treeData = [];
                //置空已选择
                this.checked = [];
                //置空默认树形选择
                this.$refs.tree.setCheckedKeys([]);
                //置空当前树形选择
                this.orginChecked = [];
                //关闭显示权限框
                this.permissionVisible = false;
            },
            //权限配置确认
            permissionSure() {
                this.$axios({
                    url: this.$BaseUrl + '/role/permissionConf',
                    method: 'post',
                    data: {
                        roleId: this.nowRoleId,
                        rolePermissionList: this.orginChecked
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.nowRoleId = '';
                        this.treeData = [];
                        this.checked = [];
                        //置空树形选择
                        this.$refs.tree.setCheckedKeys([]);
                        this.orginChecked = [];
                        this.permissionVisible = false;
                        this.$message({
                            type: 'success',
                            message: '权限配置成功!'
                        });
                    }
                });
            },
            //删除角色
            roleDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/role/delRole',
                        method: 'post',
                        data: {
                            roleId: row.roleId,
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loading=true;
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

            //表格每页展示多少设置
            handleSizeChange(val) {
                this.searchArea.pageSize = val;
                this.searchArea.pageNum = 1;
                this.loading=true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.searchArea.pageNum = val;
                this.loading=true;
                this.getTableData()
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

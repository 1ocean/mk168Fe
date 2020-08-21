<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/equipmentManagement/equipmentControl' }">控制设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>控制设备详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    设备编号：<span class="info-content" v-if="info.reverseEquipmentCode&&info.reverseEquipmentCode!=''">{{info.reverseEquipmentCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    设备名称：<span class="info-content" v-if="info.reverseEquipmentName&&info.reverseEquipmentName!=''">{{info.reverseEquipmentName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    设备类型：<span class="info-content" v-if="info.reverseEquipmentType&&info.reverseEquipmentType!=''">{{info.reverseEquipmentType}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    所属项目：<span class="info-content"
                               v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属现场：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属网关：<span class="info-content"
                               v-if="info.gatewayName&&info.gatewayName!=''">{{info.gatewayName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="24">
                    设备说明：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">操作指令</div>
        <el-button style="margin-bottom: 40px" type="primary" size="small" icon="el-icon-plus"
                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:add')!=-1"
                   @click="equipmentControl('add')">新增操作指令
        </el-button>
        <el-table
                :header-cell-style="{background:'rgb(250,250,250)'}"
                :data="tableData"
                stripe
                v-loading="loading"
                style="width: 100%">
            <el-table-column
                    type="index"
                    label="序号"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="operateOrderName"
                    label="指令名称"
                    min-width="140">
            </el-table-column>
            <el-table-column
                    prop="operateOrderContent"
                    label="下发指令内容"
                    min-width="260">
            </el-table-column>
            <el-table-column
                    prop="responseOperateOrder"
                    label="响应指令内容"
                    min-width="260">
            </el-table-column>
            <el-table-column
                    label="指令类型"
                    min-width="140">
                <template slot-scope="scope">
                    <span v-if="scope.row.operateOrderType==0">关闭</span>
                    <span v-if="scope.row.operateOrderType==1">开启</span>
                    <span v-if="scope.row.operateOrderType==2">其他模拟量指令</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="说明"
                    min-width="260">
            </el-table-column>
            <!--                <el-table-column-->
            <!--                        prop="resultType"-->
            <!--                        label="结果类型"-->
            <!--                        min-width="140">-->
            <!--                    <template slot-scope="scope">-->
            <!--                        <span v-if="scope.row.resultType==0">成功/失败</span>-->
            <!--                        <span v-else>开启/关闭</span>-->
            <!--                    </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="startPos"-->
            <!--                        label="起始位"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="dataLength"-->
            <!--                        label="数据长度"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="openCode"-->
            <!--                        label="开启编号"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="closeCode"-->
            <!--                        label="关闭编号"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="successCode"-->
            <!--                        label="成功编号"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <!--                <el-table-column-->
            <!--                        prop="failCode"-->
            <!--                        label="失败编号"-->
            <!--                        width="110">-->
            <!--                </el-table-column>-->
            <el-table-column label="操作" width="230"
                             v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:update')!=-1||
                             $store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:del')!=-1||
                                    $store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:execute')!=-1
                                    "
                             fixed="right">
                <template slot-scope="scope">
                    <el-button
                            type="warning"
                            size="mini"
                            round
                            plain
                            v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:update')!=-1"
                            @click="equipmentControl('edit',scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            round
                            plain
                            v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:del')!=-1"
                            @click="equipmentDelete(scope.$index, scope.row)">删除
                    </el-button>
                    <el-button
                            size="mini"
                            type="primary"
                            round
                            plain
                            v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:execute')!=-1
                            &&scope.row.operateOrderType==2
                            "
                            @click="equipmentDo(scope.$index, scope.row)">执行
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--        分页区域-->
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <div class="button">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
        <el-dialog
                :title="equipmentTitle"
                :close-on-click-modal="false"
                :visible.sync="equipmentVisible"
                width="500px"
                :before-close="equipmentHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="指令名称：" prop="operateOrderName">
                    <el-input size="small" v-model="ruleForm.operateOrderName"></el-input>
                </el-form-item>
                <el-form-item label="下发指令内容：" prop="operateOrderContent">
                    <el-input size="small" v-model="ruleForm.operateOrderContent"></el-input>
                </el-form-item>
                <el-form-item label="响应指令内容：" prop="operateOrderContent">
                    <el-input size="small" v-model="ruleForm.responseOperateOrder"></el-input>
                </el-form-item>
                <el-form-item label="指令类型：" prop="operateOrderType">
                    <el-select size="small" v-model="ruleForm.operateOrderType"  clearable placeholder="请选择">
                        <el-option label="开启" value="1"></el-option>
                        <el-option label="关闭" value="0"></el-option>
                        <el-option label="其他模拟量指令" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input size="small" type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>

                <!--                <el-form-item label="起始位：" prop="startPos">-->
                <!--                    <el-input-number size="small" v-model="ruleForm.startPos" controls-position="right" :min="1"-->
                <!--                                     :max="100"></el-input-number>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="数据长度：" prop="dataLength">-->
                <!--                    <el-input-number size="small" v-model="ruleForm.dataLength" controls-position="right" :min="1"-->
                <!--                                     :max="100"></el-input-number>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="成功编号：" v-if="ruleForm.resultType==0" prop="successCode">-->
                <!--                    <el-input size="small" v-model="ruleForm.successCode"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="失败编号：" v-if="ruleForm.resultType==0" prop="failCode">-->
                <!--                    <el-input size="small" v-model="ruleForm.failCode"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="开启编号：" v-if="ruleForm.resultType==1" prop="openCode">-->
                <!--                    <el-input size="small" v-model="ruleForm.openCode"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="关闭编号：" v-if="ruleForm.resultType==1" prop="closeCode">-->
                <!--                    <el-input size="small" v-model="ruleForm.closeCode"></el-input>-->
                <!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="equipmentCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="equipmentSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "equipmentLifeDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {},
                //表格数据
                tableData: [],
                pageNum: 1,
                pageSize: 5,
                total: 0,
                //新增/编辑数据
                ruleForm: {
                    reverseEquipmentId: '',
                    operateOrderName: '',
                    operateOrderContent: '',
                    remark: '',
                    // resultType: '0',
                    responseOperateOrder: '',
                    operateOrderType: '1',
                    // startPos: 1,
                    // dataLength: 1,
                    // openCode: '',
                    // successCode: '',
                    // closeCode: '',
                    // failCode: '',
                },
                rules: {
                    operateOrderName: [
                        {required: true, message: '请输入指令名称', trigger: 'blur'},
                    ],
                    operateOrderContent: [
                        {required: true, message: '请输入指令内容', trigger: 'blur'}
                    ],
                    operateOrderType: [
                        {required: true, message: '请选择指令类型', trigger: 'change'}
                    ],
                    // startPos: [
                    //     {required: true, message: '请输入起始位', trigger: 'blur'}
                    // ],
                    // dataLength: [
                    //     {required: true, message: '请输入数据长度', trigger: 'blur'}
                    // ],
                    // openCode: [
                    //     {required: true, message: '请输入开启编号', trigger: 'blur'}
                    // ],
                    // closeCode: [
                    //     {required: true, message: '请输入关闭编号', trigger: 'blur'}
                    // ],
                    // successCode: [
                    //     {required: true, message: '请输入成功编号', trigger: 'blur'}
                    // ],
                    // failCode: [
                    //     {required: true, message: '请输入失败编号', trigger: 'blur'}
                    // ],
                },
                //新增/编辑title
                equipmentTitle: '',
                //新增/编辑弹窗显示
                equipmentVisible: false,
                loading: true,
                //当前选中得指令
                nowOperateOrderId: ''
            }
        },
        created() {
            this.$store.state.nowName = '控制设备详情';
            this.info = this.$store.state.equipmentData;
            this.ruleForm.reverseEquipmentId = this.$store.state.equipmentData.reverseEquipmentId;
            this.getTableData();
        },
        methods: {
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/operateOrder/getPageList',
                    method: 'post',
                    data: {
                        reverseEquipmentId: this.$store.state.equipmentData.reverseEquipmentId,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }
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
            //新增/编辑操作指令
            equipmentControl(type, row) {
                if (type === 'add') {
                    this.equipmentTitle = '新增操作指令';
                } else {
                    this.equipmentTitle = '编辑操作指令';
                    this.nowOperateOrderId = row.operateOrderId;
                    this.ruleForm.operateOrderName = row.operateOrderName;
                    this.ruleForm.operateOrderContent = row.operateOrderContent;
                    this.ruleForm.responseOperateOrder = row.responseOperateOrder;
                    this.ruleForm.operateOrderType = row.operateOrderType+'';
                    this.ruleForm.remark = row.remark;
                    // this.ruleForm.resultType = row.resultType;
                    // this.ruleForm.startPos = row.startPos;
                    // this.ruleForm.dataLength = row.dataLength;
                    // this.ruleForm.openCode = row.openCode;
                    // this.ruleForm.successCode = row.successCode;
                    // this.ruleForm.closeCode = row.closeCode;
                    // this.ruleForm.failCode = row.failCode;
                }
                this.equipmentVisible = true;
            },
            //删除操作指令
            equipmentDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/operateOrder/delOperateOrder',
                        method: 'post',
                        data: {
                            operateOrderId: row.operateOrderId,
                            reverseEquipmentId: this.$store.state.equipmentData.reverseEquipmentId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.loading = true;
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
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
            //指令执行
            equipmentDo(index, row) {
                this.$confirm('确认要执行吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/operateOrder/executeOperateOrder',
                        method: 'post',
                        data: {
                            operateOrderId: row.operateOrderId,
                            reverseEquipmentId: this.$store.state.equipmentData.reverseEquipmentId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.loading = true;
                            this.$message({
                                type: 'success',
                                message: '执行成功!'
                            });
                            this.getTableData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消执行'
                    });
                });

            },
            //新增/编辑取消
            equipmentCancel() {
                this.clear();
            },
            //新增/编辑确认
            equipmentSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {...this.ruleForm};
                        // if (data.resultType == '0') {
                        //     data.openCode = '';
                        //     data.closeCode = '';
                        // } else {
                        //     data.successCode = '';
                        //     data.failCode = '';
                        // }
                        if (this.equipmentTitle === '新增操作指令') {
                            //级联选择框数据是3层的
                            this.$axios({
                                url: this.$BaseUrl + '/operateOrder/addOperateOrder',
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
                            data.operateOrderId = this.nowOperateOrderId;
                            this.$axios({
                                url: this.$BaseUrl + '/operateOrder/updateOperateOrder',
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

                    }
                })
            },
            //新增/编辑弹窗右上角关闭
            equipmentHandleClose(done) {
                this.clear();
                done();
            },
            //新增/编辑数据清除
            clear() {
                //异步操作
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
                this.ruleForm.operateOrderName = '';
                this.ruleForm.operateOrderContent = '';
                this.ruleForm.remark = '';
                // this.ruleForm.resultType = '0';
                this.ruleForm.responseOperateOrder = '';
                this.ruleForm.operateOrderType = '1';
                // this.ruleForm.startPos = 1;
                // this.ruleForm.dataLength = 1;
                // this.ruleForm.openCode = '';
                // this.ruleForm.successCode = '';
                // this.ruleForm.closeCode = '';
                // this.ruleForm.failCode = '';
                this.equipmentVisible = false;
            },
            //返回上一页
            goBack() {
                this.$router.push('/equipmentManagement/equipmentControl');
            }
        },

    }
</script>

<style scoped>
    /*步骤条样式*/
    .steps {
        margin-top: 30px;
        width: 100%;
    }

    /*小标题样式*/
    .title {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0;
    }

    /*基本信息*/
    .info {
        font-size: 15px;
        color: rgb(49, 49, 51);
    }

    /*基本信息每行样式*/
    .rowStyle {
        margin: 15px 0;
    }

    /*详细内容样式*/
    .info-content {
        color: #666;
    }

    /*底部button样式*/
    .button {
        width: 100%;
        margin-top: 120px;
        text-align: center;
    }
    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }
</style>

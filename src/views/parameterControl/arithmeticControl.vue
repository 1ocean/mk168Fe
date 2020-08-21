<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="90px">
            <el-row :gutter="80">
                <el-col :span="6">
                    <el-form-item label="算法名称：">
                        <el-input v-model="searchArea.algorithmName" size="small" placeholder="请输入算法名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="算法编号：">
                        <el-input v-model="searchArea.algorithmCode" size="small" placeholder="请输入算法编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item style="width: 100% !important">
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='algorithm:add')!=-1"
                                   @click="arithmeticControl('add')">新增算法
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
                        prop="algorithmName"
                        label="算法名称"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="algorithmCode"
                        label="算法编号"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="constantCount"
                        label="常量个数"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="variableCount"
                        label="变量个数"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="算法文件"
                        min-width="380"
                        >
                    <template slot-scope="scope">

                        <a :href="$url+scope.row.algorithmFile" download>{{scope.row.fileAddress}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='algorithm:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='algorithm:del')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='algorithm:update')!=-1"
                                @click="arithmeticControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='algorithm:del')!=-1"
                                @click="arithmeticDelete(scope.$index, scope.row)">删除
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
                :title="arithmeticTitle"
                :visible.sync="arithmeticVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="arithmeticHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item  label="算法编号：" prop="algorithmCode">
                    <el-input size="small" v-model="ruleForm.algorithmCode" :disabled="ruleFormEdit"></el-input>
                </el-form-item>
                <el-form-item label="算法名称：" prop="algorithmName">
                    <el-input size="small" v-model="ruleForm.algorithmName"></el-input>
                </el-form-item>
                <el-form-item label="常量个数：" prop="constantCount">
                    <el-input-number size="small" v-model="ruleForm.constantCount" controls-position="right" :disabled="ruleFormEdit" :min="0" :max="100"
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="变量个数：" prop="variableCount">
                    <el-input-number size="small" v-model="ruleForm.variableCount" controls-position="right" :disabled="ruleFormEdit" :min="0" :max="100"
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="原算法文件：" v-if="arithmeticTitle=='编辑算法'&&ruleForm.fileAddress!=null">
                    <el-input size="small" v-model="ruleForm.fileAddress" disabled></el-input>
                </el-form-item>
                <el-form-item label="算法文件："
                              prop="algorithmFile">
                    <el-upload
                            class="upload-demo"
                            action="#"
                            :http-request="jsSubmit"
                            :on-preview="jsHandlePreview"
                            :on-remove="jsHandleRemove"
                            :before-remove="jsBeforeRemove"
                            :before-upload="jsBeforeAvatarUpload"
                            multiple
                            :limit="1"
                            :on-exceed="jsHandleExceed"
                            :file-list="ruleForm.jsFileList">
                        <el-button size="small">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传JS文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="arithmeticCancel()">取 消</el-button>
                    <el-button type="primary" @click="arithmeticSure('ruleForm')">确 定</el-button>
                     </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "arithmeticControl",
        data() {
            return {
                //搜索区域
                searchArea: {
                    pageNum: 1,
                    pageSize: 8,
                    algorithmName: '',
                    algorithmCode: ''
                },
                //表格数据
                tableData: [],
                //表格loading
                loading: true,
                //表格总数
                total: 0,
                //新增/编辑算法title
                arithmeticTitle: '',
                //新增/编辑算法弹窗显示
                arithmeticVisible: false,
                //新增/编辑算法数据
                ruleForm: {
                    algorithmName: '',
                    algorithmCode: '',
                    constantCount: '',
                    variableCount: '',
                    algorithmFile: '',
                    jsFileList: [],
                },
                //控制编辑时不可再次编辑
                ruleFormEdit:false,
                //新增/编辑算法 数据规则
                rules: {
                    algorithmName: [
                        {required: true, message: '请输入算法名称', trigger: 'blur'},
                    ],
                    algorithmCode: [
                        {required: true, message: '请输入算法编号', trigger: 'blur'}
                    ],
                    constantCount: [
                        {required: true, message: '请输入变量个数', trigger: 'blur'}
                    ],
                    variableCount: [
                        {required: true, message: '请输入常量个数', trigger: 'blur'}
                    ],
                    algorithmFile: [
                        {required: true, message: '请提交JS文件', trigger: 'change'}
                    ],
                },
                //用来判断文件是否已经上传过
                jsControl: false,
                //当前选中算法得id
                algorithmId:''
            }
        },
        created() {
            this.$store.state.nowName='算法管理';
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
                    url: this.$BaseUrl + '/algorithm/getPageList',
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
                                this.tableData[i].fileAddress = this.tableData[i].algorithmFile.substring(this.tableData[i].algorithmFile.lastIndexOf("/") + 1);
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
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.searchArea.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //新增/编辑算法点击
            arithmeticControl(type, row) {
                if (type === 'add') {
                    this.arithmeticTitle = '新增算法';
                    this.ruleForm.algorithmCode=this.$round.random('AL');
                } else {
                    this.arithmeticTitle = '编辑算法';
                    this.ruleFormEdit=true;
                    this.ruleForm.algorithmName = row.algorithmName;
                    this.ruleForm.algorithmCode = row.algorithmCode;
                    this.ruleForm.fileAddress = row.fileAddress;
                    this.ruleForm.constantCount = row.constantCount;
                    this.ruleForm.variableCount = row.variableCount;
                    this.ruleForm.algorithmFile = row.algorithmFile;
                    this.algorithmId = row.algorithmId;
                }
                this.arithmeticVisible = true;
            },
            //新增/编辑算法弹窗右上角关闭
            arithmeticHandleClose(done) {
                this.clear();
                done();
            },
            //js文件上传
            jsSubmit(content) {
                this.ruleForm.algorithmFile = content.file;
                this.jsControl = true;
            },
            //传感器删除协议文件
            jsHandleRemove(file, fileList) {
                this.ruleForm.algorithmFile = '';
                this.jsControl = false;
            },
            //传感器上传完成
            jsHandlePreview(file) {
            },
            //传感器验证一次是否只是选一个
            jsHandleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            //传感器移除之前
            jsBeforeRemove(file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //传感器上传之前检查格式
            jsBeforeAvatarUpload(file) {
                const isJs = file.type === 'text/javascript';
                if (!isJs) {
                    this.$message.error('上传文件只能是 JS 格式!');
                }
                return isJs;
            },
            clear() {
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);
                this.ruleForm.algorithmName = '';
                this.ruleForm.algorithmCode = '';
                this.ruleForm.constantCount = '';
                this.ruleForm.variableCount = '';
                this.ruleForm.fileAddress = '';
                this.ruleForm.jsFileList = [];
                this.ruleForm.algorithmFile = '';
                this.jsControl = false;
                this.ruleFormEdit = false;
                this.arithmeticVisible = false;

            },
            //新增/编辑算法取消
            arithmeticCancel() {
                this.clear();
            },
            //新增//编辑算法确认
            arithmeticSure(formName) {
                this.$refs[formName].validate((valid) => {
                    let url,msg;
                        let fromData = new FormData();
                        fromData.set('algorithmName', this.ruleForm.algorithmName);
                        fromData.set('algorithmCode', this.ruleForm.algorithmCode);
                        fromData.set('constantCount', this.ruleForm.constantCount);
                        fromData.set('variableCount', this.ruleForm.variableCount);
                        if (this.arithmeticTitle == '新增算法') {
                            fromData.set('algorithmFile', this.ruleForm.algorithmFile);
                            url=this.$BaseUrl + '/algorithm/addAlgorithm';
                            msg='新增成功';

                        }else {
                            fromData.set('algorithmId', this.algorithmId);
                            url=this.$BaseUrl + '/algorithm/updateAlgorithm';
                            msg='编辑成功';
                        }
                        if (this.jsControl && this.arithmeticTitle == '编辑算法') {
                            fromData.set('algorithmFile', this.ruleForm.algorithmFile);
                        }
                        if (valid) {
                            this.$axios({
                                url: url,
                                method: 'post',
                                data: fromData
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
            arithmeticDelete(index,row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl+'/algorithm/delAlgorithm',
                        method: 'post',
                        data: {
                            algorithmId:row.algorithmId
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


    /*表格class*/
    .roleTable {
        /*height: 70%;*/
    }
</style>

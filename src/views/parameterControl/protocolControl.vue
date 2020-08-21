<template>
    <div class="content-wrapper" v-cloak>
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="90px">
            <el-row :gutter="80">
                <el-col :span="7">
                    <el-form-item label="协议名称：">
                        <el-input size="small" v-model="searchArea.agreementName"  placeholder="请输入协议名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="协议类型：">
                        <el-select size="small" v-model="searchArea.agreementType"  clearable placeholder="请选择">
                            <el-option label="网关协议" value="0"></el-option>
                            <el-option label="传感器协议" value="1"></el-option>
                            <el-option label="控制设备协议" value="2"></el-option>
                            <el-option label="开关量传感器协议" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="120">
                <el-col :span="7">
                    <el-form-item label="协议编号：">
                        <el-input size="small" v-model="searchArea.agreementCode"  placeholder="请输入协议编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='agreement:add')!=-1"
                                   @click="protocolControl('add')">新增协议
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="protocolTable">
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
                        prop="agreementCode"
                        label="协议编号"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        prop="agreementName"
                        label="协议名称"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        label="协议类型"
                        width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.agreementType==0">网关协议</span>
                        <span v-else-if="scope.row.agreementType==1">传感器协议</span>
                        <span v-else-if="scope.row.agreementType==2">控制设备协议</span>
                        <span v-else-if="scope.row.agreementType==3">开关量传感器协议
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="brand"
                        label="品牌"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="model"
                        label="型号"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        prop="measureNum"
                        label="测值数量"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="协议文件"
                        min-width="380">
                    <template slot-scope="scope">

                        <a :href="$url+scope.row.agreementFile" download>{{scope.row.fileAddress}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='agreement:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='agreement:del')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='agreement:update')!=-1"
                                @click="protocolControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='agreement:del')!=-1"
                                @click="protocolDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button
                                v-if="scope.row.agreementType==1"
                                size="mini"
                                type="primary"
                                round
                                plain
                                @click="check(scope.$index, scope.row)">查看测值
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
                :title="protocolTitle"
                :visible.sync="protocolVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="protocolHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="协议名称：" prop="agreementName">
                    <el-input size="small" v-model="ruleForm.agreementName"></el-input>
                </el-form-item>
                <el-form-item label="协议编号：" prop="agreementCode">
                    <el-input size="small" v-model="ruleForm.agreementCode" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="协议类型：" prop="agreementType" >
                    <el-select size="small" v-model="ruleForm.agreementType"  :disabled="edit" clearable placeholder="请选择">
                        <el-option label="网关协议" value="0"></el-option>
                        <el-option label="传感器协议" value="1"></el-option>
                        <el-option label="控制设备协议" value="2"></el-option>
                        <el-option label="开关量传感器协议" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌：" >
                    <el-input size="small" v-model="ruleForm.brand"></el-input>
                </el-form-item>
                <el-form-item label="型号：" >
                    <el-input size="small" v-model="ruleForm.model"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.agreementType==1" label="测值：">
                    <div class="flex-between" v-for="(domain, index) in ruleForm.agreementMeasureList"
                         :key="index">
                        <div>{{index+1}}</div>
                        <div style="width: 45%">名称：
                            <el-input size="small" style="width: 74.5%" :disabled="edit"
                                      v-model="domain.agreementMeasureName"></el-input>
                        </div>
                        <div style="width: 45%">编号：
                            <el-input size="small" style="width: 74.5%" :disabled="edit"
                                      v-model="domain.agreementMeasureCode"></el-input>
                        </div>
                        <i v-if="ruleForm.agreementMeasureList.length>1&&!edit" class="el-icon-remove"
                           style="cursor: pointer;color: crimson;font-size: 22px;"
                           @click="removeDomain(domain)"></i>
                    </div>
                    <i class="el-icon-circle-plus" v-if="!edit" style="cursor: pointer;color: #409EFF;font-size: 22px;"
                       @click="addDomain"></i>
                </el-form-item>
                <el-form-item v-if="ruleForm.agreementType!=''&&ruleForm.agreementType==0" label="协议文件："
                              prop="jarFileListAddress">
                    <el-upload
                            class="upload-demo"
                            action="#"
                            :http-request="jarSubmit"
                            :on-preview="jarHandlePreview"
                            :on-remove="jarHandleRemove"
                            :before-remove="jarBeforeRemove"
                            :before-upload="jarBeforeAvatarUpload"
                            multiple
                            :limit="1"
                            :on-exceed="jarHandleExceed"
                            :file-list="ruleForm.jarFileList">
                        <el-button size="small">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传JAR文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item v-if="ruleForm.agreementType!=''&&ruleForm.agreementType!=0" label="协议文件："
                              prop="jsFileListAddress">
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
                <el-button @click="protocolCancel('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="protocolSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                :title="'查看测值'"
                :visible.sync="checkVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="checkHandleClose">
            <el-form :model="checkForm"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="协议名称：" prop="agreementName">
                    <div>{{checkForm.agreementName}}</div>
                    <!--                    <el-input v-model="checkForm.agreementName" :disabled="disabled"></el-input>-->
                </el-form-item>
                <el-form-item label="协议编号：" prop="agreementCode">
                    <div>{{checkForm.agreementCode}}</div>
                    <!--                    <el-input v-model="checkForm.agreementCode" :disabled="disabled"></el-input>-->
                </el-form-item>
                <el-form-item label="测值：">
                    <div class="flex-between" v-for="(domain, index) in checkForm.agreementMeasureList"
                         :key="index">
                        <div>{{index+1}}</div>
                        <div style="width: 45%">名称：
                            <el-input size="small" style="width: 74.5%" disabled="disabled"
                                      v-model="domain.agreementMeasureName"></el-input>
                        </div>
                        <div style="width: 45%">编号：
                            <el-input size="small" style="width: 74.5%" disabled="disabled"
                                      v-model="domain.agreementMeasureCode"></el-input>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible=false">取 消</el-button>
                <el-button type="primary" @click="checkVisible=false">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "protocolControl",
        data() {
            return {
                //搜索区域
                searchArea: {
                    agreementName: '',
                    agreementType: '',
                    agreementCode: '',
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
                protocolVisible: false,
                //新增编辑协议title
                protocolTitle: '',
                //新增/编辑协议 弹窗内数据
                ruleForm: {
                    agreementName: '',
                    agreementCode: '',
                    agreementType: '',
                    brand: '',
                    model: '',
                    //传感器上传文件
                    jsFileList: [],
                    //传感器上传文件
                    jarFileList: [],
                    agreementMeasureList: [
                        {
                            agreementMeasureName: '',
                            agreementMeasureCode: ''
                        }
                    ],
                    //用来存传感器文件上传返回的地址
                    jsFileListAddress: '',
                    //用来存传网关文件上传返回的地址
                    jarFileListAddress: '',
                },
                //新增/编辑协议 数据规则
                rules: {
                    agreementName: [
                        {required: true, message: '请输入协议名称', trigger: 'blur'},
                    ],
                    agreementCode: [
                        {required: true, message: '请输入协议编号', trigger: 'blur'}
                    ],
                    agreementType: [
                        {required: true, message: '请选择协议类型', trigger: 'change'}
                    ],
                    jsFileListAddress: [
                        {required: true, message: '请提交JS文件', trigger: 'change'}
                    ],
                    jarFileListAddress: [
                        {required: true, message: '请提交JAR文件', trigger: 'change'}
                    ],
                },
                //查看测值数据
                checkForm:{
                    agreementName:'',
                    agreementCode:'',
                    agreementMeasureList:[]
                },
                //控制查看测值显示
                checkVisible:false,
                //控制编辑协议时不能编辑
                edit: false,
                //查看测值时不能编辑
                checkEdit: false,
                //编辑当前行的id
                agreementId:'',
                //用来判断用户有没有上传文件，因为编辑时如果没有重新上传文件不用发
                jsControl:false,
                jarControl:false,
            }
        },
        created() {
            this.$store.state.nowName='协议管理';
            this.loading = true;
            this.getTableData()
        },
        methods: {
            //传感器删除协议文件
            jsHandleRemove(file, fileList) {
                this.ruleForm.jsFileListAddress='';
                this.jsControl=false;
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
            //网关删除协议文件
            jarHandleRemove(file, fileList) {
                this.ruleForm.jarFileListAddress='';
                this.jarControl=false;
            },
            //网关上传完成
            jarHandlePreview(file) {
            },
            //网关验证一次是否只是选一个
            jarHandleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            //网关移除之前
            jarBeforeRemove(file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //网关上传之前检查格式
            jarBeforeAvatarUpload(file) {
                let type = file.name.substring(file.name.lastIndexOf(".") + 1);
                const isJar = type === 'jar';
                if (!isJar) {
                    this.$message.error('上传文件只能是 JAR 格式!');
                }
                return isJar;
            },
            //js文件上传
            jsSubmit(content) {
                let fromData = new FormData();
                fromData.set('agreementFile', content.file);
                this.$axios({
                    url: this.$BaseUrl + '/agreement/upload',
                    method: 'post',
                    data: fromData
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.ruleForm.jsFileListAddress = res.data.data;
                        this.jsControl=true;
                    }
                })
            },
            //jar文件上传
            jarSubmit(content) {
                let fromData = new FormData();
                fromData.set('agreementFile', content.file);
                this.$axios({
                    url: this.$BaseUrl + '/agreement/upload',
                    method: 'post',
                    data: fromData
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.ruleForm.jarFileListAddress = res.data.data;
                        this.jarControl=true;
                    }
                })
            },
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
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/agreement/getPageList',
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
                                this.tableData[i].fileAddress = this.tableData[i].agreementFile.substring(this.tableData[i].agreementFile.lastIndexOf("/") + 1);
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
            //新增/编辑协议
            protocolControl(type, row) {
                if (type === 'add') {
                    this.edit=false;
                    this.protocolTitle = '新增协议';
                    this.ruleForm.agreementCode=this.$round.random('A');
                } else {
                    this.protocolTitle = '编辑协议';
                    this.agreementId=row.agreementId;
                    this.edit=true;
                    this.ruleForm.agreementName=row.agreementName;
                    this.ruleForm.agreementCode=row.agreementCode;
                    this.ruleForm.agreementType=row.agreementType==1?'1':'0';
                    this.ruleForm.jsFileList=[];
                    this.ruleForm.jarFileList=[];
                    this.ruleForm.brand=row.brand;
                    this.ruleForm.model=row.model;
                    this.ruleForm.agreementMeasureList=[];
                    for (let i in row.agreementMeasureList ){
                        this.ruleForm.agreementMeasureList.push({agreementMeasureName:row.agreementMeasureList[i].agreementMeasureName,agreementMeasureCode:row.agreementMeasureList[i].agreementMeasureCode});
                    }
                    if (row.agreementType==0){
                        this.ruleForm.jarFileListAddress=row.agreementFile;
                    }else {
                        this.ruleForm.jsFileListAddress=row.agreementFile;
                    }
                }

                this.protocolVisible = true;
            },
            //删除协议
            protocolDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/agreement/delAgreement',
                        method: 'post',
                        data: {
                            agreementId: row.agreementId,
                            agreementType: row.agreementType
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除协议成功!'
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
            //查看测值
            check(index,row){
                this.checkForm.agreementMeasureList=[];
                for (let i in row.agreementMeasureList ){
                    this.checkForm.agreementMeasureList.push({agreementMeasureName:row.agreementMeasureList[i].agreementMeasureName,agreementMeasureCode:row.agreementMeasureList[i].agreementMeasureCode});
                }
                this.checkForm.agreementName=row.agreementName;
                this.checkForm.agreementCode=row.agreementCode;
                this.checkVisible=true;
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
            //删除测值
            removeDomain(item) {
                let index = this.ruleForm.agreementMeasureList.indexOf(item);
                if (index !== -1) {
                    this.ruleForm.agreementMeasureList.splice(index, 1)
                }
            },
            //新增测值
            addDomain() {
                this.ruleForm.agreementMeasureList.push({
                    agreementMeasureName: '',
                    agreementMeasureCode: ''
                });
            },
            //新增/编辑协议弹窗右上角关闭
            protocolHandleClose(done) {
                this.clear();
                done();
            },
            //查看测值右上角关闭
            checkHandleClose(done){
                this.checkForm.agreementName='';
                this.checkForm.agreementCode='';
                this.checkForm.agreementMeasureList=[];
                done();
            },
            //新增/编辑协议弹窗数据清除
            clear() {

                this.ruleForm.agreementName = "";
                this.ruleForm.agreementCode = "";
                this.ruleForm.agreementType = "";
                this.ruleForm.brand = "";
                this.ruleForm.model = "";
                this.ruleForm.jsFileList = [];
                this.ruleForm.jarFileList = [];
                this.ruleForm.agreementMeasureList = [
                    {
                        agreementMeasureName: '',
                        agreementMeasureCode: ''
                    }
                ];
                this.ruleForm.jarFileListAddress = '';
                this.ruleForm.jsFileListAddress = '';
                this.jsControl = false;
                this.jarControl = false;
                this.protocolVisible = false;
                //异步操作
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);
            },
            //新增/编辑协议弹窗取消
            protocolCancel() {
                this.clear();
            },
            //新增/编辑协议弹窗确定
            protocolSure(formName) {
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if (this.protocolTitle === '新增协议') {
                                let data = {...this.ruleForm};
                                delete data.jsFileList;
                                delete data.jarFileList;
                                delete data.jarFileListAddress;
                                delete data.jsFileListAddress;
                                if (this.ruleForm.agreementType == 0) {
                                    data.agreementMeasureList = [];
                                    data.agreementFile = this.ruleForm.jarFileListAddress;
                                } else if (this.ruleForm.agreementType == 1)  {
                                    data.agreementFile = this.ruleForm.jsFileListAddress;
                                    for (let i in data.agreementMeasureList) {
                                        let a = parseInt(i) + 1;

                                        if (data.agreementMeasureList[i].agreementMeasureName == '') {
                                            this.$message.error('请输入第' + a + '行测值名称！');
                                            return;
                                        } else if (data.agreementMeasureList[i].agreementMeasureCode == '') {
                                            this.$message.error('请输入第' + a + '行测值编号！');
                                            return;
                                        }
                                    }
                                }else {
                                    data.agreementFile = this.ruleForm.jsFileListAddress;
                                }
                                this.$axios({
                                    url: this.$BaseUrl + '/agreement/addAgreement',
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
                                let data = {...this.ruleForm};
                                delete data.jsFileList;
                                delete data.jarFileList;
                                delete data.jarFileListAddress;
                                delete data.jsFileListAddress;
                                if (this.ruleForm.agreementType == 0) {
                                    data.agreementMeasureList = [];
                                    data.agreementFile = this.ruleForm.jarFileListAddress;
                                } else {
                                    data.agreementFile = this.ruleForm.jsFileListAddress;
                                }
                                //后台要求没有重新上传得时候不要再发这个属性
                                if (!this.jsControl&&!this.jarControl){
                                    delete data.agreementFile;
                                }
                                data.agreementId=this.agreementId;
                                this.$axios({
                                    url: this.$BaseUrl + '/agreement/updateAgreement',
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
    .protocolTable {
        /*height: 63%;*/
        overflow: auto;
    }
</style>

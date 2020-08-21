<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="160px">
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="所属项目/现场/网关：">
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
                    <el-form-item label="设备名称：">
                        <el-input v-model="searchArea.reverseEquipmentName" size="small" placeholder="请输入设备名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="设备编号：">
                        <el-input v-model="searchArea.reverseEquipmentCode" size="small" placeholder="请输入设备编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="设备类型：">
                        <el-input v-model="searchArea.reverseEquipmentType" size="small" placeholder="请输入设备类型"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='reverseEquipment:add')!=-1"
                                   @click="equipmentControl('add')">新增设备
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="equipmentTable">
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
                        label="设备图片"
                        width="140">
                    <template slot-scope="scope">
                        <img :src="$url+scope.row.reverseEquipmentImg" alt="" width="65" height="65">
                    </template>
                </el-table-column>
                <el-table-column
                        label="设备编号"
                        width="140">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.reverseEquipmentCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="reverseEquipmentName"
                        label="设备名称"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="projectName"
                        label="所属项目"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="structureName"
                        label="所属现场"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="gatewayName"
                        label="所属网关"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="reverseEquipmentType"
                        label="设备类型"
                        width="140">
                </el-table-column>
                <el-table-column
                        label="设备状态"
                        width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.reverseEquipmentState==1"><span
                                style="color: rgb(0,168,84)">●</span> 开启</span>
                        <span v-else-if="scope.row.reverseEquipmentState==0"><span
                                style="color: rgb(240,65,52)">●</span> 关闭</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="说明"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:execute')!=-1"
                        label="远程控制" width="110" fixed="right">
                    <template slot-scope="scope">
                        <el-switch
                                style="margin-left: 8px"
                                :disabled='true'
                                @click.native="stateChange(scope)"
                                v-model="scope.row.reverseEquipmentValue"
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='operateOrder:execute')!=-1"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='reverseEquipment:update')!=-1||
                $store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='reverseEquipment:del')!=-1"
                                 label="操作" width="160" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='reverseEquipment:update')!=-1"
                                @click="equipmentControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='reverseEquipment:del')!=-1"
                                @click="equipmentDelete(scope.$index, scope.row)">删除
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
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="searchArea.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog
                :title="equipmentTitle"
                :close-on-click-modal="false"
                :visible.sync="equipmentVisible"
                width="500px"
                :before-close="equipmentHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="所属网关：" prop="gatewayId" v-show="equipmentTitle=='新增设备'">
                    <el-cascader
                            size="small"
                            v-model="ruleForm.gatewayId"
                            :props="gatewayProps"
                            @change="gatewayCascaderChange"
                            clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属网关：" v-show="equipmentTitle=='编辑设备'">
                    <el-input size="small" v-model="ruleForm.gatewayName" disabled></el-input>
                </el-form-item>
                <el-form-item label="设备名称：" prop="reverseEquipmentName">
                    <el-input size="small" v-model="ruleForm.reverseEquipmentName"></el-input>
                </el-form-item>
                <el-form-item label="设备编号：" prop="reverseEquipmentCode">
                    <el-input size="small" v-model="ruleForm.reverseEquipmentCode"></el-input>
                </el-form-item>
                <el-form-item label="设备类型：">
                    <el-input size="small" v-model="ruleForm.reverseEquipmentType"></el-input>
                </el-form-item>
                <el-form-item label="设备说明：">
                    <el-input size="small" v-model="ruleForm.remark" type="textarea"></el-input>
                </el-form-item>
                <el-form-item v-if="equipmentTitle==='编辑设备'" label="原设备图：">
                    <img :src="this.$url+ruleForm.reverseEquipmentImg" class="structureImg" alt="文件不存在" width="148px"
                         height="148px">
                </el-form-item>
                <el-form-item label="上传图片：">
                    <el-upload
                            class="avatar-uploader"
                            action="#"
                            :show-file-list="false"
                            :on-change="onChange"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
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
        name: "equipmentControl",
        data() {
            let that = this;
            return {
                //搜索区域
                searchArea: {
                    pageNum: 1,
                    pageSize: 5,
                    reverseEquipmentName: '',
                    reverseEquipmentCode: '',
                    reverseEquipmentType: '',
                    psId: [],
                },
                //表格loading
                loading: true,
                //表格数据
                tableData: [],
                //表格总数
                total: 0,
                //新增弹窗级联选择框gateway所有的数据
                gatewayData: [],
                //搜索级联数据
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
                            } else {
                                that.$axios({
                                    url: that.$BaseUrl + '/gateway/getGatewayListByStructureId',
                                    method: 'post',
                                    data: {
                                        structureId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].gatewayName,
                                            value: data[i].gatewayId,
                                            leaf: level >= 2
                                        })
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },
                //弹窗级联数据
                gatewayProps: {
                    //点击加载
                    lazy: true,
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
                            } else {
                                that.$axios({
                                    url: that.$BaseUrl + '/gateway/getGatewayListByStructureId',
                                    method: 'post',
                                    data: {
                                        structureId: node.value
                                    }
                                }).then(res => {
                                    let nodes = [];
                                    let data = res.data.data;
                                    for (let i in data) {
                                        nodes.push({
                                            label: data[i].gatewayName,
                                            value: data[i].gatewayId,
                                            leaf: level >= 2
                                        });
                                        that.gatewayData.push({
                                            label: data[i].gatewayName,
                                            value: data[i].gatewayId,
                                            collectType: data[i].collectType,
                                        });
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },

                //新增/编辑数据
                ruleForm: {
                    gatewayId: '',
                    reverseEquipmentName: '',
                    reverseEquipmentCode: '',
                    reverseEquipmentType: '',
                    gatewayName: '',
                    remark: '',
                    reverseEquipmentImg: '',
                },
                rules: {
                    gatewayId: [
                        {required: true, message: '请选择所属网关', trigger: 'change'},
                    ],
                    reverseEquipmentName: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'}
                    ],
                    reverseEquipmentCode: [
                        {required: true, message: '请输入设备编号', trigger: 'blur'}
                    ],
                },
                //新增/编辑title
                equipmentTitle: '',
                //新增/编辑弹窗显示
                equipmentVisible: false,
                //用来展示选取图片的地址
                imageUrl: '',
                //存储文件内容
                imgFile: [],
                //控制测值是否可以编辑
                disabled: false,
                //所属网关数据
                gatewayOptions: [],
                //当前编辑的设备Id
                nowEquipmentId: '',
            }
        },
        created() {
            this.$store.state.nowName = '控制设备管理';
            this.getTableData()
        },
        methods: {
            //获取表格数据
            getTableData() {
                let data = {...this.searchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.searchArea.psId.length === 1) {
                    data.projectId = this.searchArea.psId[0]
                } else if (this.searchArea.psId.length === 2) {
                    data.structureId = this.searchArea.psId[1];
                } else if (this.searchArea.psId.length === 3) {
                    data.gatewayId = this.searchArea.psId[2];
                }
                this.$axios({
                    url: this.$BaseUrl + '/reverseEquipment/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if (res.data.data != null) {
                            this.tableData = res.data.data.list;
                            for (let i in this.tableData){
                                this.tableData[i].reverseEquipmentValue = this.tableData[i].reverseEquipmentState == 1;
                            }
                            console.log(this.tableData)
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
            //新增/编辑设备
            equipmentControl(type, row) {
                if (type === 'add') {
                    this.equipmentTitle = '新增设备';
                    this.ruleForm.reverseEquipmentCode = this.$round.random('RE');
                } else {
                    this.equipmentTitle = '编辑设备';
                    this.nowEquipmentId = row.reverseEquipmentId;
                    this.ruleForm.gatewayId = row.gatewayId;
                    this.ruleForm.reverseEquipmentImg = row.reverseEquipmentImg;
                    this.ruleForm.reverseEquipmentName = row.reverseEquipmentName;
                    this.ruleForm.reverseEquipmentCode = row.reverseEquipmentCode;
                    this.ruleForm.reverseEquipmentType = row.reverseEquipmentType;
                    this.ruleForm.gatewayName = row.gatewayName;
                    this.ruleForm.remark = row.remark;
                }
                this.equipmentVisible = true;
            },
            //删除设备
            equipmentDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/reverseEquipment/delReverseEquipment',
                        method: 'post',
                        data: {
                            reverseEquipmentId: row.reverseEquipmentId
                        }
                    }).then(() => {
                        this.loading = true;
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTableData();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            //重置搜索区域
            reset() {
                this.searchArea.reverseEquipmentName = '';
                this.searchArea.reverseEquipmentCode = '';
                this.searchArea.reverseEquipmentType = '';
                this.searchArea.psId = [];
            },
            //搜索
            onSubmit() {
                this.loading = true;
                this.searchArea.pageNum = 1;
                this.getTableData()
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
            //新增/编辑数据清除
            clear() {
                //异步操作
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
                this.ruleForm.gatewayId = '';
                this.ruleForm.reverseEquipmentName = '';
                this.ruleForm.reverseEquipmentCode = '';
                this.ruleForm.reverseEquipmentType = '';
                this.ruleForm.gatewayName = '';
                this.ruleForm.remark = '';
                this.ruleForm.reverseEquipmentImg = '';
                this.equipmentVisible = false;
                this.imageUrl = '';
                this.imgFile = [];
            },
            //新增/编辑弹窗右上角关闭
            equipmentHandleClose(done) {
                this.clear();
                done();
            },
            //点击上传图片后
            onChange(file, fileList) {
                this.imgFile = file.raw;
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //提交图片提交之前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //新增/编辑取消
            equipmentCancel() {
                this.clear();
            },
            //新增/编辑确认
            equipmentSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.set('reverseEquipmentName', this.ruleForm.reverseEquipmentName);
                        formData.set('reverseEquipmentCode', this.ruleForm.reverseEquipmentCode);
                        formData.set('reverseEquipmentType', this.ruleForm.reverseEquipmentType);
                        formData.set('remark', this.ruleForm.remark);
                        formData.set('reverseEquipmentImg', this.imgFile);
                        if (this.equipmentTitle === '新增设备') {
                            //级联选择框数据是3层的
                            formData.set('gatewayId', this.ruleForm.gatewayId[2]);

                            this.$axios({
                                url: this.$BaseUrl + '/reverseEquipment/addReverseEquipment',
                                method: 'post',
                                data: formData
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
                            formData.set('gatewayId', this.ruleForm.gatewayId);
                            formData.set('reverseEquipmentId', this.nowEquipmentId);

                            this.$axios({
                                url: this.$BaseUrl + '/reverseEquipment/updateReverseEquipment',
                                method: 'post',
                                data: formData
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
            //新增弹窗网关级联选择 数据变化
            gatewayCascaderChange(val) {
                for (let i in this.gatewayData) {
                    if (val[2] == this.gatewayData[i].value) {
                        this.gatewayData[i].collectType == 0 ? this.pollAgreementShow = true : this.pollAgreementShow = false;
                    }
                }
            },
            //去设备详情
            goDetail(row) {
                this.$router.push({name: 'equipmentDetail'});
                this.$store.state.equipmentData = row;
            },
            //远程控制点击
            stateChange(scope) {
                let msg=scope.row.reverseEquipmentState==0?'启动':'关闭';
                this.$confirm('确认'+msg+'吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data={
                        reverseEquipmentId:scope.row.reverseEquipmentId,
                        type:scope.row.reverseEquipmentState==0?1:0
                    };
                    this.$axios({
                        url: this.$BaseUrl + '/reverseEquipment/onOff',
                        method: 'post',
                        data: data
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                message: '执行成功!',
                                type: 'success'
                            });
                            this.tableData[scope.$index].reverseEquipmentState=this.tableData[scope.$index].reverseEquipmentState==0?1:0
                            this.tableData[scope.$index].reverseEquipmentValue=this.tableData[scope.$index].reverseEquipmentValue==false?true:false
                        }
                    })
                }).catch(() => {
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
        width: 48% !important;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }

    /*上传图片样式*/
    .content-wrapper >>> .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    /*上传图片样式*/
    .content-wrapper >>> .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    /*上传图片样式*/
    .content-wrapper >>> .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    /*上传图片样式*/
    .content-wrapper >>> .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

    /*测值样式*/
    .content-wrapper >>> .el-input-number.is-controls-right .el-input__inner {
        padding-right: 30px;
        padding-left: 10px;
    }

    /*测值样式*/
    .content-wrapper >>> .el-input-number.is-controls-right .el-input-number__decrease {
        width: 30px;
    }

    /*测值样式*/
    .content-wrapper >>> .el-input-number.is-controls-right .el-input-number__increase {
        width: 30px;
    }

    .equipmentTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }

    /*switch禁用后样式修改*/
    >>>.el-switch.is-disabled .el-switch__core,
    .el-switch.is-disabled .el-switch__label {
        cursor: pointer;
    }
</style>

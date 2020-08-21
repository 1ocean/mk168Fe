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
                    <el-form-item label="传感器名称：">
                        <el-input v-model="searchArea.sensorName" size="small" placeholder="请输入传感器名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="传感器编号：">
                        <el-input v-model="searchArea.sensorCode" size="small" placeholder="请输入传感器编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="传感器类型：">
                        <el-input v-model="searchArea.sensorType" size="small" placeholder="请输入传感器类型"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:add')!=-1"
                                   @click="sensorControl('add')">新增传感器
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="sensorTable">
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
                        label="传感器图片"
                        width="140">
                    <template slot-scope="scope">
                        <img :src="$url+scope.row.sensorImg" alt="" width="65" height="65">
                    </template>
                </el-table-column>
                <el-table-column
                        label="传感器编号"
                        width="140">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.sensorCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sensorName"
                        label="传感器名称"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="gatewayName"
                        label="所属网关"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="sensorType"
                        label="传感器类型"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="sensorAgreementName"
                        label="传感器协议"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        prop="getDataTime"
                        label="最新数据采集时间"
                        min-width="180"
                >
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:del')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:update')!=-1"
                                @click="sensorControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:del')!=-1"
                                @click="sensorDelete(scope.$index, scope.row)">删除
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
                :title="sensorTitle"
                :visible.sync="sensorVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="sensorHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="所属网关：" prop="gatewayId" v-show="sensorTitle=='新增传感器'">
                    <el-cascader
                            size="small"
                            v-model="ruleForm.gatewayId"
                            :props="gatewayProps"
                            @change="gatewayCascaderChange"
                            clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属网关：" v-show="sensorTitle=='编辑传感器'">
                    <el-input size="small" v-model="ruleForm.gatewayName" disabled></el-input>
                </el-form-item>
                <el-form-item label="传感器名称：" prop="sensorName">
                    <el-input size="small" v-model="ruleForm.sensorName"></el-input>
                </el-form-item>
                <el-form-item label="传感器编号：" prop="sensorCode">
                    <el-input size="small" v-model="ruleForm.sensorCode" :disabled="sensorEdit"></el-input>
                </el-form-item>
                <el-form-item label="地址码：" prop="addressByte">
                    <el-input size="small" v-model="ruleForm.addressByte"></el-input>
                </el-form-item>
                <el-form-item label="传感器类型：">
                    <el-input size="small" v-model="ruleForm.sensorType"></el-input>
                </el-form-item>
                <span class="tag" v-if="pollAgreementShow" style="left: 17px">*</span>
                <el-form-item style="margin-top: -30px" v-if="pollAgreementShow" label="轮询指令：">
                    <div class="flex-around" v-for="(domain, index) in ruleForm.pollAgreement"
                         :key="index">
                        <div>{{index+1}}</div>
                        <el-input size="small" style="width: 80%"
                                  v-model="ruleForm.pollAgreement[index]"></el-input>
                        <i v-if="ruleForm.pollAgreement.length>1" class="el-icon-remove"
                           style="cursor: pointer;color: crimson;font-size: 22px;"
                           @click="removeDomain(ruleForm.pollAgreement[index])"></i>
                    </div>
                    <i class="el-icon-circle-plus" style="cursor: pointer;color: #409EFF;font-size: 22px;"
                       @click="addDomain"></i>
                </el-form-item>
                <el-form-item label="传感器协议：" prop="sensorAgreementId">
                    <el-select v-model="ruleForm.sensorAgreementId" size="small" :disabled="sensorEdit"
                               @change="sensorAgreementIdChange" clearable
                               placeholder="请选择">
                        <el-option
                                v-for="item in sensorAgreementOptions"
                                :key="item.index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <span class="tag" v-if="ruleForm.sensorAgreementId!=''" style="left: 42px">*</span>
                <el-form-item style="margin-top: -30px" label="测值：" v-if="ruleForm.sensorAgreementId!=''">
                    <div class="flex-between" style="align-items: start" v-for="(domain, index) in ruleForm.sensorMeasureList"
                         :key="index">
                        <div>{{index+1}}：</div>
                        <div style="width: 32%">名称：
                            <el-input size="small" style="width: 74.5%"
                                      v-model="domain.sensorMeasureName" :disabled="sensorEdit"></el-input>
                        </div>
                        <div style="width: 32%">编号：
                            <el-input size="small" style="width: 74.5%"
                                      v-model="domain.sensorMeasureCode" :disabled="sensorEdit"></el-input>
                        </div>
                        <div style="width: 32%">是否危化池：
                            <el-select size="small" style="width: 74.5%" v-model="domain.isWastePool" :disabled="sensorEdit" placeholder="请选择类别">
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.remark" maxlength="255"></el-input>
                </el-form-item>
                <el-form-item v-if="sensorTitle==='编辑传感器'" label="原传感器图：">
                    <img :src="this.$url+ruleForm.oldSensorImg" class="structureImg" alt="文件不存在" width="148px"
                         height="148px">
                </el-form-item>
                <el-form-item label="上传图片：">
                    <el-upload
                            class="avatar-uploader"
                            action="#"
                            :show-file-list="false"
                            :http-request="picSubmit"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="sensorCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="sensorSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "sensorControl",
        data() {
            let that = this;
            return {
                //搜索区域
                searchArea: {
                    pageNum: 1,
                    pageSize: 5,
                    sensorName: '',
                    sensorCode: '',
                    sensorType: '',
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
                //控制轮询协议显示或者不显示
                pollAgreementShow: false,
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
                    sensorAgreementId: '',
                    sensorName: '',
                    sensorCode: '',
                    sensorType: '',
                    pollAgreement: [""],
                    gatewayName: '',
                    sensorImg: '',
                    addressByte: '',
                    remark: '',
                    sensorMeasureList: []
                },
                rules: {
                    gatewayId: [
                        {required: true, message: '请选择所属网关', trigger: 'change'},
                    ],
                    sensorName: [
                        {required: true, message: '请输入传感器名称', trigger: 'blur'}
                    ],
                    sensorCode: [
                        {required: true, message: '请输入传感器编号', trigger: 'blur'}
                    ],
                    sensorAgreementId: [
                        {required: true, message: '请选择传感器协议', trigger: 'change'}
                    ],
                    addressByte: [
                        {required: true, message: '请输入设备地址码', trigger: 'blur'}
                    ]
                },
                //新增/编辑title
                sensorTitle: '',
                //新增/编辑弹窗显示
                sensorVisible: false,
                //用来展示选取图片的地址
                imageUrl: '',
                //存储文件内容
                imgFile: [],
                //控制测值是否可以编辑
                disabled: false,
                //所属网关数据
                gatewayOptions: [],
                //传感器协议数据
                sensorAgreementOptions: [],
                //当前编辑的传感器Id
                nowSensorId: '',
                //用来存放新增或者编辑时再次发送后台需要的测值code
                agreementMeasureCode: [],

                //控制编辑时不可显示得字段
                sensorEdit: false
            }
        },
        created() {
            this.$store.state.nowName = '数据采集';
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
                    url: this.$BaseUrl + '/sensor/getPageList',
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
            //新增/编辑传感器
            sensorControl(type, row) {
                this.$axios({
                    url: this.$BaseUrl + '/agreement/getPageList',
                    method: 'post',
                    data: {
                        agreementType: '1'
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.sensorAgreementOptions = [];
                        for (let i in res.data.data.list) {
                            this.sensorAgreementOptions.push({
                                label: res.data.data.list[i].agreementName,
                                value: res.data.data.list[i].agreementId,
                                agreementMeasureList: res.data.data.list[i].agreementMeasureList,
                            })
                        }
                    }
                });
                if (type === 'add') {
                    this.sensorTitle = '新增传感器';
                    this.ruleForm.sensorCode = this.$round.random('S');
                } else {
                    this.sensorTitle = '编辑传感器';
                    this.sensorEdit = true;
                    this.nowSensorId = row.sensorId;
                    this.ruleForm.gatewayId = row.gatewayId;
                    this.ruleForm.sensorAgreementId = row.sensorAgreementId;
                    this.ruleForm.sensorName = row.sensorName;
                    this.ruleForm.sensorCode = row.sensorCode;
                    this.ruleForm.remark = row.remark;
                    this.ruleForm.sensorImg = row.sensorImg;
                    this.ruleForm.addressByte = row.addressByte;
                    this.ruleForm.oldSensorImg = row.sensorImg;
                    this.ruleForm.sensorType = row.sensorType;
                    this.ruleForm.gatewayName = row.gatewayName;
                    this.ruleForm.pollAgreement = JSON.parse(row.pollAgreement);
                    if (row.pollAgreement != null) {
                        this.pollAgreementShow = true
                    }
                    //通过id换取当前行的测值
                    this.$axios({
                        url: this.$BaseUrl + '/sensor/getMeasureListBySensorId',
                        method: 'post',
                        data: {
                            sensorId: row.sensorId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.ruleForm.sensorMeasureList = res.data.data;
                            for (let i in this.ruleForm.sensorMeasureList){
                                this.ruleForm.sensorMeasureList[i].isWastePool=this.ruleForm.sensorMeasureList[i].isWastePool+'';
                            }
                            //根据后台需求，需要将原本的测值名称，编号再次发送给后台
                            this.agreementMeasureCode = res.data.data;
                        }
                    });
                }
                this.sensorVisible = true;
            },
            //删除传感器
            sensorDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/sensor/delSensor',
                        method: 'post',
                        data: {
                            sensorId: row.sensorId,
                            sensorCode: row.sensorCode,
                            gatewayId: row.gatewayId,
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
            //重置搜索区域
            reset() {
                this.searchArea.sensorName = '';
                this.searchArea.sensorCode = '';
                this.searchArea.sensorType = '';
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
                this.ruleForm.sensorAgreementId = '';
                this.ruleForm.sensorName = '';
                this.ruleForm.sensorCode = '';
                this.ruleForm.sensorType = '';
                this.ruleForm.sensorImg = '';
                this.ruleForm.remark = '';
                this.ruleForm.pollAgreement = [""];
                this.ruleForm.gatewayName = '';
                this.ruleForm.sensorType = '';
                this.ruleForm.addressByte = '';
                this.ruleForm.sensorMeasureList = [];
                this.sensorVisible = false;
                this.imageUrl = '';
                this.imgFile = [];
                this.sensorEdit = false;
                //轮询协议初始隐藏
                this.pollAgreementShow = false;
            },
            //新增/编辑弹窗右上角关闭
            sensorHandleClose(done) {
                this.clear();
                done();
            },
            // //点击上传图片后
            // onChange(file, fileList) {
            //     if (this.isJPG){
            //         this.imgFile = fileList;
            //         this.imageUrl = URL.createObjectURL(file.raw);
            //     }
            // },
            //提交图片提交之前
            beforeAvatarUpload(file) {
                const isType = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isType) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isType && isLt2M;
            },
            //新增/编辑取消
            sensorCancel() {
                this.clear();
            },
            //新增/编辑确认
            sensorSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {...this.ruleForm};
                        let reghex = new RegExp("^[0-9A-F]+$");
                        if (reghex.exec(this.ruleForm.addressByte) == null) {
                            this.$message.error('请输入十六进制地址码');
                            this.ruleForm.addressByte = "";
                            return;
                        }
                        //是否是地图
                        data.sensorMeasureType=0;
                        //当选择的网关是被动时删除pollAgreement
                        if (!this.pollAgreementShow) {
                            delete data.pollAgreement;
                        } else {
                            for (let s in data.pollAgreement) {
                                let a = parseInt(s) + 1;
                                if (data.pollAgreement[s] == '') {
                                    this.$message.error('请输入第' + a + '行轮询协议！');
                                    return;
                                }
                            }
                            //转变成后台需要的格式
                            data.pollAgreement = JSON.stringify(data.pollAgreement)
                        }
                        //将原本的code重新放进去
                        for (let i in this.ruleForm.sensorMeasureList) {
                            data.sensorMeasureList[i].agreementMeasureCode = this.agreementMeasureCode[i].sensorMeasureCode;
                        }
                        //判断传感器协议是否选择
                        if (this.ruleForm.sensorAgreementId == '') {
                            data.sensorMeasureList = [];
                        } else {
                            for (let i in data.sensorMeasureList) {
                                let a = parseInt(i) + 1;
                                if (data.sensorMeasureList[i].sensorMeasureName == '') {
                                    this.$message.error('请输入第' + a + '行测值名称！');
                                    return;
                                } else if (data.sensorMeasureList[i].sensorMeasureCode == '') {
                                    this.$message.error('请输入第' + a + '行测值编号！');
                                    return;
                                } else if (data.sensorMeasureList[i].isWastePool == '') {
                                    this.$message.error('请选择第' + a + '行是否为危化池！');
                                    return;
                                }
                            }

                        }
                        if (this.sensorTitle === '新增传感器') {
                            //如果为空删除这个值
                            if (data.sensorImg == '') {
                                delete data.sensorImg
                            }
                            //级联选择框数据是3层的
                            data.gatewayId = this.ruleForm.gatewayId[2];
                            this.$axios({
                                url: this.$BaseUrl + '/sensor/addSensor',
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
                            data.sensorId = this.nowSensorId;
                            data.gatewayId = this.ruleForm.gatewayId;

                            this.$axios({
                                url: this.$BaseUrl + '/sensor/updateSensor',
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
            //新增弹窗网关级联选择 数据变化
            gatewayCascaderChange(val) {
                for (let i in this.gatewayData) {
                    if (val[2] == this.gatewayData[i].value) {
                        this.gatewayData[i].collectType == 0 ? this.pollAgreementShow = true : this.pollAgreementShow = false;
                    }
                }
            },
            //新增弹窗传感器协议数据变化
            sensorAgreementIdChange() {
                let array = [];
                //因为接口给的值名字是agreementMeasureName和agreementMeasureCode 修改成sensorMeasureName和sensorMeasureCode
                for (let i in this.sensorAgreementOptions) {
                    if (this.ruleForm.sensorAgreementId == this.sensorAgreementOptions[i].value) {
                        for (let s in this.sensorAgreementOptions[i].agreementMeasureList) {
                            array.push({
                                sensorMeasureName: this.sensorAgreementOptions[i].agreementMeasureList[s].agreementMeasureName,
                                sensorMeasureCode: this.sensorAgreementOptions[i].agreementMeasureList[s].agreementMeasureCode,
                                isWastePool: '0',
                            })
                        }
                        this.ruleForm.sensorMeasureList = array;
                        //将数据存放起来，新增时也需要用
                        this.agreementMeasureCode = array;
                    }
                }

            },
            //弹窗上传图片
            picSubmit(content) {
                let fromData = new FormData();
                fromData.set('sensorImg', content.file);
                this.$axios({
                    url: this.$BaseUrl + '/sensor/uploadSensorImg',
                    method: 'post',
                    data: fromData
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.ruleForm.sensorImg = res.data.data;
                        this.imageUrl = this.$url + res.data.data;
                    }
                })
            },
            //去传感器详情
            goDetail(row) {
                this.$router.push({name: 'sensorDetail'});
                this.$store.state.sensorData = row;
            },
            //删除轮询协议
            removeDomain(item) {
                let index = this.ruleForm.pollAgreement.indexOf(item);
                if (index !== -1) {
                    this.ruleForm.pollAgreement.splice(index, 1)
                }
            },
            //新增轮询协议
            addDomain() {
                this.ruleForm.pollAgreement.push('');
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

    .sensorTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }
</style>

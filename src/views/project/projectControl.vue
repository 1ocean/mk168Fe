<template>
    <div class="content-wrapper project" v-cloak>
        <el-button type="primary" size="small" :class="{newProject:true,visibility:$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='project:add')==-1}" @click="newProject"
        ><i class="el-icon-plus"></i> 新增项目</el-button>
        <el-tabs v-model="activeName" type="card"  @tab-click="tabsClick">
            <el-tab-pane
                    :key="index"
                    v-for="(item, index) in projectData"
                    :label="item.projectName"
                    :name="item.projectCode"
            >
                <div class="basicInfo">
                    项目信息
                </div>
                <div class="flex-between allInfo">
                    <div class="projectInfo">
                        <div>项目编号：</div>
                        <div class="projectInfo-text" :title="item.projectCode">
                            {{item.projectCode}}
                        </div>
                    </div>
<!--                    <div class="projectInfo">-->
<!--                        <div>项目负责人：</div>-->
<!--                        <div class="projectInfo-text" :title="item.principal">-->
<!--                            {{item.principal}}-->
<!--                        </div>-->
<!--                    </div>-->
                    <div class="projectInfo" :title="item.projectState==1?'运行中':'停止'">
                        <div>项目状态：</div>
                        <span v-if="item.projectState==1"><span style="color: rgb(0,168,84)">●</span> 运行中</span>
                        <span v-if="item.projectState==0"><span style="color: rgb(240,65,52)">●</span> 停止 </span>
                        <span v-if="item.projectState==2"><span style="color: rgb(240,65,52)">●</span> 异常 </span>
                        <div class="projectInfo-text">

                        </div>
                    </div>
                    <div class="projectInfo">
                        <div>项目描述：</div>
                        <div class="projectInfo-text" :title="item.remark">
                            {{item.remark}}
                        </div>
                    </div>
                    <el-popover
                            placement="bottom"
                            width="10"
                            trigger="hover">
<!--                        <div class="button-wrapper">-->
<!--                            <el-button type="text" class="button" size="mini" @click="overViewProject(index)">项目概览</el-button>-->
<!--                        </div>-->
                        <div class="button-wrapper">
                            <el-button type="text" class="button" size="mini" @click="editProject(index)"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='project:update')!=-1">
                                编辑项目
                            </el-button>
                        </div>
                        <div class="button-wrapper" v-if="item.projectState==1">
                            <el-button type="text" class="button" size="mini" @click="stopOrStartProject(index,'0')"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='project:doUse')!=-1"
                            >
                                停止项目
                            </el-button>
                        </div>
                        <div class="button-wrapper" v-else>
                            <el-button type="text" class="button" size="mini" @click="stopOrStartProject(index,'1')"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='project:doUse')!=-1"
                            >
                                启动项目
                            </el-button>
                        </div>
                        <div class="button-wrapper">
                            <el-button type="text" class="button" size="mini" @click="deleteProject(index)"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='project:del')!=-1"
                            >删除项目
                            </el-button>
                        </div>
                        <el-button size="small" type="primary" class="more" round slot="reference">更多操作 <i
                                class="el-icon-arrow-down"></i></el-button>
                    </el-popover>
                </div>
                <el-divider></el-divider>
                <div class="basicInfo">
                    现场列表
                </div>
                <el-row class="card-row" :gutter="25">
                    <el-col :span="6" v-for="(o, index2) in item.structureList" :key="index2" style="margin-top: 20px">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="$url+o.structureImg"
                                 class="image" @click="goDetail(o,index)">
                            <div style="padding: 8px;">
                                <div class="flex-between top">
                                    <div class="siteInfo" :title="o.structureCode">
                                        {{o.structureCode}}
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="siteInfo" :title="o.structureName">
                                        {{o.structureName}}
                                    </div>
                                </div>
                                <div class="flex-between bottom">
                                    <div class="icon-button" title="报警记录" @click="warnPlant(item.projectId,o.structureId)" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureWarn:list')!=-1">
                                        <i class="el-icon-bell icon-detail" ></i>
                                    </div>
                                    <el-divider direction="vertical" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureStatistic:list')!=-1"></el-divider>
                                    <div class="icon-button" title="统计分析" @click="measurePlant" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureStatistic:list')!=-1">
                                        <i class="el-icon-pie-chart icon-detail"></i>
                                    </div>
                                    <el-divider direction="vertical" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='realTimeData:list')!=-1"></el-divider>
                                    <div class="icon-button" title="实时数据" @click="realTimePlant" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='realTimeData:list')!=-1">
                                        <i class="el-icon-s-data icon-detail"></i>
                                    </div>
                                    <el-divider direction="vertical" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='structure:update')!=-1"></el-divider>
                                    <div class="icon-button" title="编辑" @click="editPlant(index,index2)" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='structure:update')!=-1">
                                        <i class="el-icon-edit-outline icon-detail" ></i>
                                    </div>
                                    <el-divider direction="vertical" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='structure:del')!=-1"></el-divider>
                                    <div class="icon-button" title="删除" @click="deletePlant(index,index2)" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='structure:del')!=-1">
                                        <i class="el-icon-delete icon-detail"></i>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" style="margin-top: 20px;height: 292px" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='structure:add')!=-1">
                        <img src="../../assets/image/project/add.png" alt="" width="100%" height="100%" @click="addPlant(index)"
                             style="cursor: pointer">
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
                :title="projectTitle"
                :visible.sync="projectVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="projectHandleClose">
            <el-form :model="projectRuleForm" :rules="projectRules" ref="projectRuleForm" label-width="110px"
                     class="demo-ruleForm">
                <el-form-item label="项目名称：" prop="projectName">
                    <el-input size="small" v-model="projectRuleForm.projectName"></el-input>
                </el-form-item>
                <el-form-item label="项目编号：" prop="projectCode">
                    <el-input size="small" v-model="projectRuleForm.projectCode"></el-input>
                </el-form-item>
                <el-form-item label="项目描述：">
                    <el-input type="textarea" v-model="projectRuleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="projectCancel('projectRuleForm')">取 消</el-button>
            <el-button type="primary" @click="projectSure('projectRuleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                :title="structureTitle"
                :visible.sync="structureVisible"
                :close-on-click-modal="false"
                width="800px"
                :modal-append-to-body="false"
                :before-close="structureHandleClose">
            <el-form :model="structureRuleForm" :rules="structureRules" ref="structureRuleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="现场名称：" prop="structureName">
                    <el-input size="small" v-model="structureRuleForm.structureName"></el-input>
                </el-form-item>
                <el-form-item label="现场编号：" prop="structureCode">
                    <el-input size="small" v-model="structureRuleForm.structureCode"></el-input>
                </el-form-item>
                <el-form-item label="现场类型：">
                    <el-input size="small" v-model="structureRuleForm.structureType"></el-input>
                </el-form-item>
                <el-form-item label="现场地址：" prop="address">
                    <el-input size="small" v-model="structureRuleForm.address" disabled placeholder="请点击下方地图获取地址"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: -30px">
                    <div class="searchAddress">
                        <el-input size="small" id='searchAddress' type="text" v-model="searchAddress">
                            <template slot="prepend">请输入地址</template>
                        </el-input>
                    </div>
                    <div id="map">
                    </div>
                </el-form-item>
                <el-form-item label="现场描述：">
                    <el-input type="textarea" v-model="structureRuleForm.remark"></el-input>
                </el-form-item>
                <el-form-item v-if="structureTitle==='编辑现场'" label="原现场图：">
                    <img :src="this.$url+structureRuleForm.structureImg" class="structureImg" alt="文件不存在" width="148px"
                         height="148px">
                </el-form-item>
                <el-form-item label="上传现场图：">
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
            <el-button @click="structureCancel('structureRuleForm')">取 消</el-button>
            <el-button type="primary" @click="structureSure('structureRuleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "projectControl",
        data() {
            return {
                //map 赋值
                map: '',
                //当前显示的项目下标
                activeName: '',
                //所有项目数据
                projectData: [],
                //所有负责人列表
                principalList: [],
                //项目新增/编辑 title
                projectTitle: '',
                //项目新增/编辑 弹框显示
                projectVisible: false,
                //项目新增/编辑 数据
                projectRuleForm: {
                    projectCode: '',
                    projectName: '',
                    remark: ''
                },
                //项目新增/编辑 规则
                projectRules: {
                    projectName: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                    ],
                    projectCode: [
                        {required: true, message: '请输入项目编号', trigger: 'blur'}
                    ],

                },
                //当前选中得项目id
                nowProjectId: '',
                //现场新增/编辑 title
                structureTitle: '',
                //现场新增/编辑 弹框显示
                structureVisible: false,
                //地图搜索地址
                searchAddress: '',
                //现场新增/编辑 数据
                structureRuleForm: {
                    structureName: '',
                    structureCode: '',
                    structureType: '',
                    address: '',
                    remark: '',
                    longitude: '',
                    latitude: '',
                    //图片地址
                    structureImg: ''
                },
                //现场新增/编辑 规则
                structureRules: {
                    structureName: [
                        {required: true, message: '请输入现场名称', trigger: 'blur'},
                    ],
                    structureCode: [
                        {required: true, message: '请输入现场编号', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请点击下方地图获取地址', trigger: 'blur'}
                    ],
                },
                //当前选中得现场id
                nowStructureId: '',

                //图片
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                //用来展示选取图片的地址
                imageUrl: '',
                //照片详情
                imgFile: '',



                //用来检查现场上传图片格式得
                imgCheck:true
            }
        },
        created() {
            this.$store.state.nowName='项目管理';
            this.getProjectData('first');
        },
        methods: {
            //tabs切换
            tabsClick(tab, event) {
                this.nowProjectId = this.projectData[parseInt(tab.index)].projectId;
            },
            //点击上传图片后
            onChange(file, fileList) {
                //因为手动修改上传，beforeAvatarUpload和这个同时执行得，imgCheck会修改比这个方法慢，所以延迟执行
                setTimeout(()=>{
                    if (this.imgCheck){
                        this.imgFile = file.raw;
                        this.imageUrl = URL.createObjectURL(file.raw);
                    }
                },300)
            },
            //超出一张图片后
            exceed() {
                this.$message.error('一次最多只能上传1张照片');
            },
            // //上传现场图
            // handleAvatarSuccess(res, file) {
            //     this.imageUrl = URL.createObjectURL(file.raw);
            //     console.log(this.imageUrl)
            // },
            //提交图片提交之前
            beforeAvatarUpload(file) {
                const isType = file.type === 'image/jpeg'||file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                this.imgCheck=true;
                if (!isType) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                    this.imgCheck=false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isType && isLt2M;
            },
            // //删除照片
            // handleRemove(file, fileList) {
            // },
            // //点击文件列表中已上传的文件时的钩子
            // handlePictureCardPreview(file) {
            //     this.dialogImageUrl = file.url;
            //     this.dialogVisible = true;
            // },
            //获取项目数据
            getProjectData(type) {
                this.$axios({
                    url: this.$BaseUrl + "/project/getIndexProjectList",
                    method: 'post'
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.projectData = res.data.data;
                        let principal = '';
                        for (let i in this.projectData) {
                            principal='';

                            this.projectData[i].principal = principal
                        }
                        //初始化 定位第一个
                        if (type=='first'){
                            this.activeName = this.projectData[0].projectCode;
                            this.nowProjectId = this.projectData[0].projectId;
                        }

                    }
                })
            },
            //新增项目
            newProject() {
                this.projectTitle = '新增项目';
                this.projectRuleForm.projectCode=this.$round.random('P');
                this.projectVisible = true;
            },
            //编辑项目
            editProject(index) {
                this.projectTitle = '编辑项目';
                this.projectRuleForm.projectName = this.projectData[index].projectName;
                this.projectRuleForm.projectCode = this.projectData[index].projectCode;
                this.projectRuleForm.remark = this.projectData[index].remark;
                this.nowProjectId = this.projectData[index].projectId;



                this.projectVisible = true;
            },
            //停止项目
            stopOrStartProject(index, type) {
                this.$confirm('确认停止项目?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/project/updateDoUse',
                        method: 'post',
                        data: {
                            projectId: this.projectData[index].projectId,
                            projectState: type
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '停止项目成功!'
                            });
                            this.getProjectData();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消停止'
                    });
                });
            },
            //删除项目
            deleteProject(index) {
                this.$confirm('确认删除项目?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/project/delProject',
                        method: 'post',
                        data: {
                            projectId: this.projectData[index].projectId,
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除项目成功!'
                            });
                            this.getProjectData();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //右上角或外侧关闭project弹窗
            projectHandleClose(done) {
                this.projectClear();
                done()
            },
            //取消project弹窗
            projectCancel() {
                this.projectVisible = false;
                this.projectClear();
            },
            //确认project弹窗
            projectSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let datas = {
                            projectCode: this.projectRuleForm.projectCode,
                            projectName: this.projectRuleForm.projectName,
                            remark: this.projectRuleForm.remark,

                        };
                        let url = this.$BaseUrl + "/project/addProject";
                        if (this.projectTitle === '编辑项目') {
                            datas.projectId = this.nowProjectId;
                            url = this.$BaseUrl + "/project/updateProject";
                        }
                        this.$axios({
                            url: url,
                            method: 'post',
                            data: datas
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg)
                            } else {
                                if (this.projectTitle === '编辑项目') {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑项目成功!'
                                    });
                                } else {
                                    this.$message({
                                        type: 'success',
                                        message: '新增项目成功!'
                                    });
                                }

                                this.projectClear();
                                this.projectVisible = false;
                                this.getProjectData();
                            }

                        })
                    } else {
                        return false;
                    }
                })
            },
            //project内部数据清除
            projectClear() {
                setTimeout(()=>{
                    this.$refs['projectRuleForm'].clearValidate();
                },100);

                this.projectRuleForm.projectName = '';
                this.projectRuleForm.projectCode = '';
                this.projectRuleForm.remark = '';

            },
            //structure内部数据清除
            structureClear() {
                setTimeout(()=>{
                    this.$refs['structureRuleForm'].clearValidate();
                },100);

                this.structureRuleForm.structureName = '';
                this.structureRuleForm.structureCode = '';
                this.structureRuleForm.structureType = '';
                this.structureRuleForm.address = '';
                this.structureRuleForm.remark = '';
                this.structureRuleForm.latitude = '';
                this.structureRuleForm.latitude = '';
                this.searchAddress='';
                this.imgFile = '';
                this.imageUrl = '';
            },
            //右上角或外侧关闭structure弹窗
            structureHandleClose(done) {
                this.structureClear();
                done()
            },
            //取消structure弹窗
            structureCancel() {
                this.structureVisible = false;
                this.structureClear();
            },
            //确认structure弹窗
            structureSure(formName, index) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.imgFile)
                        let formData = new FormData();
                        formData.append('structureName', this.structureRuleForm.structureName);
                        formData.append('structureCode', this.structureRuleForm.structureCode);
                        formData.append('structureType', this.structureRuleForm.structureType);
                        formData.append('address', this.structureRuleForm.address);
                        formData.append('remark', this.structureRuleForm.remark);
                        formData.append('longitude', this.structureRuleForm.longitude);
                        formData.append('latitude', this.structureRuleForm.latitude);
                        formData.append('projectId', this.nowProjectId);
                        formData.append('structureImg', this.imgFile != '' ? this.imgFile: '');
                        let url = this.$BaseUrl + "/structure/addStructure";
                        if (this.structureTitle === '编辑现场') {
                            formData.set('structureId', this.nowStructureId);
                            url = this.$BaseUrl + "/structure/updateStructure";
                        }
                        this.$axios({
                            url: url,
                            method: 'post',
                            data: formData
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg)
                            } else {
                                if (this.structureTitle === '编辑现场') {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑现场成功!'
                                    });
                                } else {
                                    this.$message({
                                        type: 'success',
                                        message: '新增现场成功!'
                                    });
                                }

                                this.structureClear();
                                this.structureVisible = false;
                                this.getProjectData();
                            }


                        })
                    } else {
                        return false;
                    }
                })
            },
            //新增现场
            addPlant(index) {
                this.structureTitle = '新增现场';
                this.structureRuleForm.structureCode=this.$round.random('ST');
                setTimeout(() => {
                    this.initMap('add');
                }, 0);
                this.structureVisible = true;
            },
            //编辑现场
            editPlant(index, index2) {
                this.structureTitle = '编辑现场';
                this.nowStructureId = this.projectData[index].structureList[index2].structureId;
                this.structureRuleForm.structureName = this.projectData[index].structureList[index2].structureName;
                this.structureRuleForm.structureCode = this.projectData[index].structureList[index2].structureCode;
                this.structureRuleForm.structureType = this.projectData[index].structureList[index2].structureType;
                this.structureRuleForm.address = this.projectData[index].structureList[index2].address;
                this.structureRuleForm.remark = this.projectData[index].structureList[index2].remark;
                this.structureRuleForm.longitude = this.projectData[index].structureList[index2].longitude;
                this.structureRuleForm.latitude = this.projectData[index].structureList[index2].latitude;
                this.structureRuleForm.structureImg = this.projectData[index].structureList[index2].structureImg;
                setTimeout(() => {
                    this.initMap('edit', index, index2);
                }, 0);

                this.structureVisible = true;
            },
            //报警记录跳转
            warnPlant(projectId,structureId){
                let array=[];
                array.push(projectId);
                array.push(structureId);
                this.$store.state.defaultActive = '/alarmControl/sensorAlarm';
                this.$router.push({name: 'sensorAlarm', params: { structureId: array }});

            },
            //统计分析跳转
            measurePlant(){
                this.$store.state.defaultActive = '/statisticAnalysis/originalAnalyze';
                this.$router.push('/statisticAnalysis/originalAnalyze')
            },
            //实时数据跳转
            realTimePlant(){
                this.$store.state.defaultActive = '/realTimeData/measurementValue';
                this.$router.push('/realTimeData/measurementValue')
            },
            //删除现场
            deletePlant(index, index2) {
                this.$confirm('确认删除现场?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + "/structure/delStructure",
                        method: 'post',
                        data: {
                            structureId: this.projectData[index].structureList[index2].structureId
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除现场成功!'
                            });
                            this.getProjectData()
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            //地图
            initMap(type, index, index2) {
                //根据type 区分是编辑还是新增
                let that = this;
                let geocoder, marker;
                if (type === 'add') {
                    that.map = new AMap.Map('map', {
                        zoom: 11,//级别
                        // center: [116.397428, 39.90923],//中心点坐标
                        resizeEnable: true,
                    });

                } else {
                    that.map = new AMap.Map('map', {
                        zoom: 11,//级别
                        center: [that.projectData[index].structureList[index2].longitude, that.projectData[index].structureList[index2].latitude],//中心点坐标
                        resizeEnable: true,
                    });
                }
                var auto = new AMap.Autocomplete({
                    input: 'searchAddress'
                });
                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                function select(e) {
                    if (e.poi.location!=''){
                        that.map.clearMap();
                        let array = [];
                        marker = new AMap.Marker({
                            position: [e.poi.location.lng, e.poi.location.lat],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        });
                        marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                            offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                        });
                        array.push(marker);
                        that.map.add(array);
                        let markerPosition = [e.poi.location.lng, e.poi.location.lat];
                        that.map.panTo(markerPosition);
                        that.structureRuleForm.address = e.poi.district+e.poi.name+e.poi.address;
                        that.structureRuleForm.longitude = e.poi.location.lng;
                        that.structureRuleForm.latitude = e.poi.location.lat;
                    }
                }
                // 绘制折线
                let path = new AMap.Polyline({
                    path: null,
                    isOutline: false,     //线条是否带描边，默认false
                    outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
                    borderWeight: 1,    //描边的宽度，默认为1
                    strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                    strokeOpacity: 1,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                    strokeWeight: 2,    //线条宽度，单位：像素
                    // 折线样式还支持 'dashed'
                    strokeStyle: "dashed",  //线样式，实线:solid，虚线:dashed
                    // strokeStyle是dashed时有效
                    strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
                    lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                    lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                    zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
                });
                // 将折线添加至地图实例
                that.map.add(path);
                // 插件
                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    that.map.addControl(new AMap.ToolBar());
                    that.map.addControl(new AMap.Scale())
                });
                function regeocoder(lnglatXY, that) {
                    AMap.plugin('AMap.Geocoder', function () {
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        geocoder.getAddress(lnglatXY, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                let address = result.regeocode.formattedAddress;
                                that.structureRuleForm.address = address
                            }
                        });
                        if (!marker) {
                            marker = new AMap.Marker();
                            that.map.add(marker);
                        }
                        marker.setPosition(lnglatXY);
                    })
                }

                that.map.on('click', function (e) {
                    var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
                    regeocoder(lnglatXY, that);
                    that.structureRuleForm.longitude = e.lnglat.getLng();
                    that.structureRuleForm.latitude = e.lnglat.getLat()
                });
                if (type === 'edit') {
                    //增加坐标点
                    let array = [];
                    marker = new AMap.Marker({
                        position: [that.projectData[index].structureList[index2].longitude, that.projectData[index].structureList[index2].latitude],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    });
                    // marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    //     offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                    //     content: that.projectData[index].structureList[index2].structureName
                    // });
                    array.push(marker);
                    that.map.add(array);
                }
            },
            //项目概览跳转
            overViewProject(index){
                this.$router.push({
                    path: '/project/overViewProject',
                    query: {
                        well: this.projectData[index].projectId,
                        data:this.projectData[index]
                    }
                });
            },
            //去现场详情
            goDetail(o,index){
                this.$store.state.structureData=o;
                this.$store.state.nowProjectName=this.projectData[index].projectName;
                this.$router.push('/project/structureDetail')
            }
        }
    }
</script>

<style scoped>
    * {
        font-size: 14px;
        margin: 0;
    }

    /*更多按钮外层*/
    .button-wrapper {
        text-align: center;
    }

    /*更多按钮内层*/
    .button-wrapper >>> .button {
        margin: 0;
        text-align: center;
    }

    /*新增项目*/
    .newProject {
        position: relative;
        left: 90%;
        top: 8px;
        z-index: 10;
    }
    .more{
        position: relative;
        right: 20%;
        z-index: 10;
    }
    /*tabs样式*/
    .content-wrapper >>> .el-tabs__nav-scroll {
        padding-right: 19%;
    }

    /*基本信息*/
    .basicInfo {
        font-weight: bold;
        margin-top: 20px;
    }

    /*基本信息总样式*/
    .allInfo {
        margin-top: 20px;
        width: 97.5%;
    }

    /*卡片信息单个样式*/
    .siteInfo {
        width: 45%;
        color: #666;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }


    /*基本信息单个样式*/
    .projectInfo {
        width: 30%;
        white-space: nowrap;
        display: flex;
        align-items: center;
    }

    /*基本信息各项数据*/
    .projectInfo-text {
        color: #666;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*现场主要样式*/
    .card-row {
        margin: 20px 0 0 0 !important;
        padding: 0;
        width: 100%;
    }

    /*card中间隔竖线颜色*/
    .card-row >>> .el-divider {
        background-color: #666;
    }

    /*card中icon样式*/
    .icon-button {
        width: 15%;
        text-align: center;
        cursor: pointer;
    }

    /*详细样式*/
    .icon-detail {
        font-size: 22px;
    }

    /*card内容上半部分*/
    .top {
        padding: 2%;
    }

    /*card内容下半部分*/
    .bottom {
        padding: 2%;
        border-top: 1px solid #666666;

    }

    /*card图片样式*/
    .image {
        cursor: pointer;
        width: 100%;
        height: 250px;
        display: block;
    }

    /*头部循环显示得项目标题*/
    .content-wrapper >>> .el-tabs__header {
        padding-right: 165px;
    }

    /*地图*/
    #map {
        width: 100%;
        height: 300px;
    }


    /*现场现场img*/
    .structureImg {
        border-radius: 6px;
        line-height: 146px;
        vertical-align: top;
    }

    /*上传图片样式*/
    .content-wrapper >>> .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .content-wrapper >>> .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .content-wrapper >>> .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .content-wrapper >>> .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

    /*地图搜索css*/
    .searchAddress{
        position: relative;
        top: 50px;
        left: 80px;
        z-index: 3000;
        width:80%;
    }
    /*解决新增项目 relative定位留下来的占位问题*/
    .el-tabs {
     margin-top: -30px;
    }
    /*整体外壳*/
    .project{
    }
</style>

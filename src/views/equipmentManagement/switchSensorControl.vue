<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="140px">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="所属项目/现场/网关：">
                        <el-cascader
                                size="small"
                                v-model="searchArea.psId"
                                :props="sensorProps"
                                clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="传感器名称：">
                        <el-input v-model="searchArea.switchSensorName" size="small" placeholder="请输入传感器名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="传感器编号：">
                        <el-input v-model="searchArea.switchSensorCode" size="small" placeholder="请输入传感器编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="传感器类型：">
                        <el-select v-model="searchArea.switchSensorType" size="small" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in sensorTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">

                    <el-form-item label="传感器状态：">
                        <el-select v-model="searchArea.switchSensorState" size="small" clearable placeholder="请选择">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="异常" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item style="margin-left:40px">
                        <el-button type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:add')!=-1"
                                   @click="sensorControl('add')">新增传感器
                        </el-button>
                        <el-button style="margin-left: 20px" type="primary" size="small"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:setWarn')!=-1"
                                   @click="batchAlarm">批量设置报警
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="gatewayTable">
            <el-table
                    :header-cell-style="{background:'rgb(250,250,250)'}"
                    :data="tableData"
                    stripe
                    @selection-change="handleSelectionChange"
                    v-loading="loading"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="传感器图片"
                        width="140">
                    <template slot-scope="scope">
                        <img :src="$url+scope.row.switchSensorImg" alt="" width="65" height="65">
                    </template>
                </el-table-column>
                <el-table-column
                        label="传感器编号"
                        width="140">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.switchSensorCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="switchSensorName"
                        label="传感器名称"
                        min-width="140">
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
                        prop="switchSensorTypeName"
                        label="传感器类型"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="reportTime"
                        label="上报时间"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row. switchSensorState==2"><span
                                style="color: rgb(0,168,84)">●</span> 正常</span>
                      <span v-else-if="scope.row.switchSensorState==1"><span style="color: orange">●</span> 处理中</span>
                        <span v-else><span style="color: rgb(240,65,52)">●</span> 报警中</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:del')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:setWarn')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:update')!=-1"
                                @click="sensorControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:del')!=-1"
                                @click="sensorDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <!--                        <el-button-->
                        <!--                                size="mini"-->
                        <!--                                type="warning"-->
                        <!--                                round-->
                        <!--                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:sendCmdCustom')!=-1"-->
                        <!--                                @click="IssuedInstructions(scope.row)">下发指令-->
                        <!--                        </el-button>-->
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='switchSensor:setWarn')!=-1"
                                @click="setWarn(scope.$index, scope.row)">设置报警
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
                width="500px"
                :before-close="sensorHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="所属网关：" v-show="sensorTitle=='新增传感器'" prop="gatewayId">
                    <el-cascader
                            size="small"
                            v-model="ruleForm.gatewayId"
                            :props="gatewayProps"
                            clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属网关：" v-show="sensorTitle=='编辑传感器'">
                    <el-input size="small" v-model="ruleForm.gatewayName" disabled></el-input>
                </el-form-item>
                <el-form-item label="传感器名称：" prop="switchSensorName">
                    <el-input size="small" v-model="ruleForm.switchSensorName"></el-input>
                </el-form-item>
                <el-form-item label="传感器编号：" prop="switchSensorCode">
                    <el-input size="small" v-model="ruleForm.switchSensorCode" :disabled="sensorEdit"></el-input>
                </el-form-item>
                <el-form-item label="传感器类型：" prop="switchSensorTypeId">
                    <el-select v-model="ruleForm.switchSensorTypeId" size="small" clearable placeholder="请选择">
                        <el-option
                                v-for="item in sensorTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址码：" prop="addressByte">
                    <el-input size="small" v-model="ruleForm.addressByte"></el-input>
                </el-form-item>
                <el-form-item label="传感器协议：" prop="agreementId">
                    <el-select v-model="ruleForm.agreementId" size="small" clearable placeholder="请选择"
                               :disabled="sensorEdit">
                        <el-option
                                v-for="item in sensorOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.remark" maxlength="255"></el-input>
                </el-form-item>
                <el-form-item v-if="sensorTitle==='编辑传感器'" label="原传感器图：">
                    <img :src="this.$url+ruleForm.switchSensorImg" class="structureImg" alt="文件不存在" width="148px"
                         height="148px">
                </el-form-item>
                <el-form-item label="上传传感器图：">
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
            <el-button @click="sensorCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="sensorSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                :title="warnTitle"
                :visible.sync="warnVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="warnHandleClose">
            <el-form :model="warnRuleForm" :rules="warnRules" ref="warnRuleForm" label-width="120px"
                     class="demo-ruleForm">
                <!--                <el-form-item label="推送方式：" prop="pushType">-->
                <!--                    <el-checkbox-group v-model="warnRuleForm.pushType">-->
                <!--                        <el-checkbox label="0">微信</el-checkbox>-->
                <!--                        <el-checkbox label="1">短信</el-checkbox>-->
                <!--                        <el-checkbox label="2">APP</el-checkbox>-->
                <!--&lt;!&ndash;                        <el-checkbox label="3">邮箱</el-checkbox>&ndash;&gt;-->
                <!--                    </el-checkbox-group>-->
                <!--                </el-form-item>-->
                <el-form-item label="报警联系人：" prop="warnUser">
                    <el-select v-model="warnRuleForm.warnUser" size="small" multiple placeholder="请选择">
                        <el-option
                                v-for="item in warnOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="warnCancel('warnRuleForm')">取 消</el-button>
            <el-button type="primary" @click="warnSure('warnRuleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "switchSensorControl",
        data() {
            let that = this;
            return {
                //传感器类型数据
                sensorTypeOptions: [],
                //搜索区域
                searchArea: {
                    switchSensorName: '',
                    switchSensorCode: '',
                    switchSensorType: '',
                    switchSensorState: '',
                    psId: [],
                    pageNum: 1,
                    pageSize: 5,
                },
                //表格数据
                tableData: [],
                //数据总数
                total: 0,
                //表格loading
                loading: true,
                //编辑时当前选中得行id
                nowsensorId: '',
                //表格选中
                alramCheck: [],
                //用来展示选取图片的地址
                imageUrl: '',
                //存储文件内容
                imgFile: '',
                //批量选择当前选中的所有传感器的id
                projectCheck: [],
                //新增/编辑传感器 数据
                ruleForm: {
                    gatewayId: '',
                    switchSensorName: '',
                    switchSensorCode: '',
                    switchSensorTypeId: '',
                    agreementId: '',
                    addressByte: '',
                    sensorImg: '',
                    gatewayName: '',
                    remark: ''
                },
                //新增/编辑传感器 数据规则
                rules: {
                    gatewayId: [
                        {required: true, message: '请选择所属网关', trigger: 'change'}
                    ],
                    switchSensorName: [
                        {required: true, message: '请输入传感器名称', trigger: 'blur'}
                    ],
                    switchSensorCode: [
                        {required: true, message: '请输入传感器编号', trigger: 'blur'}
                    ],
                    agreementId: [
                        {required: true, message: '请选择传感器协议', trigger: 'change'}
                    ],
                    addressByte: [
                        {required: true, message: '请输入地址码', trigger: 'blur'}
                    ],
                    switchSensorTypeId: [
                        {required: true, message: '请选择传感器类型', trigger: 'change'}
                    ],

                },
                //用来检查传感器上传图片格式得
                imgCheck: true,
                //传感器编辑时不可修改得元素
                sensorEdit: false,
                //设置报警title
                warnTitle: '',
                //控制设置报警显示
                warnVisible: false,
                //设置报警数据
                warnRuleForm: {
                    switchSensorId: '',
                    pushType: '0',
                    warnUser: '',
                },
                //报警联系人
                warnOptions: [],
                //下发指令规则
                warnRules: {
                    // pushType: [
                    //     {required: true, message: '请至少选择一个推送方式', trigger: 'change'}
                    // ],
                    warnUser: [
                        {required: true, message: '请选择报警联系人', trigger: 'change'}
                    ],
                },
                //传感器协议 数据
                sensorOptions: [],
                //新增/编辑传感器 title
                sensorTitle: '',
                //新增/编辑传感器 弹窗显示
                sensorVisible: false,
                //级联选择框数据
                sensorProps: {
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
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },
                //当前选择得下发指令得数据
                nowInstructionsData: {}

            }
        },
        created() {
            this.$store.state.nowName = '报警设备';
            this.getTableData();
            this.getSensorData();
            this.getSensorType();
        },
        methods: {
            //获取传感器类型
            getSensorType() {
                this.$axios({
                    url: this.$BaseUrl + '/switchSensor/getSwitchSensorTypeList',
                    method: 'post',
                    data: {
                        agreementType: 0
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.sensorTypeOptions = [];
                        for (let i in res.data.data) {
                            this.sensorTypeOptions.push({
                                label: res.data.data[i].switchSensorTypeName,
                                value: res.data.data[i].switchSensorTypeId,
                            })
                        }
                    }
                })
            },
            //获取传感器协议数据
            getSensorData() {
                this.$axios({
                    url: this.$BaseUrl + '/agreement/getPageList',
                    method: 'post',
                    data: {
                        agreementType: '3'
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.sensorOptions = [];
                        for (let i in res.data.data.list) {
                            this.sensorOptions.push({
                                label: res.data.data.list[i].agreementName,
                                value: res.data.data.list[i].agreementId,
                            })
                        }
                    }
                })
            },
            //获取报警通知人数据
            gerWarnOptionsData() {
                this.$axios({
                    url: this.$BaseUrl + '/user/getWarnUserList',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.warnOptions = [];
                        for (let i in res.data.data) {
                            this.warnOptions.push({label: res.data.data[i].name, value: res.data.data[i].userId})
                        }
                    }
                })
            },
            //表格展示计算时间的方法
            showCountTime(time) {
                let h = time / 3600;
                let m = (time % 3600) / 60;
                let s = (time % 3600) % 60;
                let times = '';
                if (h >= 1) {
                    times = parseInt(h) + '小时'
                }
                if (m >= 1) {
                    times = times + parseInt(m) + '分钟'
                }
                if (s > 0) {
                    times = times + parseInt(s) + '秒'
                }
                return times;
            },
            //获取表格数据
            getTableData() {
                let data = {...this.searchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.searchArea.psId.length === 1) {
                    data.projectId = this.searchArea.psId[0]
                } else if (this.searchArea.psId.length === 2) {
                    data.structureId = this.searchArea.psId[1];
                } else {
                    data.gatewayId = this.searchArea.psId[2];
                }
                this.$axios({
                    url: this.$BaseUrl + '/switchSensor/getPageList',
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
            //查询
            onSubmit() {
                //控制表格loading显示
                this.loading = true;
                //页码重置为1
                this.searchArea.pageNum = 1;
                //区别search
                this.getTableData()
            },
            //重置查询参数
            reset() {
                this.searchArea.switchSensorName = '';
                this.searchArea.switchSensorCode = '';
                this.searchArea.switchSensorType = '';
                this.searchArea.switchSensorState = '';
                this.searchArea.psId = [];
            },
            //计算时间的方法
            countTime(time) {
                let h = time / 3600;
                let m = (time % 3600) / 60;
                let s = (time % 3600) % 60;
                let times = [];
                if (h > 0) {
                    times.push(parseInt(h));
                } else {
                    times.push(0);
                }
                if (m > 0) {
                    times.push(parseInt(m));
                } else {
                    times.push(0);
                }
                if (s > 0) {
                    times.push(parseInt(s))
                } else {
                    times.push(0);
                }
                return times;
            },
            //传感器新增/编辑
            sensorControl(type, row) {

                if (type === 'add') {
                    this.sensorTitle = '新增传感器';
                    this.ruleForm.switchSensorCode = this.$round.random('SS');
                } else {
                    this.sensorEdit = true;
                    //当前传感器id
                    this.nowsensorId = row.switchSensorId;
                    this.sensorTitle = '编辑传感器';
                    this.ruleForm.gatewayId = row.gatewayId;
                    this.ruleForm.switchSensorName = row.switchSensorName;
                    this.ruleForm.switchSensorCode = row.switchSensorCode;
                    this.ruleForm.switchSensorTypeId = row.switchSensorTypeId;
                    this.ruleForm.agreementId = row.agreementId;
                    this.ruleForm.remark = row.remark;
                    this.ruleForm.gatewayName = row.gatewayName;
                    this.ruleForm.addressByte = row.addressByte;
                    this.ruleForm.switchSensorImg = row.switchSensorImg;
                }

                this.sensorVisible = true;
            },
            //传感器删除
            sensorDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/switchSensor/delSwitchSensor',
                        method: 'post',
                        data: {
                            switchSensorId: row.switchSensorId,
                            gatewayId: row.gatewayId,
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.loading = true;
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getTableData()
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
                //设置页面为点击的页码
                this.searchArea.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //批量设置报警
            batchAlarm() {
                if (this.alramCheck.length == 0) {
                    this.$message.error('请先选择需要批量设置报警的传感器!')
                } else {
                    this.gerWarnOptionsData();
                    this.warnTitle = '批量设置报警';
                    this.warnVisible = true;
                    this.projectCheck = [];
                    for (let i in this.alramCheck) {
                        this.projectCheck.push(this.alramCheck[i].switchSensorId)
                    }
                }
            },
            //表格多选
            handleSelectionChange(val) {
                this.alramCheck = val;
            },
            //新增/编辑窗口右上角关闭
            sensorHandleClose(done) {
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
                this.sensorClear();
                done();
            },
            //设置报警右上角窗口关闭
            warnHandleClose() {
                this.warnRuleForm.pushType = '0';
                this.warnRuleForm.warnUser = '';
                this.warnVisible = false;
            },
            //新增/编辑传感器数据清除
            sensorClear() {
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);

                this.ruleForm.gatewayId = '';
                this.ruleForm.switchSensorName = '';
                this.ruleForm.switchSensorCode = '';
                this.ruleForm.addressByte = '';
                this.ruleForm.switchSensorTypeId = '';
                this.ruleForm.agreementId = '';
                this.ruleForm.gatewayName = '';
                this.ruleForm.remark = '';
                this.imgFile = '';
                this.imageUrl = '';
                this.sensorEdit = false;
                this.sensorVisible = false;
            },
            //新增/编辑传感器窗口取消
            sensorCancel() {

                this.sensorClear();
            },
            //新增/编辑传感器窗口确认
            sensorSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let reghex = new RegExp("^[0-9A-F]+$");
                        if (reghex.exec(this.ruleForm.addressByte) == null) {
                            this.$message.error('请输入十六进制地址码');
                            this.ruleForm.addressByte = "";
                            return;
                        }
                        let formData = new FormData();
                        let url = '';
                        if (this.sensorTitle == '编辑传感器') {
                            formData.set('switchSensorId', this.nowsensorId);
                            url = this.$BaseUrl + '/switchSensor/updateSwitchSensor';
                            formData.set('gatewayId', this.ruleForm.gatewayId);
                        } else {
                            url = this.$BaseUrl + '/switchSensor/addSwitchSensor';
                            formData.set('gatewayId', this.ruleForm.gatewayId[2]);
                        }
                        formData.set('switchSensorCode', this.ruleForm.switchSensorCode);
                        formData.set('switchSensorName', this.ruleForm.switchSensorName);
                        formData.set('switchSensorTypeId', this.ruleForm.switchSensorTypeId);
                        formData.set('remark', this.ruleForm.remark);
                        formData.set('agreementId', this.ruleForm.agreementId);
                        formData.set('addressByte', this.ruleForm.addressByte);
                        formData.set('switchSensorImg', this.imgFile != '' ? this.imgFile : '');
                        this.$axios({
                            url: url,
                            method: 'post',
                            data: formData
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                if (this.sensorTitle == '新增传感器') {
                                    this.$message({
                                        message: '新增成功!',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: '编辑成功!',
                                        type: 'success'
                                    });
                                }
                                this.loading = true;
                                this.getTableData();
                                setTimeout(() => {
                                    this.$refs['ruleForm'].clearValidate();
                                }, 100);

                                this.sensorClear();
                            }
                        })

                    } else {

                    }
                })
            },
            //设置报警取消
            warnCancel() {
                setTimeout(() => {
                    this.$refs['warnRuleForm'].clearValidate();
                }, 100);

                this.warnVisible = false;
                this.warnRuleForm.pushType = '0';
                this.warnRuleForm.warnUser = '';
            },
            //设置报警窗口确认
            warnSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = this.$BaseUrl + '/switchSensor/setSwitchSensorWarn';
                        let data = {};
                        data.warnUser = this.warnRuleForm.warnUser.join(',');
                        data.pushType = this.warnRuleForm.pushType;
                        if (this.warnTitle == '批量设置报警') {
                            data.switchSensorIds = this.projectCheck;
                            url = this.$BaseUrl + '/switchSensor/batchSetSwitchSensorWarn';
                        } else {
                            data.switchSensorId = this.warnRuleForm.switchSensorId;
                        }
                        this.$axios({
                            url: url,
                            method: 'post',
                            data: data
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                this.$message({
                                    message: '设置成功!',
                                    type: 'success'
                                });
                                this.loading = true;
                                this.getTableData();
                                setTimeout(() => {
                                    this.$refs['warnRuleForm'].clearValidate();
                                }, 100);

                                this.warnVisible = false;
                                this.warnRuleForm.pushType = '0';
                                this.warnRuleForm.warnUser = '';
                            }
                        });
                    }
                })
            },
            //级联选择框值改变
            cascaderChange(value) {
            },
            //点击上传图片后
            onChange(file, fileList) {
                //因为手动修改上传，beforeAvatarUpload和这个同时执行得，imgCheck会修改比这个方法慢，所以延迟执行
                setTimeout(() => {
                    if (this.imgCheck) {
                        this.imgFile = file.raw;
                        this.imageUrl = URL.createObjectURL(file.raw);
                    }
                }, 300)
            },
            //提交图片提交之前
            beforeAvatarUpload(file) {
                const isType = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                this.imgCheck = true;
                if (!isType) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                    this.imgCheck = false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isType && isLt2M;
            },
            //设置报警点击
            setWarn(index, row) {
                this.gerWarnOptionsData();
                this.$axios({
                    url: this.$BaseUrl + '/switchSensor/getWarnRuleBySwitchSensorId',
                    method: 'post',
                    data: {
                        switchSensorId: row.switchSensorId
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            let warnUser = res.data.data.warnUser.split(',');
                            for (let i in warnUser) {
                                warnUser[i] = parseInt(warnUser[i]);
                            }
                                this.warnRuleForm.warnUser = warnUser;
                        }
                        setTimeout(() => {
                            this.$refs['warnRuleForm'].clearValidate();
                        }, 100);
                        this.warnRuleForm.switchSensorId = row.switchSensorId;
                        this.warnTitle = '设置报警';
                        this.warnVisible = true;
                    }
                });


            },
            //去传感器详情
            goDetail(row) {
                this.$store.state.switchSensorData = row;
                this.$router.push('/equipmentManagement/switchSensorControlDetail')
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

    /*传感器表格样式*/
    .gatewayTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }
</style>

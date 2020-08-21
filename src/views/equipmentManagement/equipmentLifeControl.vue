<template>
    <div class="content-wrapper">
        <el-tabs v-model="$store.state.equipmentLifeActive" @tab-click="handleClick">
            <el-tab-pane label=" 网 关 " name="0">
                <!--        搜索区域-->
                <el-form :inline="true" :model="gatewaySearchArea" class="demo-form-inline formInline"
                         label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="所属项目/现场：">
                                <el-cascader
                                        size="small"
                                        v-model="gatewaySearchArea.psId"
                                        :props="props"
                                        clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="网关名称：">
                                <el-input v-model="gatewaySearchArea.gatewayName" size="small" placeholder="请输入网关名称"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" @click="onGateWaySubmit">查询</el-button>
                                <el-button size="small" @click="onGateWayReset">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="网关编号：">
                                <el-input v-model="gatewaySearchArea.gatewayCode" size="small" placeholder="请输入网关编号"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="状态：">
                                <el-select v-model="gatewaySearchArea.calibrateState" size="small" clearable
                                           placeholder="请选择">
                                    <el-option label="正常" value="1"></el-option>
                                    <el-option label="异常" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" icon="el-icon-plus"
                                           v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewayYearManage:calibrateGateway')!=-1"
                                           @click="batchTime('gateway')">批量校准网关
                                </el-button>
                                <el-button style="margin-left: 20px" type="primary" icon="el-icon-plus" size="small"
                                           v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewayYearManage:setGatewayYearWarn')!=-1"
                                           @click="batchAlarm('gateway')">批量设置网关报警
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--        表格区域-->
                <div class="gatewayTable">
                    <el-table
                            :header-cell-style="{background:'rgb(250,250,250)'}"
                            :data="gatewayTableData"
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
                                label="网关编号"
                                width="140">
                            <template slot-scope="scope">
                                <a @click="goDetail(scope.row,'gateway')">{{scope.row.gatewayCode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="gatewayName"
                                label="网关名称"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="所属项目"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="structureName"
                                label="所属现场"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="lastCalibrateDate"
                                label="最近一次校准日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="calibrateCycleName"
                                label="校准周期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="deadline"
                                label="使用截止日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="earlyWarnTimeName"
                                label="提前报警时长"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                label="状态"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.calibrateState==1"><span
                                        style="color: rgb(0,168,84)">●</span> 正常</span>
                                <span v-else><span style="color: rgb(240,65,52)">●</span> 异常</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="190" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                        type="warning"
                                        size="mini"
                                        round
                                        plain
                                        v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewayYearManage:calibrateGateway')!=-1"
                                        @click="timeControl('gateway',scope.row)">校准网关
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        round
                                        plain
                                        v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewayYearManage:setGatewayYearWarn')!=-1"
                                        @click="setWarn('gateway', scope.row)">设置报警
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--        分页区域-->
                <div class="pagination">
                    <el-pagination
                            @size-change="gatewayHandleSizeChange"
                            @current-change="gatewayHandleCurrentChange"
                            :current-page="gatewaySearchArea.pageNum"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="gatewaySearchArea.pageSize"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="gatewayTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="传感器" name="1">
                <!--        搜索区域-->
                <el-form :inline="true" :model="sensorSearchArea" class="demo-form-inline formInline"
                         label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="所属项目/现场：">
                                <el-cascader
                                        size="small"
                                        v-model="sensorSearchArea.psId"
                                        :props="props"
                                        clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="传感器名称：">
                                <el-input v-model="sensorSearchArea.sensorName" size="small" placeholder="请输入传感器名称"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" @click="onSensorSubmit">查询</el-button>
                                <el-button size="small" @click="onSensorReset">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-form-item label="传感器编号：">
                                <el-input v-model="sensorSearchArea.sensorCode" size="small" placeholder="请输入传感器编号"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="状态：">
                                <el-select v-model="sensorSearchArea.calibrateState" size="small" clearable
                                           placeholder="请选择">
                                    <el-option label="正常" value="1"></el-option>
                                    <el-option label="异常" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-button type="primary" size="small" icon="el-icon-plus"
                                           v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:calibrateSensor')!=-1"
                                           @click="batchTime('sensor')">批量校准传感器
                                </el-button>
                                <el-button style="margin-left: 20px" type="primary" icon="el-icon-plus" size="small"
                                           v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:setSensorTearWarn')!=-1"
                                           @click="batchAlarm('sensor')">批量设置传感器报警
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!--        表格区域-->
                <div class="gatewayTable">
                    <el-table
                            :header-cell-style="{background:'rgb(250,250,250)'}"
                            :data="sensorTableData"
                            stripe
                            @selection-change="sensorHandleSelectionChange"
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
                                label="传感器编号"
                                width="140">
                            <template slot-scope="scope">
                                <a @click="goDetail(scope.row,'sensor')">{{scope.row.sensorCode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="sensorName"
                                label="传感器名称"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="所属项目"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="structureName"
                                label="所属现场"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="gatewayName"
                                label="所属网关"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="remark"
                                label="备注"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="lastCalibrateDate"
                                label="最近一次校准日期"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="calibrateCycleName"
                                label="校准周期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="deadline"
                                label="使用截止日期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="earlyWarnTimeName"
                                label="提前报警时长"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                label="状态"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.calibrateState==1"><span
                                        style="color: rgb(0,168,84)">●</span> 正常</span>
                                <span v-else><span style="color: rgb(240,65,52)">●</span> 异常</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="210"
                                         v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:calibrateSensor')!=-1
                                    ||$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:setSensorTearWarn')!=-1
                                    "
                                         fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                        type="warning"
                                        size="mini"
                                        round
                                        plain
                                        v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:calibrateSensor')!=-1"
                                        @click="timeControl('sensor',scope.row)">校准传感器
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        round
                                        plain
                                        v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensorYearManage:setSensorTearWarn')!=-1"
                                        @click="setWarn('sensor', scope.row)">设置报警
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--        分页区域-->
                <div class="pagination">
                    <el-pagination
                            @size-change="sensorHandleSizeChange"
                            @current-change="sensorHandleCurrentChange"
                            :current-page="sensorSearchArea.pageNum"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="sensorSearchArea.pageSize"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="sensorTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
                :title="timeTitle"
                :visible.sync="timeVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="timeHandleClose">
            <el-form :model="timeRuleForm" ref="timeRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item
                        label="校准日期"
                        prop="time"
                        :rules="[
                                  { required: true, message: '请填写校准时间',trigger:'change'},
                                ]"
                >
                    <el-date-picker
                            size="small"
                            v-model="timeRuleForm.time"
                            type="date"
                            :picker-options="pickerOptions"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timeCancel('timeRuleForm')">取 消</el-button>
                <el-button type="primary" @click="timeSure('timeRuleForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :title="warnTitle"
                :visible.sync="warnVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="warnHandleClose">
            <el-form :model="warnRuleForm" :rules="warnRules" ref="warnRuleForm" label-width="130px"
                     class="demo-ruleForm">
                <span class="tag" style="left: 38px">*</span>
                <el-form-item style="margin-top: -30px" label="校准周期：">
                    <div class="flex-between">
                        <el-input-number v-model="warnRuleForm.calibrateCycle" size="small" controls-position="right"
                                         :min="0"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">年</span>
                        <el-input-number v-model="warnRuleForm.calibrateCycle2" size="small" controls-position="right"
                                         :min="0" :max="11"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">月</span>
                        <el-input-number v-model="warnRuleForm.calibrateCycle3" size="small" controls-position="right"
                                         :min="0" :max="30"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">日</span>
                    </div>
                </el-form-item>
                <span class="tag">*</span>
                <el-form-item style="margin-top: -30px" label="提前报警时长：">
                    <div class="flex-between">
                        <el-input-number v-model="warnRuleForm.earlyWarnTime" size="small" controls-position="right"
                                         :min="0"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">年</span>
                        <el-input-number v-model="warnRuleForm.earlyWarnTime2" size="small" controls-position="right"
                                         :min="0" :max="11"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">月</span>
                        <el-input-number v-model="warnRuleForm.earlyWarnTime3" size="small" controls-position="right"
                                         :min="0" :max="30"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">日</span>
                    </div>
                </el-form-item>
                <el-form-item label="报警推送：">
                    <el-switch
                            v-model="warnRuleForm.switch"
                            active-color="#13ce66"
                            inactive-color="#666"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label="推送方式：" prop="pushType" v-if="warnRuleForm.switch">
                    <el-checkbox-group v-model="warnRuleForm.pushType">
                        <el-checkbox label="0">微信</el-checkbox>
                        <el-checkbox label="1">短信</el-checkbox>
                        <el-checkbox label="2">APP</el-checkbox>
<!--                        <el-checkbox label="3">邮箱</el-checkbox>-->
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="报警联系人：" prop="warnUser" v-if="warnRuleForm.switch">
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
            <el-button @click="warnCancel()">取 消</el-button>
            <el-button type="primary" @click="warnSure('warnRuleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "equipmentLifeControl",
        data() {
            let that = this;
            return {
                //校准日期必须大于等于今天
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 1000 * 3600 * 24;
                    }
                },
                //网关搜索区域
                gatewaySearchArea: {
                    gatewayName: '',
                    gatewayCode: '',
                    calibrateState: '',
                    psId: [],
                    pageNum: 1,
                    pageSize: 5,
                },
                //校准时间数据
                timeRuleForm: {
                    time: ''
                },
                //校准时间title
                timeTitle: '',
                //控制下发指令弹窗显示
                timeVisible: false,

                //传感器搜索区域
                sensorSearchArea: {
                    sensorName: '',
                    sensorCode: '',
                    calibrateState: '',
                    psId: [],
                    pageNum: 1,
                    pageSize: 5,
                },

                //设置报警数据
                warnRuleForm: {
                    calibrateCycle: '',
                    calibrateCycle2: '',
                    calibrateCycle3: '',
                    earlyWarnTime: '',
                    earlyWarnTime2: '',
                    earlyWarnTime3: '',
                    switch: false,
                    pushType: [],
                    warnUser: [],
                },
                //设置报警规则
                warnRules: {
                    pushType: [
                        {required: true, message: '请至少选择一个推送方式', trigger: 'change'}
                    ],
                    warnUser: [
                        {required: true, message: '请选择报警联系人', trigger: 'change'}
                    ],
                },

                //报警联系人数据
                warnOptions: [],
                //设置报警title
                warnTitle: '',
                //控制设置报警显示
                warnVisible: false,
                //网关表格数据
                gatewayTableData: [],
                //网关数据总数
                gatewayTotal: 0,
                //表格loading
                loading: true,
                //新增/编辑网关 title
                gatewayTitle: '',
                //级联选择框数据
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
                                            leaf: level >= 1
                                        })
                                    }
                                    resolve(nodes);
                                });
                            } else {
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
                                            leaf: level >= 1
                                        })
                                    }
                                    resolve(nodes);
                                });
                            }


                        }, 0);
                    }
                },

                //传感器表格数据
                sensorTableData: [],
                //传感器数据总数
                sensorTotal: 0,

                //编辑时当前选中得行id
                nowCheckId: '',
                //网关表格选中
                gatewayCheck: [],
                //传感器表格选中
                sensorCheck: [],


            }
        },
        created() {
            this.$store.state.nowName = '设备年限管理';
            this.getGatewayTableData();
            this.getSensorTableData();
            this.gerWarnOptionsData();
        },
        methods: {
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
                            this.warnOptions.push({
                                label: res.data.data[i].name,
                                value: res.data.data[i].userId + ''
                            })
                        }
                    }
                })
            },
            //计算年月日的方法
            countTime(time) {
                let h = time / 360;
                let m = (time % 360) / 30;
                let s = (time % 360) % 30;
                let times = '';
                if (h >= 1) {
                    times = parseInt(h) + '年'
                }
                if (m >= 1) {
                    times = times + parseInt(m) + '月'
                }
                if (s > 0) {
                    times = times + s + '日'
                }
                return times;
            },
            //获取网关表格数据
            getGatewayTableData() {
                let data = {...this.gatewaySearchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.gatewaySearchArea.psId.length === 1) {
                    data.projectId = this.gatewaySearchArea.psId[0]
                } else if (this.gatewaySearchArea.psId.length === 2) {
                    data.structureId = this.gatewaySearchArea.psId[1];
                }
                this.$axios({
                    url: this.$BaseUrl + '/gatewayYearManage/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayTableData = [];
                        if (res.data.data != null) {
                            this.gatewayTableData = res.data.data.list;
                            for (let i in this.gatewayTableData) {
                                this.gatewayTableData[i].calibrateCycleName = this.countTime(this.gatewayTableData[i].calibrateCycle)
                                this.gatewayTableData[i].earlyWarnTimeName = this.countTime(this.gatewayTableData[i].earlyWarnTime)
                            }
                            this.gatewayTotal = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.gatewayTableData = [];
                            this.gatewayTotal = 0;
                            this.loading = false;
                        }
                    }
                })
            },
            //获取传感器表格数据
            getSensorTableData() {
                let data = {...this.sensorSearchArea};
                //根据数组宽度判断选择的是项目还是现场，项目宽度为1 ，现场宽度为2
                if (this.sensorSearchArea.psId.length === 1) {
                    data.projectId = this.sensorSearchArea.psId[0]
                } else if (this.sensorSearchArea.psId.length === 2) {
                    data.structureId = this.sensorSearchArea.psId[1];
                }
                this.$axios({
                    url: this.$BaseUrl + '/sensorYearManage/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.sensorTableData = [];
                        if (res.data.data != null) {
                            this.sensorTableData = res.data.data.list;
                            for (let i in this.sensorTableData) {
                                this.sensorTableData[i].calibrateCycleName = this.countTime(this.sensorTableData[i].calibrateCycle)
                                this.sensorTableData[i].earlyWarnTimeName = this.countTime(this.sensorTableData[i].earlyWarnTime)
                            }
                            this.sensorTotal = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.sensorTableData = [];
                            this.sensorTotal = 0;
                            this.loading = false;
                        }
                    }
                })
            },
            //tabs点击
            handleClick(tab, event) {
            },
            //网关查询
            onGateWaySubmit() {
                this.gatewaySearchArea.pageNum = 1;
                this.loading = true;
                this.getGatewayTableData()
            },
            //网关重置
            onGateWayReset() {
                this.gatewaySearchArea.gatewayName = '';
                this.gatewaySearchArea.gatewayCode = '';
                this.gatewaySearchArea.calibrateState = '';
                this.gatewaySearchArea.psId = [];
            },
            //传感器查询
            onSensorSubmit() {
                this.sensorSearchArea.pageNum = 1;
                this.loading = true;
                this.getSensorTableData()
            },
            //传感器重置
            onSensorReset() {
                this.sensorSearchArea.gatewayName = '';
                this.sensorSearchArea.gatewayCode = '';
                this.sensorSearchArea.calibrateState = '';
                this.sensorSearchArea.psId = [];
            },
            //校准时间打开
            timeControl(type, row) {
                //根据type判断当前是网关还是传感器
                type === 'gateway' ? this.nowCheckId = row.gatewayId : this.nowCheckId = row.sensorId;
                type === 'gateway' ? this.timeTitle = '校准网关' : this.timeTitle = '校准传感器';
                this.timeRuleForm.time = new Date();
                this.timeVisible = true;
            },
            //批量校准设备
            batchTime(type) {
                if (type === 'gateway') {
                    if (this.gatewayCheck.length == 0) {
                        this.$message.error('请先选择需要批量校准设备的网关!')
                    } else {
                        this.timeTitle = '批量校准网关';
                        this.timeVisible = true;
                    }
                } else {
                    if (this.sensorCheck.length == 0) {
                        this.$message.error('请先选择需要批量设置报警的传感器!')
                    } else {
                        this.timeTitle = '批量校准传感器';
                        this.timeVisible = true;
                    }
                }
            },
            //校准时间弹窗右上角关闭
            timeHandleClose(done) {
                this.timeRuleForm.time = '';
                done();
            },
            //校准时间确定
            timeSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.timeTitle == '校准网关') {
                            this.$axios({
                                url: this.$BaseUrl + '/gatewayYearManage/calibrateGateway',
                                method: 'post',
                                data: {
                                    lastCalibrateDate: this.$moment(this.timeRuleForm.time).format('YYYY-MM-DD'),
                                    gatewayId: this.nowCheckId
                                }
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '校准网关成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getGatewayTableData();
                                    setTimeout(() => {
                                        this.$refs['timeRuleForm'].clearValidate();
                                        this.timeVisible = false;
                                    }, 100)

                                }
                            });
                        } else if (this.timeTitle == '批量校准网关') {
                            let gatewayCheck = [];
                            for (let i in this.gatewayCheck) {
                                gatewayCheck.push(this.gatewayCheck[i].gatewayId)
                            }
                            this.$axios({
                                url: this.$BaseUrl + '/gatewayYearManage/batchCalibrateGateway',
                                method: 'post',
                                data: {
                                    lastCalibrateDate: this.$moment(this.timeRuleForm.time).format('YYYY-MM-DD'),
                                    gatewayIds: gatewayCheck
                                }
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '批量校准网关成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getGatewayTableData();
                                    setTimeout(() => {
                                        this.$refs['timeRuleForm'].clearValidate();
                                        this.timeVisible = false;
                                    }, 100)
                                }
                            });
                        } else if (this.timeTitle == '校准传感器') {
                            this.$axios({
                                url: this.$BaseUrl + '/sensorYearManage/calibrateSensor?',
                                method: 'post',
                                data: {
                                    lastCalibrateDate: this.$moment(this.timeRuleForm.time).format('YYYY-MM-DD'),
                                    sensorId: this.nowCheckId
                                }
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '校准传感器成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getSensorTableData();
                                    this.timeRuleForm.time = '';
                                    setTimeout(() => {
                                        this.$refs['timeRuleForm'].clearValidate();
                                        this.timeVisible = false;
                                    }, 100)


                                }
                            });
                        } else if (this.timeTitle == '批量校准传感器') {
                            let sensorCheck = [];
                            for (let i in this.sensorCheck) {
                                sensorCheck.push(this.sensorCheck[i].sensorId)
                            }
                            this.$axios({
                                url: this.$BaseUrl + '/sensorYearManage/batchCalibrateSensor',
                                method: 'post',
                                data: {
                                    lastCalibrateDate: this.$moment(this.timeRuleForm.time).format('YYYY-MM-DD'),
                                    gatewayIds: sensorCheck
                                }
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '批量校准传感器成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getGatewayTableData();
                                    setTimeout(() => {
                                        this.$refs['timeRuleForm'].clearValidate();
                                        this.timeVisible = false;
                                    }, 100)
                                }
                            });
                        }

                    } else {
                    }
                });
            },

            //校准时间取消
            timeCancel(formName) {
                this.timeRuleForm.time = '';
                this.$refs[formName].clearValidate();
                this.timeVisible = false;
            },
            //计算天数的方法
            changeData(time) {
                let y = time / 360;
                let m = (time % 360) / 30;
                let d = (time % 360) % 30;
                let date = [];
                y > 0 ? date.push(parseInt(y)) : date.push(0);
                m > 0 ? date.push(parseInt(m)) : date.push(0);
                d > 0 ? date.push(parseInt(d)) : date.push(0);
                return date;
            },
            //设置报警打开
            setWarn(type, row) {
                //根据type判断当前是网关还是传感器
                type === 'gateway' ? this.nowCheckId = row.gatewayId : this.nowCheckId = row.sensorId;
                type === 'gateway' ? this.warnTitle = '设置网关年限报警规则' : this.warnTitle = '设置传感器年限报警规则';
                if (type === 'gateway') {
                    //网关
                    //根绝规则转换年月日 数据在row中
                    let earlyWarnTime = this.changeData(row.earlyWarnTime);
                    this.warnRuleForm.earlyWarnTime = earlyWarnTime[0];
                    this.warnRuleForm.earlyWarnTime2 = earlyWarnTime[1];
                    this.warnRuleForm.earlyWarnTime3 = earlyWarnTime[2];
                    let calibrateCycle = this.changeData(row.calibrateCycle);
                    this.warnRuleForm.calibrateCycle = calibrateCycle[0];
                    this.warnRuleForm.calibrateCycle2 = calibrateCycle[1];
                    this.warnRuleForm.calibrateCycle3 = calibrateCycle[2];
                    //推送方式在接口中
                    this.$axios({
                        url: this.$BaseUrl + '/gatewayYearManage/getWarnYearRuleByGatewayId',
                        method: 'post',
                        data: {
                            gatewayId: this.nowCheckId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (res.data.data !== '' && res.data.data != null && res.data.data.pushType != null) {
                                this.warnRuleForm.pushType = res.data.data.pushType.split(',');
                                this.warnRuleForm.warnUser = res.data.data.warnUser.split(',');
                                this.warnRuleForm.switch = true;
                            } else {
                                this.warnRuleForm.switch = false;
                            }
                            this.warnVisible = true;
                        }
                    });
                } else {
                    //传感器
                    //根绝规则转换年月日 数据在row中
                    let earlyWarnTime = this.changeData(row.earlyWarnTime);
                    this.warnRuleForm.earlyWarnTime = earlyWarnTime[0];
                    this.warnRuleForm.earlyWarnTime2 = earlyWarnTime[1];
                    this.warnRuleForm.earlyWarnTime3 = earlyWarnTime[2];
                    let calibrateCycle = this.changeData(row.calibrateCycle);
                    this.warnRuleForm.calibrateCycle = calibrateCycle[0];
                    this.warnRuleForm.calibrateCycle2 = calibrateCycle[1];
                    this.warnRuleForm.calibrateCycle3 = calibrateCycle[2];
                    //推送方式在接口中
                    this.$axios({
                        url: this.$BaseUrl + '/sensorYearManage/getWarnYearRuleBySensorId',
                        method: 'post',
                        data: {
                            sensorId: this.nowCheckId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (res.data.data !== '' && res.data.data != null && res.data.data.pushType != null) {
                                this.warnRuleForm.pushType = res.data.data.pushType.split(',');
                                this.warnRuleForm.warnUser = res.data.data.warnUser.split(',');
                                this.warnRuleForm.switch = true;
                            } else {
                                this.warnRuleForm.switch = false;
                            }
                            this.warnVisible = true;
                        }
                    });
                }
            },
            //设置报警右上角关闭
            warnHandleClose(done) {
                this.warnClear();
                done()
            },
            //设置报警数据清除
            warnClear() {
                setTimeout(() => {
                    this.$refs['warnRuleForm'].clearValidate();
                }, 100);
                this.warnRuleForm.calibrateCycle = '';
                this.warnRuleForm.calibrateCycle2 = '';
                this.warnRuleForm.calibrateCycle3 = '';
                this.warnRuleForm.earlyWarnTime = '';
                this.warnRuleForm.earlyWarnTime2 = '';
                this.warnRuleForm.earlyWarnTime3 = '';
                this.warnRuleForm.pushType = [];
                this.warnRuleForm.warnUser = [];
                this.warnRuleForm.switch = false;
                this.warnVisible = false;
            },
            //设置报警确认
            warnSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {...this.warnRuleForm};
                        //后端要求天数 规则后端定
                        data.earlyWarnTime = data.earlyWarnTime * 360 + data.earlyWarnTime2 * 30 + data.earlyWarnTime3;
                        data.calibrateCycle = data.calibrateCycle * 360 + data.calibrateCycle2 * 30 + data.calibrateCycle3;
                        if (data.calibrateCycle <= 0) {
                            this.$message.error('请填写报警周期!');
                            return;
                        } else if (data.earlyWarnTime <= 0) {
                            this.$message.error('请填写提前报警时长!');
                            return;
                        }
                        data.gatewayYearWarnRule = {};
                        data.sensorYearWarnRule = {};
                        //后端要求格式 switch为真时做修改，假时置空
                        if (data.switch) {
                            data.gatewayYearWarnRule.pushType = data.pushType.join(',');
                            data.gatewayYearWarnRule.warnUser = data.warnUser.join(',');
                            data.sensorYearWarnRule.pushType = data.pushType.join(',');
                            data.sensorYearWarnRule.warnUser = data.warnUser.join(',');
                        } else {
                            data.gatewayYearWarnRule = {};
                            data.sensorYearWarnRule = {};
                        }
                        if (this.warnTitle == '设置网关年限报警规则') {
                            data.gatewayId = this.nowCheckId;
                            this.$axios({
                                url: this.$BaseUrl + '/gatewayYearManage/setGatewayYearWarn',
                                method: 'post',
                                data: data
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '设置网关年限报警规则成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getGatewayTableData();
                                    this.timeVisible = false;
                                    this.warnClear()
                                }
                            });
                        } else if (this.warnTitle == '设置传感器年限报警规则') {
                            data.sensorId = this.nowCheckId;
                            this.$axios({
                                url: this.$BaseUrl + '/sensorYearManage/setSensorTearWarn',
                                method: 'post',
                                data: data
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '设置传感器年限报警规则成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getSensorTableData();
                                    this.timeVisible = false;
                                    this.warnClear()
                                }
                            });
                        } else if (this.warnTitle == '批量设置网关年限报警规则') {
                            data.gatewayIds = [];
                            for (let i in this.gatewayCheck) {
                                data.gatewayIds.push(this.gatewayCheck[i].gatewayId)
                            }
                            this.$axios({
                                url: this.$BaseUrl + '/gatewayYearManage/batchSetGatewayYearWarn',
                                method: 'post',
                                data: data
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '批量设置网关年限报警规则成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getGatewayTableData();
                                    this.timeVisible = false;
                                    this.warnClear()
                                }
                            });
                        } else if (this.warnTitle == '批量设置传感器年限报警规则') {
                            data.sensorIds = [];
                            for (let i in this.sensorCheck) {
                                data.sensorIds.push(this.sensorCheck[i].sensorId)
                            }
                            this.$axios({
                                url: this.$BaseUrl + '/sensorYearManage/batchSetSensorYearWarn',
                                method: 'post',
                                data: data
                            }).then(res => {
                                if (res.data.success == false) {
                                    this.$message.error(res.data.msg);
                                } else {
                                    this.$message({
                                        message: '批量设置传感器年限报警规则成功!',
                                        type: 'success'
                                    });
                                    this.loading = true;
                                    this.getSensorTableData();
                                    this.timeVisible = false;
                                    this.warnClear()
                                }
                            });
                        }


                    } else {
                    }
                });
            },
            //设置报警取消
            warnCancel() {
                this.warnClear()
            },
            //网关表格每页展示多少设置
            gatewayHandleSizeChange(val) {
                this.gatewaySearchArea.pageSize = val;
                this.gatewaySearchArea.pageNum = 1;
                this.loading = true;
                this.getGatewayTableData()
            },
            //网关表格每页展示多少设置
            sensorHandleSizeChange(val) {
                this.sensorSearchArea.pageSize = val;
                this.sensorSearchArea.pageNum = 1;
                this.loading = true;
                this.getSensorTableData()
            },

            //网关跳转页码  以及页码点击
            gatewayHandleCurrentChange(val) {
                //设置页面为点击的页码
                this.gatewaySearchArea.pageNum = val;
                this.loading = true;
                this.getGatewayTableData()
            },
            //网关跳转页码  以及页码点击
            sensorHandleCurrentChange(val) {
                //设置页面为点击的页码
                this.sensorSearchArea.pageNum = val;
                this.loading = true;
                this.getSensorTableData()
            },

            //批量设置报警
            batchAlarm(type) {
                if (type == 'gateway') {
                    if (this.gatewayCheck.length == 0) {
                        this.$message.error('请先选择需要批量设置年限报警规则的网关!')
                    } else {
                        this.gerWarnOptionsData();
                        this.warnTitle = '批量设置网关年限报警规则';
                        this.warnVisible = true;
                    }
                } else {
                    if (this.sensorCheck.length == 0) {
                        this.$message.error('请先选择需要批量设置年限报警规则的传感器!')
                    } else {
                        this.gerWarnOptionsData();
                        this.warnTitle = '批量设置传感器年限报警规则';
                        this.warnVisible = true;
                    }
                }

            },
            //网关表格多选
            handleSelectionChange(val) {
                this.gatewayCheck = val;
            },
            //传感器多选
            sensorHandleSelectionChange(val) {
                this.sensorCheck = val;
            },
            //去详情页面
            goDetail(row, type) {
                this.$store.state.equipmentLifeData = row;

                this.$router.push({name: 'equipmentLifeDetail'});
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
        width: 60% !important;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }


    /*网关表格样式*/
    .gatewayTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }
</style>

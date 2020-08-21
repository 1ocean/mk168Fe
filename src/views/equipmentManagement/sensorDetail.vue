<template>
    <div class="content-wrapper detail" v-cloak>
        <!--        基本信息区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/equipmentManagement/sensorControl' }">传感器管理</el-breadcrumb-item>
            <el-breadcrumb-item>传感器详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    传感器编号：<span class="info-content" v-if="info.sensorCode&&info.sensorCode!=''">{{info.sensorCode}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    传感器类型：<span class="info-content" v-if="info.sensorType&&info.sensorType!=''">{{info.sensorType}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    所属网关：<span class="info-content" v-if="info.gatewayName&&info.gatewayName!=''">{{info.gatewayName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    传感器名称：<span class="info-content" v-if="info.sensorName&&info.sensorName!=''">{{info.sensorName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    传感器协议：<span class="info-content" v-if="info.sensorAgreementName&&info.sensorAgreementName!=''">{{info.sensorAgreementName}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
                <el-col :span="8">
                    最新数据采集时间：<span class="info-content" v-if="info.getDataTime&&info.getDataTime!=''">{{info.getDataTime}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="24">
                    轮询协议：<span class="info-content" v-if="info.pollAgreement&&info.pollAgreement!=''">{{JSON.parse(info.pollAgreement).join(',')}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    说明：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
                    <span class="info-content" v-else>-</span>
                </el-col>
            </el-row>
        </div>

        <el-divider></el-divider>

        <!--        测值区域-->
        <div class="title">测值信息
        </div>
        <el-collapse v-model="activeName" accordion @change="collapseChange">
            <el-collapse-item v-for="(item,index) in measurementData" :key="index" :name="index">
                <template slot="title">
                    <div class="flex-around" style="margin-left: 30px;">
                        <div class="measurementDataTitle">{{index+1}}</div>
                        <div class="measurementDataTitle">名称:{{item.sensorMeasureName}}</div>
                        <div class="measurementDataTitle">编号:{{item.sensorMeasureCode}}</div>
                        <div class="measurementDataTitle">
                            <el-button type="primary" size="mini" @click.stop="setWarn(item.sensorMeasureId,index)"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='sensor:setWarn')!=-1"
                            >设置报警
                            </el-button>
                            <el-button type="primary" size="mini" @click="historyCheck(index)"
                                       v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureStatistic:list')!=-1"
                            >历史查询
                            </el-button>
                        </div>
                    </div>
                </template>
                <div v-if="tabsDetailData.length==0" style="text-align: center;padding-top: 20px">
                    暂无数据
                </div>
                <div class="info" v-else style="padding-top: 20px">
                    <el-tabs v-model="tabsActiveName" type="card" @tab-click="tabsHandleClick">
                        <el-tab-pane v-for="(s,indexs) in tabsDetailData" :key="indexs" :label="s.warnRuleName"
                                     :name="s.checkIndex">
                            <div class="info">
                                <div class="smallTitle">报警规则</div>
                                <el-row :gutter="20" class="rowStyle">
                                    <el-col :span="8">
                                        触发条件：
                                        <span class="info-content" v-if="s.triggerConditionFe==0">数值等于{{s.firstValue}}</span>
                                        <span class="info-content" v-else-if="s.triggerConditionFe==1" >数值大于{{s.firstValue}}小于{{s.secondValue}}</span>
                                        <span class="info-content" v-else-if="s.triggerConditionFe==2">数值大于{{s.firstValue}}</span>
                                        <span class="info-content" v-else-if="s.triggerConditionFe==3">数值小于{{s.firstValue}}</span>
                                        <span v-else class="info-content">-</span>
                                    </el-col>
                                    <el-col :span="8">
                                        报警机制：<span v-if="s.warnMechanism==0">仅第一次推送</span><span v-if="s.warnMechanism==1">报警时间间隔{{s.pushInterval}}分钟</span>
                                        <span v-else class="info-content">-</span>
                                    </el-col>
                                </el-row>
                                <div class="smallTitle">推送内容</div>
                                <el-row :gutter="20" class="rowStyle">
                                    <el-col :span="8">
                                        推送方式：
                                        <span v-if="s.pushType">
                                            <span>微信 </span>
                                        </span>
                                        <span v-else>
                                                -
                                        </span>
                                    </el-col>
                                    <el-col :span="8">
                                        报警联系人：<span v-if="s.warnUserName==null||s.warnUserName==''">-</span>
                                        <span v-else>{{s.warnUserName}}</span>
                                    </el-col>
                                </el-row>
                                <div class="smallTitle">触发报警联动</div>
                                <el-row :gutter="20" class="rowStyle">
                                    <el-col :span="8">
                                        所属网关：<span v-if="s.triggerGatewayName==null||s.triggerGatewayName==''">-</span>
                                        <span v-else>{{s.triggerGatewayName}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        联动设备：<span
                                            v-if="s.triggerReverseEquipmentName==null||s.triggerReverseEquipmentName==''">-</span>
                                        <span v-else>{{s.triggerReverseEquipmentName}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        操作指令：<span
                                            v-if="s.triggerOperateOrderName==null||s.triggerOperateOrderName==''">-</span>
                                        <span v-else>{{s.triggerOperateOrderName}}</span>
                                    </el-col>
                                </el-row>
                                <div class="smallTitle">恢复正常联动</div>
                                <el-row :gutter="20" class="rowStyle">
                                    <el-col :span="8">
                                        所属网关：<span v-if="s.restoreGatewayName==null||s.restoreGatewayName==''">-</span>
                                        <span v-else>{{s.restoreGatewayName}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        联动设备：<span
                                            v-if="s.restoreReverseEquipmentName==null||s.restoreReverseEquipmentName==''">-</span>
                                        <span v-else>{{s.restoreReverseEquipmentName}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        操作指令：<span
                                            v-if="s.restoreOperateOrderName==null||s.restoreOperateOrderName==''">-</span>
                                        <span v-else>{{s.restoreOperateOrderName}}</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="button">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
        <el-dialog
                title="设置报警"
                :visible.sync="warnVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="handleClose">
            <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
                <el-tab-pane
                        v-for="(item, index) in editableTabs"
                        :key="item.name"
                        :label="item.warnRuleName"
                        :name="item.name"
                >
                    <el-form ref="form" :model="item" label-width="130px">
                        <span class="tag" style="top:30px;">*</span>
                        <el-form-item label="报警规则名称：">
                            <el-input size="small" type="text" v-model="item.warnRuleName"
                                      @blur="warnRuleNameChange(item.warnRuleName,index)"></el-input>
                        </el-form-item>
                        <span class="tag">*</span>
                        <el-form-item style="margin-top: -30px" label="触发条件：">
                            <el-select size="small" v-model="item.triggerCondition" placeholder="请选择"
                                       @change="changeTrigger(item.triggerCondition,index)">
                                <el-option label="数值等于A" value="0"></el-option>
                                <el-option label="数值大于A且小于B" value="1"></el-option>
                                <el-option label="数值大于A" value="2"></el-option>
                                <el-option label="数值小于A" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--                        <el-form-item v-if="item.triggerCondition==1">-->
                        <!--                            <el-slider-->
                        <!--                                    v-model="item.slider"-->
                        <!--                                    range-->
                        <!--                                    :marks="marks"-->
                        <!--                                    :format-tooltip="formatTooltip"-->
                        <!--                                    @change="sliderChange(item.slider,index)"-->
                        <!--                                    :min="100"-->
                        <!--                                    :max="10000">-->
                        <!--                            </el-slider>-->
                        <!--                        </el-form-item>-->
                        <el-form-item>
                            <div class="flex-between">
                                <div style="width: 50%" class="flex-around">
                                    <span>A:</span>
                                    <el-input-number size="small" type="number" style="width: 80%" v-model="item.firstValue"
                                                     controls-position="right" :min="-65536" :max="65536" placeholder="请输入A的值"
                                                     :precision="2" :step="0.1"
                                                     :controls="false">
                                    </el-input-number>
                                </div>
                                <div style="width: 50%" class="flex-around">
                                    <span style="padding-left: 5%" v-if="item.triggerCondition==1">B:</span>
                                    <el-input-number size="small" type="number" style="width: 80%"
                                                     v-model="item.secondValue"
                                                     controls-position="right" :min="-65536" :max="65536"
                                                     v-if="item.triggerCondition==1" placeholder="请输入B的值" :precision="2"
                                                     :step="0.1"
                                                     :controls="false">
                                    </el-input-number>
                                </div>
                            </div>
                        </el-form-item>
                        <span class="tag">*</span>
                        <el-form-item style="margin-top: -30px" label="报警机制：">
                            <div>
                                <el-radio v-model="item.warnMechanism" label="0">仅第一次推送</el-radio>
                            </div>
                            <el-radio v-model="item.warnMechanism" label="1">报警时间间隔</el-radio>
                            <el-input-number size="small" :disabled="item.warnMechanism=='0'" type="number"
                                             v-model="item.pushInterval" controls-position="right" :min="1" :max="100"
                                             onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                            <span style="margin-left: 20px">分钟</span>
                        </el-form-item>
                        <el-form-item label="是否推送：">
                            <el-switch v-model="item.warnRule"
                                       active-color="#13ce66"
                                       inactive-color="#666"
                            ></el-switch>
                        </el-form-item>
<!--                        <span class="tag" v-if="item.warnRule==true">*</span>-->
<!--                        <el-form-item style="margin-top: -30px" label="推送方式：" v-if="item.warnRule==true">-->
<!--                            <el-checkbox-group v-model="item.pushType">-->
<!--                                <el-checkbox label="0">微信</el-checkbox>-->
<!--                                <el-checkbox label="1">短信</el-checkbox>-->
<!--                                <el-checkbox label="2">APP</el-checkbox>-->
<!--&lt;!&ndash;                                <el-checkbox label="3">邮箱</el-checkbox>&ndash;&gt;-->
<!--                            </el-checkbox-group>-->
<!--                        </el-form-item>-->
                        <span class="tag" v-if="item.warnRule==true">*</span>
                        <el-form-item style="margin-top: -30px" label="报警联系人：" v-if="item.warnRule==true">
                            <el-select v-model="item.warnUser" clearable size="small" multiple placeholder="请选择">
                                <el-option
                                        v-for="items in warnUserOptions"
                                        :key="items.value"
                                        :label="items.label"
                                        :value="items.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="触发报警联动：">
                            <el-switch v-model="item.trigger"
                                       active-color="#13ce66"
                                       inactive-color="#666"
                            ></el-switch>
                        </el-form-item>
                        <span class="tag" v-if="item.trigger==true">*</span>
                        <el-form-item style="margin-top: -30px" label="操作指令：" v-if="item.trigger==true">
                            <el-cascader
                                    size="small"
                                    v-model="item.triggerOrderId"
                                    :options="options"
                                    clearable
                            >
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="恢复正常联动：">
                            <el-switch v-model="item.restore"
                                       active-color="#13ce66"
                                       inactive-color="#666"
                            ></el-switch>
                        </el-form-item>
                        <span v-if="item.restore==true" class="tag">*</span>
                        <el-form-item style="margin-top: -30px" label="操作指令：" v-if="item.restore==true">
                            <el-cascader
                                    size="small"
                                    v-model="item.restoreOrderId"
                                    :options="options"
                                    clearable
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="warnCancel">取 消</el-button>
                <el-button type="primary" @click="warnSure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "sensorDetail",
        data() {
            return {
                //当前选择的测值id
                nowSensorMeasureId: '',
                //当前选中的tab
                editableTabsValue: '0',
                tabIndex: 0,
                //折叠面板当前选中
                activeName: 0,
                //折叠面板当前选中
                tabsActiveName: 0,
                //基本信息数据
                info: {},
                //设置报警弹窗
                warnVisible: false,
                //测值信息
                measurementData: [],
                //tabs内部form数据
                editableTabs: [{
                    name: '0',
                    sensorMeasureId: '',
                    triggerOrderIdfield: '',
                    restoreOrderId: [],
                    restore: false,
                    triggerOrderId: [],
                    trigger: false,
                    warnMechanism: '0',
                    warnRuleName: '',
                    warnRule: false,
                    triggerCondition: '0',
                    firstValue: 1,
                    secondValue: 1.01,
                    pushMechanism: '',
                    pushInterval: 1,
                    pushType: '0',
                    // slider: [0,0],
                    warnUser: []
                }],
                //报警联系人
                warnUserOptions: [],
                //操作指令数据
                options: [],
                //展示滑块的数据
                marks: {
                    2500: '25',
                    5000: {
                        style: {
                            color: '#1989FA'
                        },
                        label: this.$createElement('strong', '50')
                    },
                    7500: '75'
                },
                //折叠面板内部用来展示报警详细规则的数据
                tabsDetailData: [],
                //保存当前选的是哪一个测值
                nowWarnIndex:0
            }
        },
        created() {
            // this.$parent.ceshi();
            this.$store.state.nowName = '传感器详情';
            //将从传感器带来的当前传感器数据赋值
            this.info = this.$store.state.sensorData;
            this.getMeasurementData();
            this.getUsedData();

        },
        methods: {
            //tabs新增删减
            handleTabsEdit(targetName, action) {
                if (action === 'add') {
                    //在新增时做判断当前在规则下是否全部填写完成
                    for (let i in this.editableTabs) {
                        let s = this.editableTabs[i];
                        if (s.warnRuleName == '') {
                            this.$message.error(`请填写${s.warnRuleName}报警规则名称`);
                            return;
                        } else if (s.warnRule && s.warnUser.length == 0) {
                            this.$message.error(`请选择${s.warnRuleName}报警联系人`);
                            return;
                        } else if (s.trigger && s.triggerOrderId.length == 0) {
                            this.$message.error(`请选择${s.warnRuleName}触发报警联动的操作指令`);
                            return;
                        } else if (s.restore && s.restoreOrderId.length == 0) {
                            this.$message.error(`请选择${s.warnRuleName}恢复正常联动的操作指令`);
                            return;
                        }
                    }
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        //新数据里面每个都放个name用来tabs定位
                        name: newTabName,
                        sensorMeasureId: '',
                        triggerOrderIdfield: '',
                        restoreOrderId: [],
                        restore: false,
                        triggerOrderId: [],
                        trigger: false,
                        warnMechanism: '0',
                        warnRuleName: '',
                        warnRule: false,
                        triggerCondition: '0',
                        firstValue: 1,
                        secondValue: 1,
                        pushMechanism: '',
                        pushInterval: 1,
                        pushType:'0',
                        warnUser: []
                    });
                    this.editableTabsValue = newTabName;

                }
                if (action === 'remove') {
                    this.$confirm('确认删除此报警规则吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let tabs = this.editableTabs;
                        let activeName = this.editableTabsValue;
                        if (activeName === targetName) {
                            tabs.forEach((tab, index) => {
                                if (tab.name === targetName) {
                                    let nextTab = tabs[index + 1] || tabs[index - 1];
                                    if (nextTab) {
                                        activeName = nextTab.name;
                                    }
                                }
                            });
                        }
                        this.editableTabsValue = activeName;
                        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                    }).catch(() => {
                    });

                }
            },
            //获取报警联系人，以及操作指令数据
            getUsedData() {
                this.$axios({
                    url: this.$BaseUrl + '/user/getWarnUserList',
                    method: 'post',

                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        for (let i in res.data.data) {
                            this.warnUserOptions.push({label: res.data.data[i].name, value: res.data.data[i].userId});
                        }
                    }
                });
                this.$axios({
                    url: this.$BaseUrl + '/sensor/getOperateOrderList',
                    method: 'post',
                    data: {
                        structureId: this.info.structureId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.options = res.data.data;
                    }
                })
            },
            //获取测值数据
            getMeasurementData() {
                this.$axios({
                    url: this.$BaseUrl + '/sensor/getMeasureListBySensorId',
                    method: 'post',
                    data: {
                        sensorId: this.info.sensorId
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.measurementData = res.data.data;
                        // for (let i in this.measurementData){
                        //     if (i==0){
                        //         this.measurementData[i].nowStatus=true
                        //     }else {
                        //         this.measurementData[i].nowStatus=false
                        //     }
                        // }
                        this.collapseChange(0)
                    }

                })
            },

            //设置报警
            setWarn(id,index) {
                //保存当前选的是哪一个测值
                this.nowWarnIndex=index;

                this.nowSensorMeasureId = id;
                this.$axios({
                    url: this.$BaseUrl + '/sensor/getMeasureWarnRuleList',
                    method: 'post',
                    data: {
                        sensorMeasureId: id
                    }
                }).then((res) => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            let data = res.data.data;
                            for (let i in data) {
                                //新数据里面每个都放个name用来tabs定位
                                //因为推送三个值都是必填，所以只要其中一个有值推送开关就是打开状态
                                data[i].name = i + '';
                                if (data[i].warnUser != null && data[i].warnUser != '' && data[i].pushType != null && data[i].pushType != '') {
                                    data[i].warnUser = data[i].warnUser.split(',');
                                    // data[i].pushType = data[i].pushType.split(',');
                                    for (let s in data[i].warnUser) {
                                        data[i].warnUser[s] = parseInt(data[i].warnUser[s])
                                    }
                                    data[i].warnRule = true;
                                } else {
                                    data[i].warnUser = [];
                                    data[i].pushType = '0';
                                }
                                let rest = data[i].restoreOrderId;
                                //将两个级联框置空，再将网关id，设备id，操控指令id依次放进去
                                data[i].restoreOrderId = [];
                                if (data[i].restoreGatewayId != null && data[i].restoreGatewayId != '' && data[i].restoreReverseEquipmentId != null && data[i].restoreReverseEquipmentId != '' && rest != null && rest != '') {
                                    data[i].restoreOrderId.push(data[i].restoreGatewayId);
                                    data[i].restoreOrderId.push(data[i].restoreReverseEquipmentId);
                                    data[i].restoreOrderId.push(rest);
                                    //判断恢复正常联动开关是否打开
                                    data[i].restore = true;
                                }
                                let trigger = data[i].triggerOrderId;
                                data[i].triggerOrderId = [];
                                if (data[i].triggerGatewayId != null && data[i].triggerGatewayId != '' && data[i].triggerReverseEquipmentId != null && data[i].triggerReverseEquipmentId != '' && trigger != null && trigger != '') {
                                    data[i].triggerOrderId.push(data[i].triggerGatewayId);
                                    data[i].triggerOrderId.push(data[i].triggerReverseEquipmentId);
                                    data[i].triggerOrderId.push(trigger);
                                    //判断触发报警联动开关是否打开
                                    data[i].trigger = true;
                                }
                                //后端发的triggerCondition，warnMechanism是数字类型，需要改成字符串
                                data[i].triggerCondition = data[i].triggerConditionFe + '';
                                data[i].warnMechanism = data[i].warnMechanism + '';
                            }
                            //有的情况下tabIndex设置为length-1
                            this.tabIndex = data.length - 1;
                            this.editableTabs = data;
                        } else {
                            this.editableTabs = [{
                                name: '0',
                                sensorMeasureId: '',
                                triggerOrderIdfield: '',
                                restoreOrderId: [],
                                restore: false,
                                triggerOrderId: [],
                                trigger: false,
                                warnMechanism: '0',
                                warnRuleName: '',
                                warnRule: false,
                                triggerCondition: '0',
                                firstValue: 1,
                                secondValue: 1.01,
                                pushMechanism: '',
                                pushInterval: 1,
                                pushType: '0',
                                warnUser: []
                            }];
                            //没有的情况下tabIndex设置为0
                            this.tabIndex = 0; //将tabs设置为第一位

                        }
                        this.editableTabsValue = '0';
                        this.warnVisible = true;
                    }
                });

            },
            //数据清除
            clear() {
                this.editableTabs = [{
                    name: '0',
                    sensorMeasureId: '',
                    triggerOrderIdfield: '',
                    restoreOrderId: [],
                    restore: false,
                    triggerOrderId: [],
                    trigger: false,
                    warnMechanism: '0',
                    warnRuleName: '',
                    warnRule: false,
                    triggerCondition: '0',
                    firstValue: 1,
                    secondValue: 1.01,
                    pushMechanism: '',
                    pushInterval: 1,
                    pushType: '0',
                    warnUser: []
                }];
                this.editableTabsValue = '0';
                this.tabIndex = 0;
            },
            //设置报警弹窗关闭
            handleClose(done) {
                this.clear();
                done();
            },
            //报警取消
            warnCancel() {
                this.warnVisible = false;
                this.clear();
            },
            //报警确认
            warnSure() {
                let data = _.cloneDeep(this.editableTabs);
                //遍历发送数据，验证数据有用性
                for (let i in data) {
                    data[i].sensorMeasureId = this.nowSensorMeasureId;
                    if (data[i].warnRuleName == '') {
                        this.$message.error(`请填写${data[i].warnRuleName}报警规则名称`);
                        return;
                    }
                    if (data[i].triggerCondition == '0') {
                        data[i].secondValue = '';
                        data[i].triggerConditionFe = 0;
                    } else if (data[i].triggerCondition == '1'){
                        if (data[i].secondValue <= data[i].firstValue) {
                            this.$message.error(`${data[i].warnRuleName}的B应大于A`);
                            return;
                        }
                        data[i].triggerConditionFe = 1;
                    }else if (data[i].triggerCondition == '2') {
                        data[i].triggerCondition = 1;
                        data[i].secondValue = 65535;
                        data[i].triggerConditionFe = 2;
                    } else if (data[i].triggerCondition == '3') {
                        data[i].triggerCondition = 1;
                        data[i].secondValue = -65535;
                        data[i].triggerConditionFe = 3;
                    }

                    if (data[i].warnRule && data[i].warnUser.length == 0) {
                        this.$message.error(`请选择${data[i].warnRuleName}报警联系人`);
                        return;
                    } else {
                        data[i].warnUser.length != 0 ? data[i].warnUser = data[i].warnUser.join(',') : data[i].warnUser = '';

                    }
                    if (data[i].trigger && data[i].triggerOrderId.length == 0) {
                        this.$message.error(`请选择${data[i].warnRuleName}触发报警联动的操作指令`);
                        return;
                    } else {
                        data[i].triggerOrderId.length != 0 ? data[i].triggerOrderId = data[i].triggerOrderId[data[i].triggerOrderId.length - 1] : data[i].triggerOrderId = '';
                    }
                    //开关关闭需要清空数据
                    if (!data[i].trigger) {
                        data[i].triggerOrderId = ''
                    }
                    if (!data[i].restore) {
                        data[i].triggerOrderId = ''
                    }
                    if (!data[i].warnRule) {
                        data[i].pushType = '';
                        data[i].warnUser = '';
                    }
                    if (data[i].restore && data[i].restoreOrderId.length == 0) {
                        this.$message.error(`请选择${data[i].warnRuleName}恢复正常联动的操作指令`);
                        return;
                    } else {
                        data[i].restoreOrderId.length != 0 ? data[i].restoreOrderId = data[i].restoreOrderId[data[i].restoreOrderId.length - 1] : data[i].restoreOrderId = '';
                    }

                    //当报警机制为第一个时 清空间隔时间
                    if (data[i].warnMechanism == '0') {
                        data[i].pushInterval = ''
                    }
                }
                if (this.editableTabs.length == 0) {
                    this.$confirm('确认清除报警规则?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios({
                            url: this.$BaseUrl + '/sensor/delSensorWarn',
                            method: 'post',
                            data: {
                                sensorMeasureId: this.nowSensorMeasureId
                            }
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '清除成功!'
                                });
                                this.warnVisible = false;
                                this.clear();
                                this.collapseChange(this.nowWarnIndex)
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消清除'
                        });
                    });

                } else {
                    this.$axios({
                        url: this.$BaseUrl + '/sensor/setSensorWarn',
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
                            this.warnVisible = false;
                            this.clear();
                            this.collapseChange(this.nowWarnIndex)
                        }
                    })
                }
            },
            //触发条件变化时
            changeTrigger(value, index) {
                if (value === '0') {
                    this.editableTabs[index].firstValuedValue = 1.00;
                    this.editableTabs[index].secondValue = ''
                } else {
                    this.editableTabs[index].firstValuedValue = 1.00;
                    this.editableTabs[index].secondValue = 1.01
                }
            },
            //当前tabs名称改变
            warnRuleNameChange(value, index) {

            },
            //触发条件变化时
            checkNumber(value, index, type) {
                //检查是不是数字
                //原本有滑块功能但是发现不能双向绑定 所以废弃
                let reg = /^(\+|\-)?((([1-9]([0-9]*))|0)(\.[0-9]{0,2})?)?$/;
                if (reg.test(value)) {
                    if (type === 1) {
                        if (this.editableTabs[index].triggerCondition == 1 && value >= this.editableTabs[index].secondValue) {
                            this.$message.error('开始值应比结束值小');
                            this.editableTabs[index].firstValue = 1;
                        } else {
                            this.editableTabs[index].firstValue = value;
                        }

                    } else {
                        if (this.editableTabs[index].triggerCondition == 1 && value <= this.editableTabs[index].firstValue) {
                            this.$message.error('结束值应比开始值大');
                            this.editableTabs[index].secondValue = this.editableTabs[index].firstValue + 1;
                        } else {
                            this.editableTabs[index].secondValue = value;
                        }

                    }
                } else {
                    if (type === 1) {
                        this.editableTabs[index].firstValue = 1.00;
                        // this.editableTabs[index].slider[0]=100
                    } else {
                        this.editableTabs[index].secondValue = 1.01;
                        // this.editableTabs[index].slider[1]=100
                    }
                }

            },
            //折叠面板点击触发方法
            collapseChange(val) {
                if (val !== '') {
                    this.$axios({
                        url: this.$BaseUrl + '/sensor/getMeasureWarnRuleList',
                        method: 'post',
                        data: {
                            sensorMeasureId: this.measurementData[val].sensorMeasureId
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            if (res.data.data != null) {
                                this.tabsDetailData = res.data.data;
                                //为tabs添加唯一标识，tabindex用的
                                for (let i in this.tabsDetailData) {
                                    this.tabsDetailData[i].checkIndex = i + '';
                                }

                            } else {
                                this.tabsDetailData = []
                            }
                            //初始化内部tabindex
                            this.tabIndex = 0;
                        }
                    })
                }
            },
            //折叠面板内部的tabs变化
            tabsHandleClick(tab, event) {
            },
            //历史查询
            historyCheck(index) {
                this.$store.state.defaultActive = '/statisticAnalysis/originalAnalyze';
                this.$router.push({
                    name: 'originalAnalyze',
                    params: {treeId: this.info.sensorId, sensorMeasureId: this.measurementData[index].sensorMeasureId}
                })
            },
            //返回上一页
            goBack() {
                this.$router.push('/equipmentManagement/sensorControl');
            }
            // //slider数值变化
            // sliderChange(value,index){
            //     this.editableTabs[index].firstValue=value[0]/100;
            //     this.editableTabs[index].secondValue=value[1]/100;
            // },
            // //为slider保留两位小数
            // formatTooltip(val) {
            //     return val / 100;
            // }
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

    /*中标题样式*/
    .title {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0;
    }
    /*小标题样式*/
    .smallTitle {
        font-size: 18px;
        margin: 20px 0;
    }
    /*基本信息*/
    .info {
        font-size: 15px;
        color: rgb(49, 49, 51);
        padding-top: 20px
    }

    /*基本信息每行样式*/
    .rowStyle {
        margin: 15px 0;
    }

    /*最外层样式*/
    .detail {
        overflow-y: auto;
    }

    /*折叠面板title*/
    .measurementDataTitle {
        width: 200px;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-select {
        width: 100%;
    }

    /*设置弹出框内select宽度为100%*/
    .content-wrapper >>> .el-slider__runway {
        width: 98%;
    }

    /*测值样式*/
    .content-wrapper >>> .el-input-number {
        width: 120px;
    }
    /*详细内容样式*/
    .info-content {
        color: #666;
    }
    /*底部button样式*/
    .button {
        width: 100%;
        margin-top: 100px;
        text-align: center;
    }
</style>

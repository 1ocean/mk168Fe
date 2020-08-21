<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="120px">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="所属项目/现场：">
                        <el-cascader
                                size="small"
                                v-model="searchArea.psId"
                                :props="props"
                                @change="cascaderChange"
                                clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="网关名称：">
                        <el-input v-model="searchArea.gatewayName" size="small" placeholder="请输入网关名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="网关编号：">
                        <el-input v-model="searchArea.gatewayCode" size="small" placeholder="请输入网关编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="6">-->
                <!--                    <el-form-item label="网关类型：">-->
                <!--                        <el-select v-model="searchArea.gatewayType" size="small" clearable placeholder="请选择">-->
                <!--                            <el-option label="网口" value="1"></el-option>-->
                <!--                            <el-option label="DTU" value="0"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->

                <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="状态：">
                        <el-select v-model="searchArea.gatewayState" size="small" clearable placeholder="请选择">
                            <el-option label="在线" value="1"></el-option>
                            <el-option label="离线" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">

                    <el-form-item label="采集方式：">
                        <el-select v-model="searchArea.collectType" size="small" clearable placeholder="请选择">
                            <el-option label="主动" value="1"></el-option>
                            <el-option label="被动" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item style="margin-left:40px">
                        <el-button type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:add')!=-1"
                                   @click="gatewayControl('add')">新增网关
                        </el-button>
                        <el-button style="margin-left: 20px" type="primary" size="small"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:setWarn')!=-1"
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
                        label="网关图片"
                        width="140">
                    <template slot-scope="scope">
                        <img :src="$url+scope.row.gatewayImg" alt="" width="65" height="65">
                    </template>
                </el-table-column>
                <el-table-column
                        label="网关编号"
                        width="140">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.gatewayCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="gatewayName"
                        label="网关名称"
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
                        label="采集方式"
                        width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.collectType==1">主动</span>
                        <span v-else>被动</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="collectCycleName"
                        label="采集时长"
                        min-width="160">
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        prop="sensorNum"-->
                <!--                        label="传感器数量"-->
                <!--                        width="100">-->
                <!--                </el-table-column>-->
                <!--                <el-table-column-->
                <!--                        prop="reverseEquipmentNum"-->
                <!--                        label="控制设备数量"-->
                <!--                        min-width="120">-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="maxOfLineTimeName"
                        label="最大离线时长"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row. gatewayState==1"><span style="color: rgb(0,168,84)">●</span> 在线</span>
                        <span v-else><span style="color: rgb(240,65,52)">●</span> 离线</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:del')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:setWarn')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:update')!=-1"
                                @click="gatewayControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:del')!=-1"
                                @click="gatewayDelete(scope.$index, scope.row)">删除
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
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gateway:setWarn')!=-1"
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
                :title="gatewayTitle"
                :visible.sync="gatewayVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="gatewayHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="所属现场：" v-show="gatewayTitle=='新增网关'" prop="structureId">
                    <el-cascader
                            size="small"
                            v-model="ruleForm.structureId"
                            :props="structureProps"
                            clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属现场：" v-show="gatewayTitle=='编辑网关'">
                    <el-input size="small" v-model="ruleForm.structureName" disabled></el-input>
                </el-form-item>
                <el-form-item label="网关名称：" prop="gatewayName">
                    <el-input size="small" v-model="ruleForm.gatewayName"></el-input>
                </el-form-item>
                <el-form-item label="网关编号：" prop="gatewayCode">
                    <el-input size="small" v-model="ruleForm.gatewayCode" :disabled="gatewayEdit"></el-input>
                </el-form-item>
                <el-form-item label="网关类型：" v-show="false">
                    <el-radio v-model="ruleForm.gatewayType" label="0">DTU</el-radio>
                    <!--                    <el-radio v-model="ruleForm.gatewayType" label="1">网口</el-radio>-->
                </el-form-item>
                <el-form-item v-if="ruleForm.gatewayType!=''&&ruleForm.gatewayType==='0'" label="网关型号："
                              prop="dtuModel">
                    <el-input size="small" v-model="ruleForm.dtuModel"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.gatewayType!=''&&ruleForm.gatewayType==='1'" label="IP地址：">
                    <el-input size="small" v-model="ruleForm.ipAddress"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.collectType!=''&&ruleForm.gatewayType==='1'" label="端口号：">
                    <el-input-number size="small" v-model="ruleForm.port" controls-position="right" :min="0"
                                     :max="99999"
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                </el-form-item>
                <el-form-item label="采集方式：">
                    <el-radio v-model="ruleForm.collectType" label="1" :disabled="gatewayEdit">主动式</el-radio>
                    <el-radio v-model="ruleForm.collectType" label="0" :disabled="gatewayEdit">被动式</el-radio>
                </el-form-item>
                <el-form-item v-if="ruleForm.collectType!=''" label="网关协议：" prop="gatewayAgreementId">
                    <el-select v-model="ruleForm.gatewayAgreementId" size="small" clearable placeholder="请选择"
                               :disabled="gatewayEdit">
                        <el-option
                                v-for="item in gatewayOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <span class="tag" style="left: 28px;top: 10px">*</span>
                <el-form-item style="margin-top: -20px" label="采样时长：">
                    <div class="flex-between">
                        <el-input-number size="small" v-model="ruleForm.collectCycle" controls-position="right" :min="0"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">时</span>
                        <el-input-number size="small" v-model="ruleForm.collectCycle2" controls-position="right"
                                         :min="0" :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">分</span>
                        <el-input-number size="small" v-model="ruleForm.collectCycle3" controls-position="right"
                                         :min="0" :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">秒</span>
                    </div>
                </el-form-item>
                <span class="tag" style="left:0">*</span>
                <el-form-item style="margin-top: -30px" label="最大离线时长：">
                    <div class="flex-between">
                        <el-input-number size="small" v-model="ruleForm.maxOfLineTime" controls-position="right"
                                         :min="0"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">时</span>
                        <el-input-number size="small" v-model="ruleForm.maxOfLineTime2" controls-position="right"
                                         :min="0"
                                         :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">分</span>
                        <el-input-number size="small" v-model="ruleForm.maxOfLineTime3" controls-position="right"
                                         :min="0"
                                         :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">秒</span>
                    </div>
                </el-form-item>
                <!--                <el-form-item label="时间校准：">-->
                <!--                    <el-input v-model="ruleForm.timeAgreement"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="SIM卡号：">-->
                <!--                    <el-input v-model="ruleForm.simCard"></el-input>-->
                <!--                </el-form-item>-->
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.remark" maxlength="255"></el-input>
                </el-form-item>
                <el-form-item v-if="gatewayTitle==='编辑网关'" label="原网关图：">
                    <img :src="this.$url+ruleForm.gatewayImg" class="structureImg" alt="文件不存在" width="148px"
                         height="148px">
                </el-form-item>
                <el-form-item label="上传网关图：">
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
            <el-button @click="gatewayCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="gatewaySure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="下发指令"
                :visible.sync="instructionsVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="instructionsHandleClose">
            <el-form :model="instructionsRuleForm" :rules="instructionsRules" ref="instructionsRuleForm"
                     label-width="100px" class="demo-ruleForm">
                <el-form-item label="指令类别：" prop="instructionsType">
                    <el-radio v-model="instructionsRuleForm.instructionsType" label="0">字符串</el-radio>
                    <el-radio v-model="instructionsRuleForm.instructionsType" label="1">十六进制</el-radio>
                </el-form-item>
                <el-form-item label="指令内容：" prop="instructionsContent">
                    <el-input type="textarea" v-model="instructionsRuleForm.instructionsContent"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="instructionsCancel('instructionsRuleForm')">取 消</el-button>
            <el-button type="primary" @click="instructionsSure('instructionsRuleForm')">确 定</el-button>
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
        name: "gatewayManagement",
        data() {
            let that = this;
            return {
                //搜索区域
                searchArea: {
                    gatewayName: '',
                    gatewayCode: '',
                    gatewayType: '',
                    collectType: '',
                    gatewayState: '',
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
                nowGatewayId: '',
                //控制下发指令弹窗显示
                instructionsVisible: false,
                //表格选中
                alramCheck: [],
                //用来展示选取图片的地址
                imageUrl: '',
                //存储文件内容
                imgFile: '',
                //批量选择当前选中的所有网关的id
                projectCheck: [],
                //新增/编辑网关 数据
                ruleForm: {
                    projectId: '',
                    structureId: '',
                    gatewayName: '',
                    gatewayCode: '',
                    gatewayType: '0',
                    collectType: '0',
                    gatewayAgreementId: '',
                    collectCycle: '',
                    collectCycle2: '',
                    collectCycle3: '',
                    maxOfLineTime: '',
                    maxOfLineTime2: '',
                    maxOfLineTime3: '',
                    dtuModel: '',
                    ipAddress: '',
                    port: '',
                    timeAgreement: '',
                    simCard: '',
                    gatewayImg: '',
                    structureName: '',
                    remark: '',
                },
                //新增/编辑网关 数据规则
                rules: {
                    structureId: [
                        {required: true, message: '请选择所属现场', trigger: 'change'}
                    ],
                    gatewayName: [
                        {required: true, message: '请输入网关名称', trigger: 'blur'}
                    ],
                    gatewayCode: [
                        {required: true, message: '请输入网关编号', trigger: 'blur'}
                    ],
                    gatewayAgreementId: [
                        {required: true, message: '请选择网关协议', trigger: 'change'}
                    ],

                },
                //用来检查网关上传图片格式得
                imgCheck: true,
                //网关编辑时不可修改得元素
                gatewayEdit: false,
                //下发指令数据
                instructionsRuleForm: {
                    instructionsType: '0',
                    instructionsContent: ''
                },
                //下发指令规则
                instructionsRules: {
                    instructionsType: [
                        {required: true, message: '请选择指令类别', trigger: 'change'}
                    ],
                    instructionsContent: [
                        {required: true, message: '请输入指令内容', trigger: 'blur'}
                    ]
                },
                //设置报警title
                warnTitle: '',
                //控制设置报警显示
                warnVisible: false,
                //下发指令数据
                warnRuleForm: {
                    gatewayId: '',
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
                //网关协议 数据
                gatewayOptions: [],
                //新增/编辑网关 title
                gatewayTitle: '',
                //新增/编辑网关 弹窗显示
                gatewayVisible: false,
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
                structureProps: {
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
                //当前选择得下发指令得数据
                nowInstructionsData: {}

            }
        },
        created() {
            this.$store.state.nowName = '智能网关';
            this.getTableData();
            this.getGatewayData();
        },
        methods: {
            //获取网关协议数据
            getGatewayData() {
                this.$axios({
                    url: this.$BaseUrl + '/agreement/getPageList',
                    method: 'post',
                    data: {
                        agreementType: 0
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayOptions = [];
                        for (let i in res.data.data.list) {
                            this.gatewayOptions.push({
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
                }
                this.$axios({
                    url: this.$BaseUrl + '/gateway/getPageList',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if (res.data.data != null) {
                            this.tableData = res.data.data.list;
                            for (let i in this.tableData) {
                                this.tableData[i].maxOfLineTimeName = this.showCountTime(this.tableData[i].maxOfLineTime);
                                this.tableData[i].collectCycleName = this.showCountTime(this.tableData[i].collectCycle)
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
                this.searchArea.gatewayName = '';
                this.searchArea.gatewayCode = '';
                this.searchArea.gatewayType = '0';
                this.searchArea.collectType = '';
                this.searchArea.gatewayState = '';
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
            //网关新增/编辑
            gatewayControl(type, row) {

                if (type === 'add') {
                    this.gatewayTitle = '新增网关';
                    this.ruleForm.gatewayCode = this.$round.random('G');
                } else {
                    this.gatewayEdit = true;
                    //当前网关id
                    this.nowGatewayId = row.gatewayId;
                    let collectCycleNum = this.countTime(row.collectCycle);
                    let collectCycle = collectCycleNum[0];
                    let collectCycle2 = collectCycleNum[1];
                    let collectCycle3 = collectCycleNum[2];
                    let maxOfLineTimeNum = this.countTime(row.maxOfLineTime);
                    let maxOfLineTime = maxOfLineTimeNum[0];
                    let maxOfLineTime2 = maxOfLineTimeNum[1];
                    let maxOfLineTime3 = maxOfLineTimeNum[2];
                    this.gatewayTitle = '编辑网关';
                    this.ruleForm.projectId = row.projectId;
                    this.ruleForm.structureId = row.structureId;
                    this.ruleForm.remark = row.remark;
                    this.ruleForm.gatewayName = row.gatewayName;
                    this.ruleForm.gatewayCode = row.gatewayCode;
                    this.ruleForm.gatewayType = row.gatewayType == 0 ? '0' : '1';
                    this.ruleForm.collectType = row.collectType == 0 ? '0' : '1';
                    this.ruleForm.gatewayAgreementId = row.gatewayAgreementId;
                    this.ruleForm.collectCycle = collectCycle;
                    this.ruleForm.collectCycle2 = collectCycle2;
                    this.ruleForm.collectCycle3 = collectCycle3;
                    this.ruleForm.maxOfLineTime = maxOfLineTime;
                    this.ruleForm.maxOfLineTime2 = maxOfLineTime2;
                    this.ruleForm.maxOfLineTime3 = maxOfLineTime3;
                    this.ruleForm.dtuModel = row.dtuModel;
                    this.ruleForm.structureName = row.structureName;
                    this.ruleForm.ipAddress = row.ipAddress;
                    this.ruleForm.port = row.port;
                    this.ruleForm.timeAgreement = row.timeAgreement;
                    this.ruleForm.simCard = row.simCard;
                    this.ruleForm.gatewayImg = row.gatewayImg;
                }

                this.gatewayVisible = true;
            },
            //网关删除
            gatewayDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/gateway/delGateway',
                        method: 'post',
                        data: {
                            gatewayId: row.gatewayId,
                            gatewayCode: row.gatewayCode,
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
                    this.$message.error('请先选择需要批量设置报警的网关!')
                } else {
                    this.gerWarnOptionsData();
                    this.warnTitle = '批量设置报警';
                    this.warnVisible = true;
                    this.projectCheck = [];
                    for (let i in this.alramCheck) {
                        this.projectCheck.push(this.alramCheck[i].gatewayId)
                    }
                }
            },
            //表格多选
            handleSelectionChange(val) {
                this.alramCheck = val;
            },
            //新增/编辑窗口右上角关闭
            gatewayHandleClose(done) {
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
                this.gatewayClear();
                done();
            },
            //下发指令窗口右上角关闭
            instructionsHandleClose() {
                this.instructionsRuleForm.instructionsContent = '';
                this.instructionsRuleForm.instructionsType = '0';
                this.instructionsVisible = false;
            },
            //
            //设置报警右上角窗口关闭
            warnHandleClose() {
                this.warnRuleForm.pushType = '0';
                this.warnRuleForm.warnUser = '';
                this.warnVisible = false;
            },
            //新增/编辑网关数据清除
            gatewayClear() {
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);

                this.ruleForm.structureId = '';
                this.ruleForm.remark = '';
                this.ruleForm.gatewayName = '';
                this.ruleForm.gatewayCode = '';
                this.ruleForm.projectId = '';
                this.ruleForm.gatewayType = '0';
                this.ruleForm.collectType = '0';
                this.ruleForm.gatewayAgreementId = '';
                this.ruleForm.collectCycle = '';
                this.ruleForm.collectCycle2 = '';
                this.ruleForm.collectCycle3 = '';
                this.ruleForm.maxOfLineTime = '';
                this.ruleForm.maxOfLineTime2 = '';
                this.ruleForm.maxOfLineTime3 = '';
                this.ruleForm.dtuModel = '';
                this.ruleForm.structureName = '';
                this.ruleForm.ipAddress = '';
                this.ruleForm.port = '';
                this.ruleForm.timeAgreement = '';
                this.ruleForm.simCard = '';
                this.imgFile = '';
                this.imageUrl = '';
                this.gatewayEdit = false;
                this.gatewayVisible = false;
            },
            //新增/编辑网关窗口取消
            gatewayCancel() {

                this.gatewayClear();
            },
            //新增/编辑网关窗口确认
            gatewaySure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        let collectCycle = this.ruleForm.collectCycle * 3600 + this.ruleForm.collectCycle2 * 60 + this.ruleForm.collectCycle3;
                        let maxOfLineTime = this.ruleForm.maxOfLineTime * 3600 + this.ruleForm.maxOfLineTime2 * 60 + this.ruleForm.maxOfLineTime3;
                        if (maxOfLineTime <= 0) {
                            this.$message.error('最大离线时长不能为0');
                            return;
                        }
                        if (this.ruleForm.gatewayType == 0) {
                            formData.set('dtuModel', this.ruleForm.dtuModel);
                            formData.set('ipAddress', '');
                            formData.set('port', '');
                        } else {
                            formData.set('dtuModel', '');
                            let ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                            if (ip.test(this.ruleForm.ipAddress)) {
                                formData.set('ipAddress', this.ruleForm.ipAddress);
                            } else {
                                this.$message.error('请输入正确得IP地址');
                                return;
                            }
                            formData.set('port', this.ruleForm.port);
                        }
                        formData.set('gatewayAgreementId', this.ruleForm.gatewayAgreementId);
                        if (collectCycle <= 0) {
                            this.$message.error('采样时长不能为0');
                            return;
                        }
                        formData.set('collectCycle', collectCycle);
                        let url = '';
                        if (this.gatewayTitle == '编辑网关') {
                            formData.set('gatewayId', this.nowGatewayId);
                            url = this.$BaseUrl + '/gateway/updateGateway';
                            formData.set('structureId', this.ruleForm.structureId);
                            formData.set('structureId', this.ruleForm.structureId);
                        } else {
                            url = this.$BaseUrl + '/gateway/addGateway';
                            formData.set('structureId', this.ruleForm.structureId[1]);
                        }
                        formData.set('gatewayCode', this.ruleForm.gatewayCode);
                        formData.set('gatewayName', this.ruleForm.gatewayName);
                        formData.set('gatewayType', this.ruleForm.gatewayType);
                        formData.set('collectType', this.ruleForm.collectType);
                        formData.set('remark', this.ruleForm.remark);
                        formData.set('maxOfLineTime', maxOfLineTime);
                        formData.set('timeAgreement', this.ruleForm.timeAgreement);
                        formData.set('simCard', this.ruleForm.simCard);
                        formData.set('gatewayImg', this.imgFile != '' ? this.imgFile : '');
                        this.$axios({
                            url: url,
                            method: 'post',
                            data: formData
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                if (this.gatewayTitle == '新增网关') {
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

                                this.gatewayClear();
                            }
                        })

                    } else {

                    }
                })
            },
            //下发指令窗口取消
            instructionsCancel() {
                this.instructionsRuleForm.instructionsContent = '';
                this.nowInstructionsData = {};
                this.instructionsRuleForm.instructionsType = '0';
                this.instructionsVisible = false;
                //异步处理
                setTimeout(() => {
                    this.$refs['instructionsRuleForm'].clearValidate();
                }, 100)
            },
            //下发指令窗口确认
            instructionsSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs['instructionsRuleForm'].clearValidate();
                        this.$axios({
                            url: this.$BaseUrl + '/gateway/sendCmdCustom',
                            method: 'post',
                            data: {
                                gatewayId: this.nowInstructionsData.gatewayId,
                                type: this.instructionsRuleForm.instructionsType,
                                cmd: this.instructionsRuleForm.instructionsContent
                            }
                        }).then(res => {
                            if (res.data.success == false) {
                                this.$message.error(res.data.msg);
                            } else {
                                this.$message({
                                    message: '下发指令成功!',
                                    type: 'success'
                                });
                                this.instructionsRuleForm.instructionsContent = '';
                                this.instructionsRuleForm.instructionsType = '0';
                                this.nowInstructionsData = {};
                                this.instructionsVisible = false;
                                //异步处理
                                setTimeout(() => {
                                    this.$refs['instructionsRuleForm'].clearValidate();
                                }, 100)
                            }
                        });
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
                        let url = this.$BaseUrl + '/gateway/setGatewayWarn';
                        let data = {};
                        data.warnUser = this.warnRuleForm.warnUser.join(',');
                        data.pushType = this.warnRuleForm.pushType;
                        if (this.warnTitle == '批量设置报警') {
                            data.gatewayIds = this.projectCheck;
                            url = this.$BaseUrl + '/gateway/batchSetGatewayWarn';
                        } else {
                            data.gatewayId = this.warnRuleForm.gatewayId;
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
                    url: this.$BaseUrl + '/gateway/getWarnRuleByGatewayId',
                    method: 'post',
                    data: {
                        gatewayId: row.gatewayId
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

                        this.warnRuleForm.gatewayId = row.gatewayId;
                        this.warnTitle = '设置报警';
                        this.warnVisible = true;
                    }
                });


            },
            //去网关详情
            goDetail(row) {
                this.$store.state.gatewayData = row;
                this.$router.push('/equipmentManagement/gatewayDetail')
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

<template>
    <div class="content-wrapper" v-cloak>
        <!--        搜索区域-->
        <el-form :inline="true" :model="searchArea" class="demo-form-inline formInline" label-width="120px">
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="所属项目/现场：">
                        <el-cascader
                                size="small"
                                v-model="searchArea.psId"
                                :props="props"
                                clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="变量名称：">
                        <el-input v-model="searchArea.variableName" size="small" placeholder="请输入变量名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="变量编号：">
                        <el-input v-model="searchArea.variableCode" size="small" placeholder="请输入变量编号"
                                  clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item label="监测因素：">
                        <el-select v-model="searchArea.monitorFactorId" size="small" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in elementOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="变量算法：">
                        <el-select v-model="searchArea.algorithmId" size="small" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in arithmeticOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item style="margin-left:40px">
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
                        <el-button style="margin-left: 40px" type="primary" size="small" icon="el-icon-plus"
                                   v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variable:add')!=-1"
                                   @click="variableControl('add')">新增变量
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        表格区域-->
        <div class="variableTable">
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
                        label="变量编号"
                        min-width="140">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{scope.row.variableCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="variableName"
                        label="变量名称"
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
                        prop="monitorFactorName"
                        label="监测因素"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="algorithmName"
                        label="变量算法"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="collectCycleName"
                        label="采样时长"
                        min-width="180"
                >
                </el-table-column>
                <el-table-column
                        prop="lastVariableValue"
                        label="最新数据"
                        width="120"
                >
                </el-table-column>
                <el-table-column
                        prop="getDataTime"
                        label="最新采集时间"
                        min-width="180"
                >
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variable:update')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variable:del')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableStatistic:list')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variable:update')!=-1"
                                @click="variableControl('edit',scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variable:del')!=-1"
                                @click="variableDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='variableStatistic:list')!=-1"
                                @click="historyCheck(scope.row)">历史查询
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
                :title="variableTitle"
                :visible.sync="variableVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="variableHandleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="所属现场：" prop="psId" v-show="variableTitle=='新增变量'">
                    <el-cascader
                            size="small"
                            v-model="ruleForm.psId"
                            :props="formProps"
                            @change="cascaderChange(ruleForm.psId[1],'change')"
                            clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属现场：" v-show="variableTitle=='编辑变量'">
                    <el-input size="small" v-model="ruleForm.structureName" disabled></el-input>
                </el-form-item>
                <el-form-item label="变量名称：" prop="variableName">
                    <el-input size="small" v-model="ruleForm.variableName"></el-input>
                </el-form-item>
                <el-form-item label="变量编号：" prop="variableCode">
                    <el-input size="small" v-model="ruleForm.variableCode"></el-input>
                </el-form-item>
                <el-form-item label="监测因素：" prop="monitorFactorId">
                    <el-select size="small" v-model="ruleForm.monitorFactorId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in elementOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <span class="tag" style="left: 18px;top: 10px">*</span>
                <el-form-item style="margin-top: -20px" label="采样时长：">
                    <div class="flex-between">
                        <el-input-number size="small" v-model="ruleForm.collectCycle" controls-position="right" :min="0"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">时</span>
                        <el-input-number size="small" v-model="ruleForm.collectCycle2" controls-position="right" :min="0" :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">分</span>
                        <el-input-number size="small" v-model="ruleForm.collectCycle3" controls-position="right" :min="0" :max="59"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                        <span style="padding: 0 10px">秒</span>
                    </div>
                </el-form-item>
                <el-form-item label="变量说明：" >
                    <el-input size="small" type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="变量算法：" prop="algorithmId">
                    <el-select size="small" v-model="ruleForm.algorithmId" @change="sensorAgreementIdChange" clearable
                               placeholder="请选择">
                        <el-option
                                v-for="item in arithmeticOptions"
                                :key="item.index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--                根据现场有没有选择，以及协议有没有选择判断-->
                <span class="tag"  style="left: 45px" v-if="ruleForm.nowVariableData.length!=0&&ruleForm.psId.length!=0">*</span>
                <el-form-item style="margin-top: -30px" label="变量：" v-if="ruleForm.nowVariableData.length!=0&&ruleForm.psId.length!=0">
                    <div class="flex-between" v-for="(domain, index) in ruleForm.nowVariableData"
                         :key="index">
                        <div>{{index+1}}：</div>
                        <el-cascader
                                size="small"
                                style="width: 90%"
                                v-model="ruleForm.nowVariableData[index]"
                                :options="constantOptions"
                        >

                        </el-cascader>
                    </div>
                </el-form-item>
                <!--                根据现场有没有选择，以及协议有没有选择判断-->
                <span class="tag" style="left: 45px" v-if="ruleForm.nowConstantData.length!=0&&ruleForm.psId.length!=0">*</span>
                <el-form-item style="margin-top: -30px" label="常量：" v-if="ruleForm.nowConstantData.length!=0&&ruleForm.psId.length!=0">
                    <div class="flex-between" v-for="(domain, index) in ruleForm.nowConstantData"
                         :key="index">
                        <div>{{index+1}}：</div>
                        <el-input size="small" style="width: 90%"
                                  v-model="ruleForm.nowConstantData[index]"></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="variableCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="variableSure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "variableControl",
        data() {
            let that = this;
            return {
                //搜索区域
                searchArea: {
                    pageNum: 1,
                    pageSize: 5,
                    variableName: '',
                    variableCode: '',
                    monitorFactorId: '',
                    algorithmId: '',
                    psId: [],
                },
                //变量算法options数据
                arithmeticOptions: [],
                //所有算法数据
                allArithmeticData: [],
                //监测因素options数据
                elementOptions: [],
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
                //弹窗中所属现场级联数据
                formProps: {
                    //点击加载
                    lazy: true,
                    //控制可不可单选每一个
                    checkStrictly: false,
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

                //新增/编辑数据
                ruleForm: {
                    psId: '',
                    structureName: '',
                    variableName: '',
                    variableCode: '',
                    monitorFactorId: '',
                    algorithmId: '',
                    remark: '',
                    measureIds: [],
                    collectCycle: 0,
                    collectCycle2: 0,
                    collectCycle3: 0,
                    constantValues: [],
                    //当前算法展示变量得数据
                    nowVariableData: [],
                    //当前算法展示常量得数据
                    nowConstantData: [],
                },
                rules: {
                    psId: [
                        {required: true, message: '请选择所属网关', trigger: 'change'},
                    ],
                    variableName: [
                        {required: true, message: '请输入变量名称', trigger: 'blur'}
                    ],
                    variableCode: [
                        {required: true, message: '请输入变量编号', trigger: 'blur'}
                    ],
                    monitorFactorId: [
                        {required: true, message: '请选择监测因素', trigger: 'change'}
                    ],
                    algorithmId: [
                        {required: true, message: '请选择变量算法', trigger: 'change'}
                    ],

                },
                //新增/编辑title
                variableTitle: '',
                //新增/编辑弹窗显示
                variableVisible: false,
                //用来展示选取图片的地址
                imageUrl: '',
                //存储文件内容
                imgFile: [],
                //控制测值是否可以编辑
                disabled: false,
                //所属网关数据
                gatewayOptions: [],
                //变量协议数据
                variableAgreementOptions: [],
                //当前编辑的变量Id
                nowVariableId: '',
                //弹窗内级联选择框得数据
                constantOptions: []
            }
        },
        created() {
            this.$store.state.nowName='变量管理';
            this.getSelectData();
            this.getTableData();
        },
        methods: {
            //获取搜索区域两个下拉框数据
            getSelectData() {
                //算法
                this.$axios({
                    url: this.$BaseUrl + '/algorithm/getPageList',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.arithmeticOptions = [];
                        for (let i in res.data.data.list) {
                            this.arithmeticOptions.push({
                                label: res.data.data.list[i].algorithmName,
                                value: res.data.data.list[i].algorithmId
                            })
                        }
                        this.allArithmeticData = res.data.data.list;
                    }
                });
                //监测因素
                this.$axios({
                    url: this.$BaseUrl + '/monitorFactor/getPageList',
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.elementOptions = [];
                        for (let i in res.data.data.list) {
                            this.elementOptions.push({
                                label: res.data.data.list[i].monitorFactorName,
                                value: res.data.data.list[i].monitorFactorId
                            })
                        }
                    }
                })
            },
            //计算时分秒
            changeTime(time) {
                let h = time / 3600;
                let m = (time % 3600) / 60;
                let s = (time % 3600) % 60;
                let date = '';
                if (h >= 1) {
                    date = parseInt(h) + '时'
                }
                if (m >= 1) {
                    date = date + parseInt(m) + '分'
                }
                if (s > 0) {
                    date = date + parseInt(s) + '秒'
                }
                return date;
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
                    url: this.$BaseUrl + '/variable/getPageList',
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
                                this.tableData[i].collectCycleName=this.changeTime(this.tableData[i].collectCycle)
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

            //新增/编辑变量
            variableControl(type, row) {
                if (type === 'add') {
                    this.variableTitle = '新增变量';
                    this.ruleForm.variableCode=this.$round.random('V');
                } else {
                    this.variableTitle = '编辑变量';
                    this.nowVariableId = row.variableId;
                    this.ruleForm.psId = (row.structureId + '').split(',');
                    this.ruleForm.structureName = row.structureName;
                    this.ruleForm.variableName = row.variableName;
                    this.ruleForm.variableCode = row.variableCode;
                    this.ruleForm.monitorFactorId = row.monitorFactorId;
                    this.ruleForm.algorithmId = row.algorithmId;
                    this.ruleForm.remark = row.remark;
                    //计算一下采样时长
                    let collectCycleNum = this.countTime(row.collectCycle);
                    this.ruleForm.collectCycle = collectCycleNum[0];
                    this.ruleForm.collectCycle2 = collectCycleNum[1];
                    this.ruleForm.collectCycle3  = collectCycleNum[2];
                    this.ruleForm.nowConstantData = row.constantValues.split(',');
                    //获取弹窗内部级联框数据
                    this.cascaderChange(row.structureId,'edit');
                    //通过measureIds换取当前行的变量
                    this.$axios({
                        url: this.$BaseUrl + '/variable/getSensorMeasuresByMeasureId',
                        method: 'post',
                        data: {
                            measureIds: row.measureIds
                        }
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.ruleForm.nowVariableData=[];
                            for (let i in res.data.data){
                                let a =[];
                                a.push(res.data.data[i].gatewayId);
                                a.push(res.data.data[i].sensorId);
                                a.push(res.data.data[i].sensorMeasureId);
                                this.ruleForm.nowVariableData.push(a);
                            }
                        }
                    });
                }
                this.variableVisible = true;
            },
            //删除变量
            variableDelete(index, row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/variable/delVariable',
                        method: 'post',
                        data: {
                            variableId: row.variableId
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
            cascaderChange(data,type) {
                this.$axios({
                    url: this.$BaseUrl + '/variable/getTreeMeasureValueList',
                    method: 'post',
                    data: {
                        structureId: data
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.constantOptions = res.data.data;
                    }
                });
                //根据type区分是不是change 变化 是才置空
                if (type==='change'){
                    this.ruleForm.nowVariableData = [];
                    this.ruleForm.nowConstantData = [];
                    this.ruleForm.algorithmId = '';
                }

            },
            //新增/编辑数据清除
            clear() {

                this.ruleForm.psId = '';
                this.ruleForm.variableName = '';
                this.ruleForm.variableCode = '';
                this.ruleForm.monitorFactorId = '';
                this.ruleForm.structureName = '';
                this.ruleForm.algorithmId = '';
                this.ruleForm.remark = '';
                this.ruleForm.measureIds = [];
                this.ruleForm.collectCycle = '';
                this.ruleForm.collectCycle2 = '';
                this.ruleForm.collectCycle3 = '';
                this.ruleForm.constantValues = [];
                this.ruleForm.nowVariableData = [];
                this.ruleForm.nowConstantData = [];
                //数据过多，异步操作一下
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);


                this.variableVisible = false;
            },
            //新增/编辑弹窗右上角关闭
            variableHandleClose(done) {
                this.clear();
                done();
            },
            //新增/编辑取消
            variableCancel() {
                this.clear();
            },
            //新增/编辑确认
            variableSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {...this.ruleForm};
                        data.collectCycle = data.collectCycle * 3600 + data.collectCycle2 * 60 + data.collectCycle3;
                        if (data.collectCycle <= 0) {
                            this.$message.error('请输入采样时长');
                            return;
                        }
                        //检查变量，常量有没有都输入完毕
                        for (let i in data.nowVariableData) {
                            let a = parseInt(i) + 1;
                            if (data.nowVariableData[i] === '') {
                                this.$message.error('请输入第' + a + '行变量！');
                                return;
                            }
                        }
                        for (let s in data.nowConstantData) {
                            let b = parseInt(s) + 1;
                            if (data.nowConstantData[s] === '') {
                                this.$message.error('请输入第' + b + '行常量！');
                                return;
                            }
                        }
                        //我们得格式是[[1,2,3],[1,2,3]],后端只需要最后一位，所以讲最后一位取出来
                        let measureIds = [];
                        for (let a in data.nowVariableData) {
                            measureIds[a] = data.nowVariableData[a][2]
                        }
                        //根据后端要求更改格式
                        data.measureIds = measureIds.join(',');
                        data.constantValues = data.nowConstantData.join(',');
                        //级联选择框数据是2层的
                        if (this.variableTitle === '新增变量') {
                            //根据新增时psId不一样得格式修改
                            data.structureId = this.ruleForm.psId[1];
                            this.$axios({
                                url: this.$BaseUrl + '/variable/addVariable',
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
                            //根据编辑时psId不一样得格式修改
                            data.structureId = this.ruleForm.psId[0];
                            data.variableId=this.nowVariableId;
                            this.$axios({
                                url: this.$BaseUrl + '/variable/updateVariable',
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
            //去变量详情
            goDetail(row) {
                this.$router.push({name: 'variableDetail'});
                this.$store.state.variableData = row;
            },
            //新增弹窗传感器协议数据变化
            sensorAgreementIdChange() {
                //es6 获取index
                let index = this.arithmeticOptions.findIndex(arithmetic => arithmetic.value === this.ruleForm.algorithmId);
                this.ruleForm.nowVariableData = [];
                this.ruleForm.nowConstantData = [];
                for (let i = 0; i < this.allArithmeticData[index].variableCount; i++) {
                    this.ruleForm.nowVariableData.push('')
                }
                for (let s = 0; s < this.allArithmeticData[index].constantCount; s++) {
                    this.ruleForm.nowConstantData.push('')
                }
            },
            //历史查询
            historyCheck(row){
                //修改左侧菜单点击
                this.$store.state.defaultActive = '/statisticAnalysis/variableAnalyze';
                this.$router.push({
                    name: 'variableAnalyze',
                    params: {treeId: row.structureId, variableId: row.variableId}
                })
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
        width: 54% !important;
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

    .variableTable {
        /*height: 71%;*/
        overflow: auto;
    }

    /*设置级联选择框铺满*/
    .el-cascader {
        display: block;
    }
</style>

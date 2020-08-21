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
                <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
                        <el-button size="small" @click="reset">重置</el-button>
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
                    v-loading="loading"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="gatewayCode"
                        label="网关编号"
                        width="140">
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
                        prop="remark"
                        label="说明"
                        min-width="260">
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right"
                                 v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewaySensorMeasure:set')!=-1||
$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewaySensorMeasure:list')!=-1
"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewaySensorMeasure:set')!=-1"
                                @click="wechatSet(scope.row)">微信配置
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='gatewaySensorMeasure:list')!=-1"
                                @click="wechatCheck(scope.row)">查看配置
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
                :title="'微信设置'"
                :visible.sync="gatewayVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="gatewayHandleClose">
            <div style="height: 55vh;overflow: auto">
                <div ref="treeDiv" class="tree-container">
                    <el-tree
                            id="tree" class="tree"
                            :indent='0'
                            :data="treeData"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            @check-change="treeNodeClick"
                            :props="treeProps">
                    </el-tree>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="gatewayCancel()">取 消</el-button>
            <el-button type="primary" @click="gatewaySure()">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                :title="'查看配置'"
                :visible.sync="gatewayCheckVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="gatewayCheckHandleClose">
            <div style="height: 55vh;overflow: auto">
                <div ref="treeDiv" class="tree-container">
                    <el-tree
                            id="trees" class="tree"
                            :indent='0'
                            :data="treeDatas"
                            default-expand-all
                            node-key="id"
                            ref="trees"
                            :props="treeProps">
                    </el-tree>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="gatewayCheckVisible=false">取 消</el-button>
            <el-button type="primary" @click="gatewayCheckVisible=false">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "wechatSetting",
        data() {
            let that = this;
            return {
                //搜索区域
                searchArea: {
                    gatewayName: '',
                    gatewayCode: '',
                    psId: [],
                    pageNum: 1,
                    pageSize: 8,
                },
                //设置树形的data
                treeData: [],
                //查看配置得tree数据
                treeDatas: [],
                //表格数据
                tableData: [],
                //数据总数
                total: 0,
                //表格loading
                loading: true,
                //编辑时当前选中得行id
                nowGatewayId: '',
                //微信设置 title
                gatewayTitle: '',
                //微信设置 弹窗显示
                gatewayVisible: false,
                //查看配置 title
                gatewayCheckTitle: '',
                //查看配置 弹窗显示
                gatewayCheckVisible: false,
                //tree 用来命名label 和 children的属性名
                treeProps: {
                    label: 'label',
                    children: 'children'
                },
                //默认已选择的数组
                checked: [],
                //修改后的数组
                orginChecked: [],
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

            }
        },
        created() {
            this.$store.state.nowName = '微信端配置';
            this.getTableData();
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
                }
                this.$axios({
                    url: this.$BaseUrl + '/gatewayYearManage/getPageList',
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
                this.searchArea.gatewayName = '';
                this.searchArea.gatewayCode = '';
                this.searchArea.psId = [];
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
            //微信设置窗口右上角关闭
            gatewayHandleClose(done) {
                done();
            },
            //查看配置窗口右上角关闭
            gatewayCheckHandleClose(done) {
                done();
            },
            //微信设置网关数据清除
            gatewayClear() {
                this.gatewayVisible = false;
            },
            //微信设置取消
            gatewayCancel() {
                this.checked = [];
                this.orginChecked = [];
                //置空树形选择
                this.$refs.tree.setCheckedKeys([]);
                this.gatewayClear();
            },
            //微信设置确认
            gatewaySure() {
                if (this.orginChecked.length==0){
                    this.$message.error('请最少选择一个')
                    return;
                }else if (this.orginChecked.length>4){
                    this.$message.error('最多选择4个')
                    return;
                }
                for (let i in this.orginChecked) {
                    this.orginChecked[i].gatewayId = this.nowGatewayId
                }
                this.$axios({
                    url: this.$BaseUrl + '/GatewaySensorMeasure/setGatewaySensorMeasure',
                    method: 'post',
                    data: this.orginChecked
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
                        this.checked = [];
                        this.orginChecked = [];
                        //置空树形选择
                        this.$refs.tree.setCheckedKeys([]);
                        this.gatewayClear();
                    }
                })
            },
            //级联选择框值改变
            cascaderChange(value) {
            },
            //微信设置
            wechatSet(row) {
                this.nowGatewayId = row.gatewayId;
                this.getTreeData('set', row);
                this.gatewayVisible = true;
            },
            //微信查询
            wechatCheck(row) {
                this.getTreeData('check', row);
                this.gatewayCheckVisible = true;
            },
            //权限树形选择点击
            treeNodeClick(data, checked, indeterminate) {
                if (checked) {
                    //恢复初始层数
                    this.nowLevel = 1;
                    this.checkLevel(data);
                    if (this.nowLevel == 1) {
                        this.orginChecked.push({sensorMeasureId: data.id});
                    }
                } else {
                    for (let i in this.orginChecked) {
                        if (data.id == this.orginChecked[i].sensorMeasureId) {
                            this.orginChecked.splice(i, 1)
                        }
                    }
                }
            },
            //判断el-tree当前是第几层
            checkLevel(data) {
                if (data.children != null) {
                    this.checkLevel(data.children);
                    this.nowLevel++
                }
            },
            //获取当前网关权限树形数据
            getTreeData(type, row) {
                if (type == 'set') {
                    //获取所有权限
                    this.$axios({
                        url: this.$BaseUrl + '/GatewaySensorMeasure/getAllSensorMeasureByGatewayId',
                        method: 'post',
                        data: {
                            gatewayId: row.gatewayId
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.treeData = [];
                            this.treeData = res.data.data;
                            this.$axios({
                                url: this.$BaseUrl + '/GatewaySensorMeasure/getGatewaySensorMeasureList',
                                method: 'post',
                                data: {
                                    gatewayId: row.gatewayId
                                }
                            }).then(res => {
                                this.checked = [];
                                this.orginChecked = [];
                                for (let i in res.data.data) {
                                    this.checked.push(res.data.data[i].sensorMeasureId);
                                }
                                if (this.checked != []) {
                                    setTimeout(() => {
                                        this.$refs.tree.setCheckedKeys(this.checked)
                                    }, 100)
                                }
                            })
                        }
                    })
                } else {
                    // 只获取当前得
                    this.$axios({
                        url: this.$BaseUrl + '/GatewaySensorMeasure/getSelectSensorMeasureByGatewayId',
                        method: 'post',
                        data: {
                            gatewayId: row.gatewayId
                        }
                    }).then(res => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.treeDatas = [];
                            this.treeDatas = res.data.data;
                        }
                    })
                }

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

<template>
    <div class="content-wrapper measurementFlex" v-cloak>
<!--        树形数据-->
        <div class="treeData">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <div ref="treeDiv" class="tree-container">
                <el-tree
                        id="tree" class="tree"
                        :indent='0'
                        :data="data"
                        :props="defaultProps"
                        highlight-current
                        default-expand-all
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        ref="tree">
                </el-tree>
            </div>


        </div>
<!--        表格数据-->
        <div class="valueTable">

            <el-table
                    :header-cell-style="{background:'rgb(250,250,250)'}"
                    class="contentTable"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="sensorMeasureCode"
                        label="测值编号"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        prop="sensorMeasureName"
                        label="测值名称"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        prop="lastMeasureValue"
                        label="原始测值"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="collectCycle"
                        label="采集频率"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="getDataTime"
                        label="最新采集时间"
                        min-width="220">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.measureState==1"><span style="color: rgb(0,168,84)">●</span> 正常</span>
                        <span v-else><span style="color: rgb(240,65,52)">●</span> 异常</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="130" v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureStatistic:list')!=-1">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                size="mini"
                                round
                                plain
                                v-if="$store.state.userInfo.permissionList.findIndex(info=>info.shiroCode==='measureStatistic:list')!=-1"
                                @click="historyCheck(scope.row)">历史查询
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding: 10px 0;text-align: left">
                <el-button size="small" @click="exprot" > 导出</el-button>
            </div>
            <!--        分页区域-->
<!--            <div class="valuePagination">-->
<!--                <el-pagination-->
<!--                        @size-change="handleSizeChange"-->
<!--                        @current-change="handleCurrentChange"-->
<!--                        :current-page="pageNum"-->
<!--                        :page-sizes="[10, 20, 30, 40]"-->
<!--                        :page-size="pageSize"-->
<!--                        background-->
<!--                        layout="total, sizes, prev, pager, next, jumper"-->
<!--                        :total="total">-->
<!--                </el-pagination>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "measurementValue",
        data() {
            return {
                //树形数据过滤字段
                filterText: '',
                //树形数据
                data: [],
                //表格数据
                tableData: [],
                //树形数据匹配方式
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                //表格loading
                loading:false,
                //表格页码
                pageNum:1,
                //表格宽度
                pageSize:10,
                //表格总数
                total:0,
                //当前选择的传感器的id
                nowTreeDataId:'',
            };
        },
        watch: {
            //监测搜索数据变化
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.$store.state.nowName='实时数据';
            this.getTreeData()
        },
        methods: {
            //导出
            exprot() {
                this.$axios({
                    url: this.$BaseUrl + '/realTimeData/exportExcel',
                    method: 'post',
                    data:{
                        sensorId:this.nowTreeDataId
                    },
                    responseType: 'blob'
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (!res.data) {
                            return;
                        }
                        let blob = new Blob([res.data], {
                            type:
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"
                        });
                        let url = window.URL.createObjectURL(blob);
                        let fileName = decodeURI(res.headers.filename);
                        if ("download" in document.createElement("a")) {
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = fileName;
                            a.style.display = "none";
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(a.href);
                            document.body.removeChild(a);
                        } else {
                            navigator.msSaveBlob(blob, fileName);
                        }
                    }
                })
            },
            //过滤数据方法
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //获取传感器树形列表
            getTreeData() {
                this.$axios({
                    url: this.$BaseUrl + '/measureStatistic/getTreeSensorList',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if(res.data.data!=null){
                            this.data = res.data.data;
                            if (this.data[0] && this.data[0].children && this.data[0].children[0] && this.data[0].children[0].children && this.data[0].children[0].children[0] && this.data[0].children[0].children[0].children && this.data[0].children[0].children[0].children[0]) {
                                //不是得时候如果第一个有值默认第一个
                                this.nowTreeDataId=this.data[0].children[0].children[0].children[0].id;
                                this.getTableData()
                            }
                        }else {
                            this.data = [];
                        }
                    }
                })
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/realTimeData/getMeasureRealTimeData',
                    method: 'post',
                    data: {
                        sensorId:this.nowTreeDataId,
                        pageNum:this.pageNum,
                        pageSize:this.pageSize
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if(res.data.data!=null){
                            this.tableData = res.data.data.list;
                            for (let i in this.tableData){
                                this.tableData[i].collectCycle=this.changeTime(this.tableData[i].collectCycle)
                            }
                            this.total = res.data.data.total;
                            this.loading=false;
                        }else {
                            this.tableData = [];
                            this.total = 0;
                            this.loading=false;
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
            //树形数据点击事件
            handleNodeClick(data) {
                if (data.level==4){
                    this.nowTreeDataId=data.id;
                    this.loading=true;
                    this.getTableData();
                    this.$message({
                        message: '选择传感器成功',
                        type: 'success'
                    })
                }
            },
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.loading=true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.pageNum = val;
                this.loading=true;
                this.getTableData()
            },
            //历史查询
            historyCheck(row){
                console.log(row)
                //修改左侧菜单点击
                this.$store.state.defaultActive='/statisticAnalysis/originalAnalyze';
                    this.$router.push({name: 'originalAnalyze', params: { treeId: this.nowTreeDataId,sensorMeasureId:row.sensorMeasureId }});
            }
        },


    }
</script>

<style scoped>
    /*左侧tree控件样式*/
    .treeData {
        width: 300px;
        border-right: 1px solid rgb(220, 220, 220);
        height: 80vh;
        overflow: auto;
        padding-right: 20px;
        box-sizing: border-box;
    }
    /*右侧表格样式*/
    .valueTable{
        padding: 0 3%;
        box-sizing: border-box;
        height: 100%;
        width: calc(100% - 300px);
    }
    .contentTable{
        /*height: 80%;*/
    }
    /*分页样式*/
    .valuePagination{
        position: relative;
        top: 10%;
    }

</style>

<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/statisticAnalysis/groupingVariable' }">变量分组管理</el-breadcrumb-item>
            <el-breadcrumb-item>变量分组管理详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="8">
                    变量分组编号：<span class="info-content" v-if="info.variableGroupCode&&info.variableGroupCode!=''">{{info.variableGroupCode}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    变量分组名称：<span class="info-content" v-if="info.variableGroupName&&info.variableGroupName!=''">{{info.variableGroupName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
                <el-col :span="8">
                    所属项目：<span class="info-content" v-if="info.projectName&&info.projectName!=''">{{info.projectName}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="rowStyle">
                <el-col :span="24">
                    说明：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
                    <span v-else class="info-content">-</span>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div class="title">变量内容</div>
        <!--        表格区域-->
        <div class="groupingTable">
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
                        prop="variableCode"
                        label="变量编号"
                        min-width="140">
<!--                    <template slot-scope="scope">-->
<!--                        <a @click="goDetail(scope.row)">{{scope.row.variableCode}}</a>-->
<!--                    </template>-->
                </el-table-column>
                <el-table-column
                        prop="variableName"
                        label="变量名称"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="structureName"
                        label="所属现场"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="monitorFactorName"
                        label="监测因素"
                        min-width="180">
                </el-table-column>
                <el-table-column
                        prop="collectCycle"
                        label="采样时长"
                        min-width="180"
                >
                </el-table-column>
                <el-table-column
                        prop="collectCycle"
                        label="最新数据"
                        width="180"
                >
                </el-table-column>
                <el-table-column
                        prop="getDataTime"
                        label="最新采集时间"
                        min-width="180"
                >
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
        </div>
<!--        &lt;!&ndash;        分页区域&ndash;&gt;-->
<!--        <div class="pagination">-->
<!--            <el-pagination-->
<!--                    @size-change="handleSizeChange"-->
<!--                    @current-change="handleCurrentChange"-->
<!--                    :current-page="pageNum"-->
<!--                    :page-sizes="[8, 16, 24, 32]"-->
<!--                    :page-size="pageSize"-->
<!--                    background-->
<!--                    layout="total, sizes, prev, pager, next, jumper"-->
<!--                    :total="total">-->
<!--            </el-pagination>-->
<!--        </div>-->
        <div class="button">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "groupingDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {
                },

                // 表格一套数据
                // pageNum:1,
                // pageSize:1,
                // total:0,
                tableData:[],
                loading:false
            }
        },
        created() {
            this.$store.state.nowName='变量分组管理详情';
            this.info=this.$store.state.groupingData;
            this.getTableData()
        },
        mounted() {
        },
        methods: {
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
                this.$axios({
                    url: this.$BaseUrl + '/variable/getVariableListByGroupId',
                    method: 'post',
                    data: {
                        variableGroupId:this.$store.state.groupingData.variableGroupId
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.tableData = [];
                        if (res.data.data != null) {
                            this.tableData = res.data.data;
                            for (let i in this.tableData){
                                this.tableData[i].collectCycle=this.changeTime(this.tableData[i].collectCycle)
                            }
                            // this.total = res.data.total;
                            this.loading = false;
                        } else {
                            this.tableData = [];
                            // this.total = 0;
                            this.loading = false;
                        }
                    }
                })
            },
            //表格每页展示多少设置
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.loading = true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            handleCurrentChange(val) {
                this.pageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //返回上一页
            goBack() {
                this.$router.push('/statisticAnalysis/groupingVariable');
            },
            //历史查询
            historyCheck(row) {
                //修改左侧菜单点击
                this.$store.state.defaultActive = '/statisticAnalysis/variableGroupingAnalyze';
                this.$router.push({
                    name: 'variableGroupingAnalyze',
                    params: {treeId: this.$store.state.groupingData.variableGroupId}
                })
            },
        },

    }
</script>

<style scoped>
    /*步骤条样式*/
    .steps {
        margin-top: 30px;
        width: 100%;
    }

    /*小标题样式*/
    .title {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0;
    }

    /*基本信息*/
    .info {
        font-size: 15px;
        color: rgb(49, 49, 51);
    }

    /*基本信息每行样式*/
    .rowStyle {
        margin: 15px 0;
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

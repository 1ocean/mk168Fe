<template>
    <div class="content-wrapper" v-cloak>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/project/projectControl' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item>现场详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="title">基本信息</div>
        <div class="info">
            <el-row>
                <el-col :span="18">
                    <el-row :gutter="20" class="rowStyle">
                        <el-col :span="8">
                            现场编号：<span class="info-content" v-if="info.structureCode&&info.structureCode!=''">{{info.structureCode}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                        <el-col :span="8">
                            现场名称：<span class="info-content" v-if="info.structureName&&info.structureName!=''">{{info.structureName}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                        <el-col :span="8">
                            所属项目：<span class="info-content" v-if="nowProjectName&&nowProjectName!=''">{{nowProjectName}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="rowStyle">
                        <el-col :span="8">
                            现场类型：<span class="info-content" v-if="info.structureType&&info.structureType!=''">{{info.structureType}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                        <el-col :span="8">
                            经度：<span class="info-content" v-if="info.longitude&&info.longitude!=''">{{info.longitude}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                        <el-col :span="8">
                            纬度：<span class="info-content" v-if="info.latitude&&info.latitude!=''">{{info.latitude}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="rowStyle">
                        <el-col :span="24">
                            现场地址：<span class="info-content" v-if="info.address&&info.address!=''">{{info.address}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="rowStyle">
                        <el-col :span="24">
                            现场描述：<span class="info-content" v-if="info.remark&&info.remark!=''">{{info.remark}}</span>
                            <span v-else class="info-content">-</span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <img :src="imgAddress" alt="" height="140" width="240">
                </el-col>
            </el-row>

        </div>
        <el-divider></el-divider>
        <div class="title">网关信息</div>
        <el-table
                :header-cell-style="{background:'rgb(250,250,250)'}"
                :data="gatewayTableData"
                stripe
                v-loading="loading"
                style="width: 100%">
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
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="structureName"
                    label="所属现场"
                    width="140">
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
                    prop="collectCycle"
                    label="采集时长"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="sensorNum"
                    label="传感器数量"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="reverseEquipmentNum"
                    label="开关数量"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="maxOfLineTime"
                    label="最大离线时长"
                    width="160">
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row. gatewayState==1"><span style="color: rgb(0,168,84)">●</span> 在线</span>
                    <span v-else><span style="color: rgb(240,65,52)">●</span> 离线</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change="gatewayHandleCurrentChange"
                    :current-page="gatewayPageNum"
                    :page-size="gatewayPageSize"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="gatewayTotal">
            </el-pagination>
        </div>
        <el-divider></el-divider>
<!--        <div class="title">变量信息</div>-->
<!--        <el-table-->
<!--                :header-cell-style="{background:'rgb(250,250,250)'}"-->
<!--                :data="variableTableData"-->
<!--                stripe-->
<!--                v-loading="loading"-->
<!--                style="width: 100%">-->
<!--            <el-table-column-->
<!--                    type="index"-->
<!--                    label="序号"-->
<!--                    width="50">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="variableCode"-->
<!--                    label="变量编号"-->
<!--                    width="140">-->
<!--&lt;!&ndash;                <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;                    <a @click="goDetail(scope.row)">{{scope.row.variableCode}}</a>&ndash;&gt;-->
<!--&lt;!&ndash;                </template>&ndash;&gt;-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="variableName"-->
<!--                    label="变量名称"-->
<!--                    width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="projectName"-->
<!--                    label="所属项目"-->
<!--                    width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="structureName"-->
<!--                    label="所属现场"-->
<!--                    width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="monitorFactorName"-->
<!--                    label="监测因素"-->
<!--                    width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="algorithmName"-->
<!--                    label="变量算法"-->
<!--                    width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="collectCycleName"-->
<!--                    label="采样时长"-->
<!--                    width="180"-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="collectCycle"-->
<!--                    label="最新数据"-->
<!--                    width="120"-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="getDataTime"-->
<!--                    label="最新采集时间"-->
<!--                    min-width="180"-->
<!--            >-->
<!--            </el-table-column>-->
<!--        </el-table>-->
<!--        <div class="pagination">-->
<!--            <el-pagination-->
<!--                    @current-change="variableHandleCurrentChange"-->
<!--                    :current-page="variablePageNum"-->
<!--                    :page-size="variablePageSize"-->
<!--                    background-->
<!--                    layout="total, prev, pager, next, jumper"-->
<!--                    :total="variableTotal">-->
<!--            </el-pagination>-->
<!--        </div>-->
        <div class="button">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "structureDetail",
        data() {
            return {
                //当前页面展示的信息
                info: {
                },
                loading:false,
                //当前现场得名称
                nowProjectName:'',
                //图片地址
                imgAddress:'',
                //网关表格一套数据
                gatewayPageNum:1,
                gatewayPageSize:5,
                gatewayTotal:0,
                gatewayTableData:[],

                //变量表格一套数据
                variablePageNum:1,
                variablePageSize:5,
                variableTotal:0,
                variableTableData:[],
            }
        },
        created() {
            this.$store.state.nowName='现场详情';
            this.info=this.$store.state.structureData;
            this.nowProjectName=this.$store.state.nowProjectName;
            this.imgAddress=this.$url+this.info.structureImg;
            this.getTableData();
            this.getVariableTableData();
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
            //表格展示计算时间的方法
            showCountTime(time) {
                let h = time / 3600;
                let m = (time % 3600) / 60;
                let s = (time % 3600) % 60;
                let times = '';
                if (h > 0) {
                    times = parseInt(h) + '小时'
                }
                if (m > 0) {
                    times = times +parseInt(m) + '分钟'
                }
                if (s > 0) {
                    times = times + parseInt(s) + '秒'
                }
                return times;
            },
            //获取表格数据
            getTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/gateway/getPageList',
                    method: 'post',
                    data: {
                        pageNum:this.gatewayPageNum,
                        pageSize:this.gatewayPageSize,
                        structureId:this.$store.state.structureData.structureId,
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.gatewayTableData = [];
                        if (res.data.data != null) {
                            this.gatewayTableData = res.data.data.list;
                            for (let i in this.gatewayTableData){
                                this.gatewayTableData[i].maxOfLineTime=this.showCountTime(this.gatewayTableData[i].maxOfLineTime);
                                this.gatewayTableData[i].collectCycle=this.showCountTime(this.gatewayTableData[i].collectCycle)
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
            //获取表格数据
            getVariableTableData() {
                this.$axios({
                    url: this.$BaseUrl + '/variable/getPageList',
                    method: 'post',
                    data: {
                        pageNum:this.variablePageNum,
                        pageSize:this.variablePageSize,
                        structureId:this.$store.state.structureData.structureId,
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.variableTableData = [];
                        if (res.data.data != null) {
                            this.variableTableData= res.data.data.list;
                            for (let i in this.variableTableData){
                                this.variableTableData[i].collectCycleName=this.changeTime(this.variableTableData[i].collectCycle)
                            }
                            this.variableTotal = res.data.data.total;
                            this.loading = false;
                        } else {
                            this.variableTableData = [];
                            this.variableTotal = 0;
                            this.loading = false;
                        }
                    }
                })
            },
            //跳转页码  以及页码点击
            gatewayHandleCurrentChange(val) {
                this.gatewayPageNum = val;
                this.loading = true;
                this.getTableData()
            },
            //跳转页码  以及页码点击
            variableHandleCurrentChange(val) {
                this.variablePageNum = val;
                this.loading = true;
                this.getVariableTableData()
            },
            //返回上一页
            goBack() {
                this.$router.push('/project/projectControl');
            }
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

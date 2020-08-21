<template>
    <div class="content-wrapper" v-cloak>
        <div class="content">
            <!--            <div class="flex-between wrapper">-->
            <!--                <div class="item">微信公众号</div>-->
            <!--                <div class="item">-->
            <!--                    <el-input v-model="phone" readonly></el-input>-->
            <!--                </div>-->
            <!--                <div class="item">-->
            <!--                    <el-button type="primary" plain>修改</el-button>-->
            <!--                </div>-->
            <!--            </div>-->
<!--            <div>变量清除周期</div>-->
<!--            <div class="flex-between wrapper">-->
<!--                <div class="flex-between item">-->
<!--                    <el-input v-model="variableClearCycleY" size="small" disabled-->
<!--                    ></el-input>-->
<!--                    <span style="padding: 0 10px">年</span>-->
<!--                    <el-input v-model="variableClearCycleM" size="small" disabled-->
<!--                    ></el-input>-->
<!--                    <span style="padding: 0 10px">月</span>-->
<!--                    <el-input v-model="variableClearCycleD" size="small" disabled-->
<!--                    ></el-input>-->
<!--                    <span style="padding: 0 10px">日</span>-->
<!--                </div>-->
<!--            </div>-->
            <div>原始测值清除周期</div>
            <div class="flex-between wrapper">
                <div class="flex-between item">
                    <el-input v-model="measureClearCycleY" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">年</span>
                    <el-input v-model="measureClearCycleM" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">月</span>
                    <el-input v-model="measureClearCycleD" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">日</span>
                </div>
            </div>
            <div>报警记录清除周期</div>
            <div class="flex-between wrapper">
                <div class="flex-between item">
                    <el-input v-model="warnRecordClearCycleY" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">年</span>
                    <el-input v-model="warnRecordClearCycleM" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">月</span>
                    <el-input v-model="warnRecordClearCycleD" size="small" disabled
                    ></el-input>
                    <span style="padding: 0 10px">日</span>
                </div>
            </div>
            <div class="item">
                <el-button type="primary" plain @click="change">修改</el-button>
            </div>
        </div>
        <el-dialog
                title="修改周期"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                width="600px"
                :before-close="handleClose">
<!--            <div>变量清除周期</div>-->
<!--            <div class="flex-between wrapper">-->
<!--                <div class="flex-between item">-->
<!--                    <el-input-number v-model="form.variableClearCycleY" size="small" controls-position="right" :min="0"-->
<!--                                     readonly-->
<!--                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>-->
<!--                    <span style="padding: 0 10px">年</span>-->
<!--                    <el-input-number v-model="form.variableClearCycleM" size="small" controls-position="right" :min="0" :max="11"-->
<!--                                     readonly-->
<!--                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>-->
<!--                    <span style="padding: 0 10px">月</span>-->
<!--                    <el-input-number v-model="form.variableClearCycleD" size="small" controls-position="right" :min="0" :max="30"-->
<!--                                     readonly-->
<!--                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>-->
<!--                    <span style="padding: 0 10px">日</span>-->
<!--                </div>-->
<!--            </div>-->
            <div>原始测值清除周期</div>
            <div class="flex-between wrapper">
                <div class="flex-between item">
                    <el-input-number v-model="form.measureClearCycleY" size="small" controls-position="right" :min="0"
                                     readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">年</span>
                    <el-input-number v-model="form.measureClearCycleM" size="small" controls-position="right" :min="0" :max="11"
                                     readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">月</span>
                    <el-input-number v-model="form.measureClearCycleD" size="small" controls-position="right" :min="0" :max="30"
                                     readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">日</span>
                </div>
            </div>
            <div>报警记录清除周期</div>
            <div class="flex-between wrapper">
                <div class="flex-between item">
                    <el-input-number v-model="form.warnRecordClearCycleY" size="small" controls-position="right"
                                     :min="0" readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">年</span>
                    <el-input-number v-model="form.warnRecordClearCycleM" size="small" controls-position="right"
                                     :min="0" :max="11" readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">月</span>
                    <el-input-number v-model="form.warnRecordClearCycleD" size="small" controls-position="right"
                                     :min="0" :max="30" readonly
                                     onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input-number>
                    <span style="padding: 0 10px">日</span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "systemSetting",
        data() {
            return {
                //外部显示周期数据
                measureClearCycleY: 0,
                measureClearCycleM: 0,
                measureClearCycleD: 0,
                variableClearCycleY: 0,
                variableClearCycleM: 0,
                variableClearCycleD: 0,
                warnRecordClearCycleY: 0,
                warnRecordClearCycleM: 0,
                warnRecordClearCycleD: 0,

                //弹窗展示
                dialogVisible: false,
                form: {
                    measureClearCycleY: 0,
                    measureClearCycleM: 0,
                    measureClearCycleD: 0,
                    variableClearCycleY: 0,
                    variableClearCycleM: 0,
                    variableClearCycleD: 0,
                    warnRecordClearCycleY: 0,
                    warnRecordClearCycleM: 0,
                    warnRecordClearCycleD: 0,
                }
            };
        },
        created() {
            this.$store.state.nowName='系统设置';
            this.getData();
        },
        methods: {
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
            //获取时间设置数据
            getData() {
                this.$axios({
                    url: this.$BaseUrl + '/system/getSystem',
                    method: 'post',
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        if (res.data.data != null) {
                            let measureClearCycle = this.changeData(res.data.data.measureClearCycle);
                            let variableClearCycle = this.changeData(res.data.data.variableClearCycle);
                            let warnRecordClearCycle = this.changeData(res.data.data.warnRecordClearCycle);
                            this.measureClearCycleY = measureClearCycle[0];
                            this.measureClearCycleM = measureClearCycle[1];
                            this.measureClearCycleD = measureClearCycle[2];
                            this.variableClearCycleY = variableClearCycle[0];
                            this.variableClearCycleM = variableClearCycle[1];
                            this.variableClearCycleD = variableClearCycle[2];
                            this.warnRecordClearCycleY = warnRecordClearCycle[0];
                            this.warnRecordClearCycleM = warnRecordClearCycle[1];
                            this.warnRecordClearCycleD = warnRecordClearCycle[2];
                            this.form.measureClearCycleY = measureClearCycle[0];
                            this.form.measureClearCycleM = measureClearCycle[1];
                            this.form.measureClearCycleD = measureClearCycle[2];
                            this.form.variableClearCycleY = variableClearCycle[0];
                            this.form.variableClearCycleM = variableClearCycle[1];
                            this.form.variableClearCycleD = variableClearCycle[2];
                            this.form.warnRecordClearCycleY = warnRecordClearCycle[0];
                            this.form.warnRecordClearCycleM = warnRecordClearCycle[1];
                            this.form.warnRecordClearCycleD = warnRecordClearCycle[2];
                        } else {

                        }
                    }

                })
            },
            //修改弹窗关闭
            handleClose(done) {
                done();
            },
            //修改周期点击
            change() {
                this.dialogVisible = true;
            },
            //弹窗取消
            cancel() {
                this.getData();
                this.dialogVisible = false
            },
            //弹窗确定
            sure() {
                let data = {
                    measureClearCycle: 0,
                    variableClearCycle: 0,
                    warnRecordClearCycle: 0
                };
                data.measureClearCycle = this.form.measureClearCycleY*360 + this.form.measureClearCycleM*30 + this.form.measureClearCycleD;
                data.variableClearCycle = this.form.variableClearCycleY*360 + this.form.variableClearCycleM*30 + this.form.variableClearCycleD;
                data.warnRecordClearCycle = this.form.warnRecordClearCycleY*360 + this.form.warnRecordClearCycleM*30 + this.form.warnRecordClearCycleD;
                if (data.measureClearCycle == 0) {
                    this.$message.error('原始测值清除周期最小不能为0！');
                    return;
                }
                if (data.variableClearCycle == 0) {
                    this.$message.error('变量清除周期最小不能为0！');
                    return;
                }
                if (data.warnRecordClearCycle == 0) {
                    this.$message.error('报警记录清除周期最小不能为0！');
                    return;
                }
                this.$axios({
                    url: this.$BaseUrl + '/system/setSystem',
                    method: 'post',
                    data: data
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.$message({
                            message: '修改成功!',
                            type: 'success'
                        });
                        this.getData();
                        this.dialogVisible = false
                    }

                })
            }
        }
    }
</script>

<style scoped>

    /*内部样式*/
    .content {
        width: 400px;
        font-size: 14px;
        text-align: left;
        margin: 5%;
    }

    .wrapper {
        margin: 5% 0;
    }

    .item:nth-child(1) {
        width: 100%;
    }


</style>

<template>
    <div class="content-wrapper" v-cloak>
        <div class="content">
            <div class="flex-between wrapper">
                <div class="item">用户头像：</div>
                <div class="item">
                    <el-upload
                            class="avatar-uploader"
                            action="#"
                            :show-file-list="false"
                            :http-request="picSubmit"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="item"></div>
            </div>

            <div class="flex-between wrapper">
                <div class="item">用户名：</div>
                <div class="item">
                    <el-input v-model="userName" size="small" disabled></el-input>
                </div>
                <div class="item"></div>
            </div>
            <div class="flex-between wrapper">
                <div class="item">姓名：</div>
                <div class="item">
                    <el-input v-model="name" size="small" disabled></el-input>
                </div>
                <div class="item"></div>
            </div>
            <div class="flex-between wrapper">
                <div class="item">性别：</div>
                <div class="item">
                    <el-input v-model="sex" size="small" disabled></el-input>
                </div>
                <div class="item"></div>
            </div>
<!--            <div class="flex-between wrapper">-->
<!--                <div class="item">用户类型：</div>-->
<!--                <div class="item">-->
<!--                    <el-input v-model="userType" size="small" disabled></el-input>-->
<!--                </div>-->
<!--                <div class="item"></div>-->
<!--            </div>-->
            <div class="flex-between wrapper">
                <div class="item">手机号码：</div>
                <div class="item">
                    <el-input v-model="phone" size="small" disabled></el-input>
                </div>
                <div class="item">
<!--                    <el-button type="primary" size="small" plain @click="changeMobile">修改</el-button>-->
                </div>
            </div>
        </div>
        <el-dialog
                title="修改手机号码"
                :visible.sync="visible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="手机号码：" prop="mobile">
                    <el-input v-model="ruleForm.mobile" size="small" prefix-icon="el-icon-mobile-phone"
                              placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="验证码：" prop="code">
                    <div class="flex-between">
                        <el-input style="width: 60%" size="small" v-model="ruleForm.code" prefix-icon="el-icon-lock"
                                  placeholder="请输入验证码"></el-input>
                        <el-button type="primary" size="small" :disabled="disabled" class="code" @click="getCode">{{code}}
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="sure('ruleForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userInfo",
        data() {
            return {
                // 头像地址
                imageUrl: '',
                //用户名
                userName: this.$store.state.userInfo.userName,
                //姓名
                name: this.$store.state.userInfo.name,
                //性别
                sex: this.$store.state.userInfo.sex==1?'男':'女',
                //用户类型
                userType: this.$store.state.userInfo.userType==0?'管理端':'业主端',
                //手机号码
                phone:this.$store.state.userInfo.mobile,
                ruleForm:{
                    mobile:'',
                    code:''
                },
                rules: {
                    mobile: [
                        {required: true, message: '请填写修改手机号', trigger: 'blue'}
                    ],
                    code:[
                        {required: true, message: '请填写验证码', trigger: 'blue'}
                    ],
                },
                //弹窗显示
                visible:false,
                //验证码button
                code: '获取验证码',
                //倒计时
                showNumber: 60,
                //验证码button是否可以点击
                disabled:false
            };
        },
        created() {
            this.$store.state.nowName='个人信息';
            this.imageUrl=this.$store.state.userImgUrl;
        },
        methods: {
            //上传前验证
            beforeAvatarUpload(file) {
                const isType = file.type === 'image/jpeg'||file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                this.imgCheck=true;
                if (!isType) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                    this.imgCheck=false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isType && isLt2M;
            },
            //弹窗上传图片
            picSubmit(content) {
                let fromData = new FormData();
                fromData.set('userImg', content.file);
                this.$axios({
                    url: this.$BaseUrl + '/personInfo/updateUserImg',
                    method: 'post',
                    data: fromData
                }).then(res => {
                    if (res.data.success == false) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.$store.state.userImgUrl = this.$url + res.data.data;
                        this.imageUrl = this.$url + res.data.data;
                    }
                })
            },
            //获取验证码
            getCode() {
                let ready=false;
                new Promise(resolve => {
                    ready= this.checkPhone(this.ruleForm.mobile);
                    resolve()
                }).then(() => {
                    if (ready){
                        this.disabled = true;
                        let data = {
                            mobile: this.ruleForm.mobile,
                        };
                        this.countDown();
                        this.$axios({
                                url: this.$BaseUrl + '/personInfo/getMessageAuthCode',
                                method: 'post',
                                data: data
                            }
                        ).then((res) => {
                            if (res.data.success == 1) {
                                this.$message({
                                    message: '验证码发送成功!',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'warning'
                                });
                            }

                        })
                    }
                });

            },
            countDown() {
                if (this.showNumber === 0) {
                    this.disabled = false;
                    this.code = '获取验证码';
                    this.showNumber = 60;
                } else {
                    this.code = this.showNumber--;
                    setTimeout(() => {
                        this.countDown()
                    }, 1000);
                }
            },
            //检查手机号
            checkPhone(str) {
                let re = /^1\d{10}$/;
                if (re.test(str)) {
                    return true
                } else {
                    this.$message({
                        message: '请输入正确的手机号!',
                        type: 'warning'
                    });
                    this.ruleForm.mobile = '';
                    return false
                }
            },
            //修改手机号弹窗关闭
            handleClose(done){
                done()
            },
            //修改手机号
            changeMobile(){
                this.visible=true;
            },
            //修改手机号取消
            cancel(){
                this.visible=false;
                this.ruleForm.mobile='';
                this.ruleForm.code='';
                //异步操作
                setTimeout(()=>{
                    this.$refs['ruleForm'].clearValidate();
                },100);

            },
            //修改手机号确认
            sure(formName){
                //验证
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            mobile: this.ruleForm.mobile,
                            messageAuthCode: this.ruleForm.code
                        };
                        this.$axios({
                            url: this.$BaseUrl + '/personInfo/updateMobile',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.success == true) {
                                this.$message({
                                    message: '手机号修改成功!',
                                    type: 'success'
                                });
                                this.visible=false;
                                this.phone=this.ruleForm.mobile;
                                this.ruleForm.mobile='';
                                this.ruleForm.code='';
                                this.visible=false;
                                //异步操作
                                setTimeout(()=>{
                                    this.$refs['ruleForm'].clearValidate();
                                },100);
                            } else {
                                this.$message.error(res.data.msg);
                            }

                        })

                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    /*头像样式*/
    .content-wrapper >>> .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-bottom: 100px;
    }

    .content-wrapper >>> .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .content-wrapper >>> .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .content-wrapper >>> .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    /*内部样式*/
    .content {
        width: 500px;
        text-align: center;
        margin: 5%;
    }

    .wrapper{
        margin: 5% 0;
    }
    .item:nth-child(1) {
        width: 20%;
        text-align: right ;
    }

    .item:nth-child(2) {
        width: 60%;
        text-align: left;
        padding-left: 5%;
    }

    .item:nth-child(3) {
        width: 20%;
    }
    /*用户头像高度*/
    .content>>>.avatar-uploader{
        height: 200px;
    }
    /*验证button样式*/
    .code {
        width: 38%;
    }
</style>

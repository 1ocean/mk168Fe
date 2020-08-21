<template>
    <div id="wrapper">
        <img class="bg" src="../assets/image/login/bg.jpg" alt="" width="100%" height="65%">
        <div class="flex-evenly logo">
            <img src="../assets/image/home/mk168logo.jpg" height="100px" width="200px"/>
            <span style="margin-top: 0px;">
                            HSE在线报警监控系统
            </span>
        </div>
        <div class="phone">
            服务热线：400-682-2950
        </div>
        <div class="bottom">
            Copyright © 2014, All Rights Reserved.康明斯有限公司 苏ICP备14045726号-1
        </div>
        <el-card class="box-card">
            <div class="loginTitle">账号登录
            </div>
            <!--            <el-tabs v-model="activeName" @tab-click="handleClick">-->
            <!--                <el-tab-pane label="账号密码登录" name="1">-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
                <el-form-item label="" prop="account">
                    <el-input v-model="ruleForm.account" prefix-icon="el-icon-user"
                              placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="ruleForm.password" prefix-icon="el-icon-lock"
                              placeholder="请输入密码"
                              @keyup.enter.native="accountSubmitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <div class="flex-between">
                        <el-checkbox v-model="checked">记住密码</el-checkbox>
                        <el-button type="text" @click="forget">忘记密码</el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="submit" @click="accountSubmitForm('ruleForm')">
                        {{loginText}}
                    </el-button>
                </el-form-item>
            </el-form>
            <!--                </el-tab-pane>-->
            <!--                <el-tab-pane label="手机号登录" name="2">-->
            <!--                    <el-form :model="phoneRuleForm" :rules="phoneRules" ref="phoneRuleForm" label-width="0"-->
            <!--                             class="demo-ruleForm">-->
            <!--                        <el-form-item label="" prop="account">-->
            <!--                            <el-input v-model="phoneRuleForm.account" prefix-icon="el-icon-mobile-phone"-->
            <!--                                      placeholder="请输入手机号"></el-input>-->
            <!--                        </el-form-item>-->
            <!--                        <el-form-item label="" prop="code">-->
            <!--                            <div class="flex-between">-->
            <!--                                <el-input style="width: 60%" v-model="phoneRuleForm.code" prefix-icon="el-icon-lock"-->
            <!--                                          placeholder="请输入验证码"></el-input>-->
            <!--                                <el-button type="primary" :disabled="disabled" class="code" @click="getCode">{{code
            }}-->
            <!--                                </el-button>-->
            <!--                            </div>-->
            <!--                        </el-form-item>-->
            <!--                        <el-form-item>-->
            <!--                            <el-button class="phoneSubmit" type="primary" @click="phoneSubmitForm('phoneRuleForm')">-->
            <!--                                {{loginText}}-->
            <!--                            </el-button>-->
            <!--                        </el-form-item>-->
            <!--                    </el-form>-->
            <!--                </el-tab-pane>-->
            <!--            </el-tabs>-->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                //控制获取验证码按钮点击
                disabled: false,
                //验证码button
                code: '获取验证码',
                //倒计时
                showNumber: 60,
                //当前选择登录方式
                activeName: '1',
                //记住密码
                checked: false,
                //账号验证
                ruleForm: {
                    account: '',
                    password: ''
                },
                //账号验证规则
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                //手机登录验证
                phoneRuleForm: {
                    account: '',
                    code: ''
                },
                //手机登录验证规则
                phoneRules: {
                    account: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                //登录文字
                loginText: '登录'
            };
        },
        created() {
            //从loaclstroage 里获取账号和密码，并判断是否选中
            this.ruleForm.account = JSON.parse(window.localStorage.getItem('account'));
            this.ruleForm.password = JSON.parse(window.localStorage.getItem('password'));
            this.checked = window.localStorage.getItem('checked') === 'true';
        },
        methods: {
            //加密
            aesMinEncrypt(word) {
                let _word = CryptoJS.enc.Utf8.parse(word),
                    _key = CryptoJS.enc.Utf8.parse("mantoosoftware11"),
                    _iv = CryptoJS.enc.Utf8.parse("mantooSoftwareIv");
                let encrypted = CryptoJS.AES.encrypt(_word, _key, {
                    iv: _iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
            },
            //解密
            aesDecrypt(word) {
                let _key = CryptoJS.enc.Utf8.parse("mantoosoftware11"),
                    _iv = CryptoJS.enc.Utf8.parse("mantooSoftwareIv");
                let decrypted = CryptoJS.AES.decrypt(word, _key, {
                    iv: _iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8);
            },
            //账号登录提交
            accountSubmitForm(formName) {
                //验证
                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        this.loginText = '登录中...';
                        let data = {
                            userName: this.ruleForm.account,
                            password: this.aesMinEncrypt(this.ruleForm.password)
                        };
                        this.$axios({
                            url: this.$BaseUrl + '/login',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.success == true) {
                                //保存账号密码
                                if (this.checked) {
                                    window.localStorage.setItem('account', JSON.stringify(this.ruleForm.account));
                                    window.localStorage.setItem('password', JSON.stringify(this.ruleForm.password));
                                    window.localStorage.setItem('checked', 'true');
                                } else {
                                    window.localStorage.removeItem('account');
                                    window.localStorage.removeItem('password');
                                    window.localStorage.setItem('checked', 'false');
                                }
                                //用户信息赋值
                                this.$store.state.userInfo = res.data.data;
                                //头像设置
                                this.$store.state.userImgUrl = this.$url + res.data.data.userImgUrl;
                                //跳转登录
                                this.$router.push("/dataBoard/bigDataHome")
                            } else {
                                this.$message.error(res.data.msg);
                                this.loginText = '登录';
                            }

                        })
                    } else {
                        return false;
                    }
                });
            },
            //手机验证登录提交
            phoneSubmitForm(formName) {
                //验证
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            mobile: this.phoneRuleForm.account,
                            messageAuthCode: this.phoneRuleForm.code
                        };
                        this.$axios({
                            url: this.$BaseUrl + '/loginByMobile',
                            method: 'post',
                            data: data
                        }).then((res) => {
                            if (res.data.success == true) {
                                //用户信息赋值
                                this.$store.state.userInfo = res.data.data;
                                //头像设置
                                this.$store.state.userImgUrl = this.$url + res.data.data.userImgUrl;
                                //跳转登录
                                this.$router.push("/homePage")
                            } else {
                                this.$message.error(res.data.msg);
                                this.loginText = '登录';
                            }

                        })

                    } else {
                        return false;
                    }
                });
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
                    this.phoneRuleForm.account = '';
                    return false
                }
            },
            //获取验证码
            getCode() {
                let ready = false;
                new Promise(resolve => {
                    ready = this.checkPhone(this.phoneRuleForm.account);
                    resolve()
                }).then(() => {
                    if (ready) {
                        this.disabled = true;
                        let data = {
                            mobile: this.phoneRuleForm.account,
                        };
                        this.countDown();
                        this.$axios({
                                url: this.$BaseUrl + '/getMessageAuthCode',
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
            //tabs 标签切换
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            //忘记密码提示关闭
            forget() {
                this.$confirm('请联系管理员重置密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                }).catch(() => {

                });

            }
        }
    }
</script>

<style scoped>
    #wrapper {
        width: 100%;
        height: 100%;
    }

    .bg {
        margin-top: 15vh;
    }

    .box-card {
        position: absolute;
        right: 7%;
        top: 24%;
        width: 400px;
        box-sizing: border-box;
    }

    .loginTitle {
        margin: 20px auto;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }

    #wrapper >>> .el-tabs__item {
        width: 100%;
        text-align: center;
    }

    #wrapper >>> .el-tabs__nav {
        width: 179px;
        text-align: center;
    }

    .submit {
        width: 100%;
    }

    #wrapper >>> .el-tabs__content {
        padding-top: 30px;
    }

    .code {
        width: 38%;
    }

    /*手机号登录按钮样式*/
    .phoneSubmit {
        width: 100%;
        margin-top: 62px;
    }

    /*左上角公司logo*/
    .logo {
        width: 600px;
        position: absolute;
        top: 2.5%;
        left: 8%;
        height: 10%;
        font-size: 2rem;
        font-weight: 600;
        letter-spacing: 2px;
        font-family: "Microsoft YaHei";
        box-sizing: border-box;
    }

    /*服务热线*/
    .phone {
        position: absolute;
        font-weight: 500;
        font-size: 1.2vw;
        top: 7.5%;
        right: 8%;
        font-family: "Microsoft YaHei";
    }

    /*底部*/
    .bottom {
        font-family: "Microsoft YaHei";
        position: absolute;
        font-size: 1.2vw;
        bottom: 10%;
        width: 100%;
        text-align: center;
    }
</style>

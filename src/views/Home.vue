<template>
    <div class="wrapper" v-cloak>
        <el-container>
            <!--            左侧菜单-->
            <el-aside :width="asideWidth" >
                <div class="flex-evenly asideCompany">
                    <img src="../assets/image/home/mk168logo.jpg" class="logo" width="100%" />
<!--                    <span v-if="nameControl"-->
<!--                          style="font-size:18px;padding-top: 5px;box-sizing: border-box;margin-left: -20px">HES监测平台</span>-->
                </div>
                <el-menu
                        class="el-menu-vertical-demo menuClass"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="rgb(0,21,41)"
                        text-color="#fff"
                        :unique-opened="false"
                        active-text-color="rgb(18,152,157)"
                        :default-active="$store.state.defaultActive"
                        :collapse="isCollapse">
                    <!--                    循环vuex 里的菜单列表-->
                    <el-submenu v-for="(item , index) in menuList" :key="index" :index="index+''"
                    >
                        <template slot="title">
                            <i :class="item.icon" style="color:white"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <el-menu-item-group v-for="(i,index2) in item.tabMenuList" :key="index2">
                            <el-menu-item @click="listClick(i)" :index="i.href" style="padding-left: 50px">{{i.name}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-container>
                <!--                头部-->
                <el-header>
                    <div class="header flex-between">
                        <div class="header-control">
                            <i v-if="fold" class="cursor el-icon-s-fold" @click="changeWidth('left')"></i>
                            <i v-else class="cursor el-icon-s-unfold" @click="changeWidth('right')"></i>
                            {{$store.state.nowName}}
                        </div>

                        <div class="header-user flex-between">
                            <el-button type="primary" @click="goHomePage" size="mini"
                                       style="position: absolute;right: 240px" plain>数据看板
                            </el-button>
                            <el-popover
                                    placement="bottom"
                                    width="10"
                                    trigger="hover">
                                <div style="text-align: center">
                                    <el-button class="button" size="mini" type="text" @click="loginOut()">退出登录
                                    </el-button>
                                    <el-button class="button" size="mini" type="text" @click="userInfos()">个人信息
                                    </el-button>
                                    <el-button class="button" size="mini" type="text" @click="changePassword()">修改密码
                                    </el-button>
                                    <!--                                    <el-button class="button" size="mini" type="text" @click="appVisible=true">APP下载-->
                                    <!--                                    </el-button>-->
                                    <el-button class="button" size="mini" type="text" @click="wechatVisible=true">微信公众号
                                    </el-button>
                                </div>

                                <div class="flex-around" slot="reference">
                                    <el-avatar
                                            :src="$store.state.userImgUrl">
                                    </el-avatar>
                                    <el-button size="mini" type="text" round>{{userName}}</el-button>
                                </div>
                            </el-popover>

                        </div>
                    </div>
                </el-header>
                <el-main>
                    <!--                    解决min-height 导致子元素无法继承高度的问题-->
                    <div class="box-out">
                        <!--                    主体部分-->
                        <div class="mainItem">
                            <!--                        动态tabs功能，方法已经写好，样式调整好，取消隐藏就能用 pis: 需要修改一下main-content 高度 设置为 calc(100% - 56px)-->
                            <!--                        <el-tabs v-model="editableTabsValue" type="card" editable @tab-click="tabsClick"-->
                            <!--                                 @edit="handleTabsEdit">-->
                            <!--                            <el-tab-pane-->
                            <!--                                    :key="item.name"-->
                            <!--                                    v-for="(item, index) in editableTabs"-->
                            <!--                                    :label="item.title"-->
                            <!--                                    :name="item.name"-->
                            <!--                            >-->
                            <!--                            </el-tab-pane>-->
                            <!--                        </el-tabs>-->
                            <div id="main-content">
                                <!--                                子页面位置-->
                                <router-view/>
                            </div>
                        </div>
                        <!--                    动态选项卡-->
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog
                title="修改密码"
                :visible.sync="passwordVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="passwordClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="原密码：" prop="oldPassWord">
                    <el-input size="small" v-model="ruleForm.oldPassWord" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="password">
                    <el-input size="small" v-model="ruleForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码：" prop="surePassword">
                    <el-input size="small" v-model="ruleForm.surePassword" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="passwordCancel">取 消</el-button>
                <el-button type="primary" @click="passwordSure('ruleForm')">确 定</el-button>
              </span>
        </el-dialog>
        <el-dialog
                title="APP下载二维码"
                :visible.sync="appVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="passwordClose">
            <div style="text-align: center">
                <img src="../assets/image/home/MK166_APP.png" height="400" width="400"/>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="appVisible=false">关闭</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="扫码关注公众号"
                :visible.sync="wechatVisible"
                :close-on-click-modal="false"
                width="500px"
                :before-close="passwordClose">
            <div style="text-align: center">
                <img src="../assets/image/home/wechat.png" height="400" width="400"/>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="wechatVisible=false">关闭</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'Home',
        data() {
            return {
                //控制菜单栏收起
                isCollapse: false,
                //控制公司名称显示
                nameControl: true,

                //动态tabs下标
                editableTabsValue: '1',
                //动态tabs数组
                editableTabs: [],

                //控制左侧栏宽度
                asideWidth: '220px ',
                //控制图标左右显示
                fold: true,


                //当前用户名称
                userName: '',
                //当前用户头像
                userImgUrl: '',


                //修改密码弹窗
                passwordVisible: false,
                //修改数据
                ruleForm: {
                    oldPassWord: '',
                    password: '',
                    surePassword: '',
                },
                rules: {
                    oldPassWord: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    surePassword: [
                        {required: true, message: '请确认新密码', trigger: 'blur'}
                    ]
                },
                //下载app显示
                appVisible: false,
                //微信公众号显示
                wechatVisible: false,

                //菜单数据
                menuList: [],
            }
        },
        mounted() {
            this.menuList = this.$store.state.userInfo.menuList;
            //根据后端要求业主端登录时不可以有用户中心页面
            if (this.$store.state.userInfo.userType == 1) {
                this.menuList = this.menuList.filter(i => i.menuId != '01')
            }
            this.userName = this.$store.state.userInfo.name;
            this.$store.state.defaultActive = this.$route.path;
        },
        methods: {
            //测试
            ceshi() {
                alert(123)
            },
            //修改密码右上角关闭
            passwordClose(done) {
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100);
                done();
            },
            //侧边栏点击
            listClick(row) {
                //查询是否已有此标签
                let have = -1;
                for (let i in this.editableTabs) {
                    if (row.href == this.editableTabs[i].name) {
                        have = i
                    }
                }
                if (have === -1) {
                    //调用新增tabs标签
                    this.handleTabsEdit(row, 'add');
                } else {
                    //如果有就高亮
                    this.editableTabsValue = row.href;
                }
                //当前显示name修改值
                this.$store.state.nowName = row.name;
                //当前default-active修改值 必须修改 否则后面修改不可以改变选中
                this.$store.state.defaultActive = row.href;
                //跳转至点击页面
                this.$router.push(row.href)
            },
            //侧边栏打开
            handleOpen(key, keyPath) {
            },
            //侧边栏关闭
            handleClose(key, keyPath) {
            },
            //动态tables方法
            handleTabsEdit(targetName, action) {
                //当为增加时 设置title 和 name (name 为跳转地址)
                if (action === 'add') {
                    this.editableTabs.push({
                        title: targetName.name,
                        name: targetName.href,
                    });
                    this.editableTabsValue = targetName.href;
                }
                if (action === 'remove') {
                    let tabs = this.editableTabs;
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                    this.$router.push(activeName);
                                } else {
                                    this.$router.push('/homePage');
                                }
                            }
                        });
                    }
                    this.editableTabsValue = activeName;
                    this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                }
            },
            //动态选项卡点击
            tabsClick(tab, event) {
                this.$router.push(tab.name);
            },
            //修改左侧菜单栏整体宽度
            changeWidth(type) {
                if (type === 'left') {
                    this.isCollapse = !this.isCollapse;
                    this.nameControl = !this.nameControl;
                    setTimeout(() => {
                        this.fold = !this.fold;
                        this.asideWidth = '100px'
                    }, 500)
                } else {
                    this.asideWidth = '220px ';
                    this.fold = !this.fold;
                    setTimeout(() => {
                        this.isCollapse = !this.isCollapse;
                    }, 200);
                    setTimeout(() => {
                        this.nameControl = !this.nameControl;
                    }, 300)
                }
            },
            //首页按钮点击
            goHomePage() {
                // this.$store.state.nowName = '首页';
                this.$router.push('/dataBoard/bigDataHome')
            },
            //退出登录
            loginOut() {
                this.$confirm('确认要退出吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: this.$BaseUrl + '/logout',
                        method: 'post'
                    }).then((res) => {
                        if (res.data.success == false) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$store.state.defaultActive = '';
                            this.$router.push('/');
                        }
                    })
                }).catch(() => {
                });
            },

            //跳转个人信息页面
            userInfos() {
                this.$store.state.nowName = '个人信息';
                this.$router.push('/system/userInfo')
            },
            //修改密码
            changePassword() {
                this.passwordVisible = true
            },
            //修改密码弹窗确认
            passwordSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {...this.ruleForm};
                        if (data.password !== data.surePassword) {
                            this.$message.error('两次密码不一致，请重新输入！');
                            this.ruleForm.surePassword = '';
                            return;
                        }
                        this.$axios({
                            url: this.$BaseUrl + '/personInfo/updatePassWord',
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
                                this.ruleForm.oldPassWord = '';
                                this.ruleForm.password = '';
                                this.ruleForm.surePassword = '';
                                this.passwordVisible = false;
                                setTimeout(() => {
                                    this.$refs['ruleForm'].clearValidate();
                                }, 100);
                                this.$router.replace('/')
                            }

                        })
                    }
                })
            },
            //修改密码弹窗取消
            passwordCancel() {
                this.ruleForm.oldPassWord = '';
                this.ruleForm.password = '';
                this.ruleForm.surePassword = '';
                this.passwordVisible = false;
                setTimeout(() => {
                    this.$refs['ruleForm'].clearValidate();
                }, 100)
            },
        }
    }
</script>
<style scoped>
    html, body, .wrapper {
        width: 100%;
        height: 100%;
    }

    /*头部css*/
    .el-header {
        text-align: center;
        height: 65px !important;
        margin: 0;
    }

    /*左侧css*/
    .el-aside {
        text-align: left;
        height: 100vh;
        transition: width 0.1s;
        -webkit-transition: width 0.1s; /* Safari */
        overflow: hidden;
    }

    /*主体css*/
    .el-main {
        height: calc(100vh - 120px);
        background-color: rgb(240, 242, 245);
        padding: 20px 15px;
        box-sizing: border-box;
    }

    /*tabs距离底部40px*/
    body > .el-container {
        margin-bottom: 40px;
    }

    /*菜单css 修改logo也要改这个*/
    .el-menu {
        height: calc(100% - 65px);
        width: 100%;
    }

    /*tabs头部固定高度*/
    .el-main >>> .el-tabs__header {
        height: 41px !important;
    }

    /*子组件css*/
    #main-content {
        width: 100%;
        height: 100%;
        /*height: calc(100% - 56px);*/
    }

    /*左上角公司css*/
    .asideCompany {
        height: 65px;
        width: 100%;
        background-color: rgb(0, 40, 77);
        line-height: 65px;
        box-sizing: border-box;
        font-size: 20px;
        font-weight: bolder;
        text-align: center;
        color: white;

    }

    /*菜单栏收缩css*/
    .header-control {
        font-size: 17px;
        font-weight: bold;
    }

    /*头部用来垂直居中的css*/
    .header {
        line-height: 65px;
    }

    /*首页用户那里的css*/
    .header-user {
        width: 200px;
        padding-right: 5%;
        /*cursor: pointer;*/
        box-sizing: border-box;
    }

    /*主页面这个样式会改变之后的子页面tabs的样式，谨慎使用，容易出问题*/
    /*!*隐藏新增tabs的icon*!*/
    /*.el-tabs__content {*/
    /*    display: none;*/
    /*}*/

    /*!*隐藏tabs内容*!*/
    /*.el-main >>> .el-tabs__new-tab {*/
    /*    display: none !important;*/
    /*}*/
    /*解决min-height子元素无法使用百分比得问题*/
    .box-out {
        display: flex;
        min-height: 100%;
    }

    /*tabs整体css*/
    .mainItem {
        width: 99%;
        min-height: 98%;
        margin: 0 auto;
        background: white;
        /*padding: 1%;*/
        box-sizing: border-box;
    }

    .menuClass {
        overflow-y: auto;
    }

    .menuClass::-webkit-scrollbar {
        display: none; /*隐藏滚动条*/
    }

    /*按钮样式*/
    .button {
        display: block;
        margin: 0 !important;
        width: 100%;
    }
    .logo{
        border:0px solid rgb(68,87,107);
        margin: 0 auto;
        /*border-radius: 50%;*/
    }
</style>

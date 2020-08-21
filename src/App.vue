<template>
    <div id="app" v-cloak>
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'app',
        mounted() {
            //解决vuex刷新丢失的问题
            window.addEventListener('unload', this.saveState)
        },
        methods: {
            //解决vuex刷新丢失的问题
            saveState() {
                sessionStorage.setItem('state', JSON.stringify(this.$store.state))
            }
        }
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    /*vue设置初始隐藏未加载数据*/
    [v-cloak] {
        display: none;
    }

    html, body {
        width: 100%;
        height: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
    }

    /*全局flex  css*/
    .flex-around {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    /*全局flex  css*/
    .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    /*全局树形左右样式*/
    .measurementFlex{
        display: flex;
        justify-content: space-between;
    }
    /*全局flex  css*/
    .flex-evenly {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    /*全局flex  css*/
    .flex-start {
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
        overflow: auto;
    }

    /*全局鼠标hovercss*/
    .cursor {
        cursor: pointer;
    }

    /*全局外部遮罩层css*/
    .content-wrapper {
        padding: 2% 2%;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
    }

    /*全局表格css*/
    .table {
        /*height: 60%;*/
        overflow: auto;
    }

    /*全局分页css*/
    .pagination {
        margin: 5% 0 0 33%;
    }

    /*form表单不换行*/
    .formInline {
        white-space: nowrap;
    }

    /*红色*图标*/
    .tag {
        color: #F56C6C;
        position: relative;
        /*top: 30px;*/
        left: 8px;
    }

    /*a标签去掉下划线*/
    a {
        text-decoration: none;
        color: rgb(24, 144, 255);
        cursor: pointer;
    }

    /*修改高德地图输入提示框z-index等级，不然会被element 压住看不见*/
    .amap-sug-result {
        z-index: 9999 !important;
    }

    /*根据产品要求修改el-dialog样式*/
    .el-dialog__body {
        padding: 30px 40px !important;
    }

    /*根据产品要求修改el-dialog样式*/
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }

    /*根据产品要求修改el-dialog样式*/
    .el-dialog__footer {
        border-top: 1px solid #ddd;
        padding-top: 20px !important;
    }


    /*左侧菜单栏样式修改套件*/
    .el-submenu__title {
        background-color: rgb(0, 21, 41) !important;
    }

    .el-submenu .el-menu-item {
        background-color: rgb(0, 12, 23) !important;
    }

    .el-menu-item:hover {
        background-color: rgb(24, 144, 255) !important;
    }

    .el-menu-item.is-active {
        /*background-color: rgb(24, 144, 255) !important;*/
    }

    .el-menu-item-group__title {
        background-color: rgb(0, 12, 23) !important;
        display: none;

    }
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow{
        color: white;
    }

    /*tree 得加减号图标样式*/
    .el-icon-caret-right:before {
        content: url("./assets/add.png") !important;
        font-size: 8px;
    }

    .expanded:before {
        content: url("./assets/cancel.png") !important;
        transform:rotate(-90deg);
        font-size: 8px;
    }

    .is-leaf.el-tree-node__expand-icon.el-icon-caret-right:before {
        content: "" !important;
        font-size: 16px;
    }
    .tree-container /deep/ .el-tree > .el-tree-node:after {
        border-top: none;
    }
    .tree /deep/ .el-tree-node {
        position: relative;
        padding-left: 16px;
    }

    .tree /deep/ .el-tree-node__children {
        padding-left: 16px;
    }

    .tree /deep/ .el-tree-node :last-child:before {
        height: 38px;
    }

    .tree /deep/ .el-tree > .el-tree-node:before {
        border-left: none;
    }

    .tree-container /deep/ .el-tree > .el-tree-node:after {
        border-top: none;
    }

    .tree /deep/ .el-tree-node:before {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .tree /deep/ .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .tree /deep/ .el-tree-node:before {
        border-left: 1px dashed #4386c6;
        bottom: 0px;
        height: 100%;
        top: -26px;
        width: 1px;
    }

    .tree /deep/ .el-tree-node:after {
        border-top: 1px dashed #4386c6;
        height: 20px;
        top: 12px;
        width: 24px;
    }
    /*解决表格闪烁得问题*/
    .el-table{
        width:99% !important;
    }

    /*隐藏但依然占位*/
    .visibility{
        visibility: hidden;
    }
</style>

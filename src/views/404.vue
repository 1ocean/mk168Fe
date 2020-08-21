<template>
    <div class="wrapper">
        <div class="button">
            <el-button type="primary" plain @click="goLogin">返回登录</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "overtime",
        methods: {
            goLogin() {
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        width: 100%;
        height: 100%;
        background: url("../assets/404.png") no-repeat;
        background-size: 100% 100%;
    }

    .button {
        position: absolute;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

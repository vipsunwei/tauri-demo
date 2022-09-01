<template>
  <div class="error-page">
    <div class="error-page__title">{{ VITE_APP_TITLE }}</div>
    <div class="error-page__main">
      <i class="icon-i"></i>
      <span class="text"> 您没有“{{ VITE_APP_TITLE }}”的访问权限！请联系管理员 </span>
    </div>
    <el-button class="back-btn" type="primary" @click="back">首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const back = () => {
  router.replace({ name: "Main" });
};
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE;
</script>

<style lang="scss" scoped>
.error-page {
  background-image: url(../assets/errorpagebg.jpg);
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1024;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    position: absolute;
    z-index: 1024;
    top: 0;
    left: 0;
    margin-top: 2.083333vw;
    margin-left: 2.604167vw;
    font-size: 2.5vw;
    font-family: PangMenZhengDao;
    font-weight: 400;
    color: #ffffff;
    background: linear-gradient(0deg, #009cff 0%, #ffffff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &__main {
    display: flex;
    align-items: center;
    margin-bottom: 3.072917vw;
    .icon-i {
      background-image: url(../assets/icon-i.png);
      display: inline-block;
      width: 1.875vw;
      height: 1.875vw;
      background-size: 100% 100%;
      margin-right: 1.145833vw;
    }
    .text {
      font-size: 1.875vw;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .back-btn {
    width: 10vw;
    height: 2.916667vw;
    background: #0dd2e6;
    border-radius: 4px;
    border: 0;
    outline: 0;

    font-size: 1.354167vw;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>

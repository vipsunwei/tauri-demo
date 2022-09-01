<template>
  <header class="main-header">
    <div class="main-header__left">{{ VITE_APP_TITLE }}</div>
    <div class="main-header__right">
      <img draggable="false" class="avatar" src="../assets/default-avatar.png" />
      <div class="userinfo">
        <span class="username">欢迎您&nbsp;</span>
        <span>{{ loginName }}</span>
      </div>
      <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        title="确定退出吗?"
        @confirm="doLogout"
      >
        <template #reference>
          <el-button class="logout-btn"> 退出 </el-button>
        </template>
      </el-popconfirm>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { logout } from "../api";

const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE;
const store = useStore();
const router = useRouter();
const loginName = computed(() => store.state.user.loginName);
const doLogout = async () => {
  const result = await logout();
  if (result._MSG_.startsWith("OK")) {
    ElMessage.success("退出成功");
    await router.replace({ name: "Login" });
    store.commit("SET_USER", {});
    store.commit("RESET_ALL_STATE");
  } else {
    ElMessage.warning(result._MSG_);
    await router.replace({ name: "Login" });
  }
};
</script>

<style lang="scss" scoped>
.main-header {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 100%;
  height: 50px;
  background: rgba(0, 18, 37, 0.8);
  border: 1px solid #24507e;
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.56);
  // opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__left {
    font-size: 23px;
    font-family: PangMenZhengDao;
    font-weight: 400;
    color: #ffffff;
    line-height: 26px;
    margin-left: 28px;
    background: linear-gradient(0deg, #91d7de 0%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  &__right {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
    }
    .userinfo {
      margin: 0 20px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(136, 179, 210, 1);
      // line-height: 32px;
      .username {
        color: #ffffff;
      }
    }
    .logout-btn {
      // display: flex;
      // align-items: center;
      // justify-content: space-evenly;
      width: 96px;
      height: 50px;
      background: linear-gradient(0deg, #008997, #11d3e6);
      border: 0;

      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
    // .logout-icon {
    //   display: inline-block;
    //   background-image: url(../assets/icon-logout.png);
    //   background-size: 100% 100%;
    //   width: 16px;
    //   height: 16px;
    // }
    // .logout-text {
    //   font-size: 16px;
    //   font-family: PingFang SC;
    //   font-weight: 500;
    //   color: #ffffff;
    // }
  }
}
</style>

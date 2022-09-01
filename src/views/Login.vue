<template>
  <div class="login-bg login-page">
    <section class="login-form-wrap">
      <div class="login-title">
        <span>{{ VITE_APP_TITLE }}</span>
      </div>
      <div class="login-wrap">
        <div class="animate__animated animate__zoomIn login-form-bg">
          <!-- <div class="logo">{{ VITE_APP_TITLE }}</div> -->
          <el-form :model="loginForm" ref="loginFormRef" class="login-form" :rules="loginFormRules">
            <div class="input-cover" :class="focus.username ? 'input-bg' : 'input-bg__focus'">
              <i class="icon-username"></i>
              <el-form-item class="el-form-item-cover" prop="username">
                <el-input
                  class="username"
                  placeholder="用户名"
                  autocomplete="off"
                  v-model="loginForm.username"
                  @focus="usernameFocus"
                  @blur="usernameBlur"
                ></el-input>
              </el-form-item>
            </div>
            <div class="input-cover" :class="focus.password ? 'input-bg' : 'input-bg__focus'">
              <i class="icon-password"></i>
              <el-form-item class="el-form-item-cover" prop="password">
                <el-input
                  class="password"
                  type="password"
                  :show-password="false"
                  placeholder="密码"
                  autocomplete="off"
                  v-model="loginForm.password"
                  @focus="passwordFocus"
                  @blur="passwordBlur"
                ></el-input>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button
                class="btn-login outline"
                type="primary"
                :loading="loading"
                :disabled="isDisabled"
                @click="onSubmit"
              >
                <span>{{ loading ? "登录中..." : "登 录" }}</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { login } from "../api";
import { debounce } from "../utils/utils";

const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE;
const router = useRouter();
const store = useStore();
const loginFormRef = ref(null);
const loginForm = reactive({
  username: "admin",
  password: "admin123456",
});
const loginFormRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const focus = reactive({
  username: false,
  password: false,
});
const loading = ref(false);
const isDisabled = computed(() => {
  return !(loginForm.username && loginForm.password);
});

const usernameInput = debounce(
  (e) => {
    // 检查此用户名登录是否需要输入验证码
    // validateCatchaCode(loginForm.username);
  },
  500,
  false
);
const usernameFocus = (e) => {
  focus.username = true;
};
const usernameBlur = (e) => {
  focus.username = false;
};
const passwordFocus = (e) => {
  focus.password = true;
};
const passwordBlur = (e) => {
  focus.password = false;
};

const doLogin = async () => {
  if (loading.value) return;
  loading.value = true;
  const option = {
    loginName: loginForm.username,
    password: loginForm.password,
  };
  try {
    const result = await login(option);
    loading.value = false;
    const user = {};
    if (result.success) {
      user.USER_CODE = result.success;
      user.USER_TOKEN = result.success;
      user.loginName = loginForm.username;
      ElMessage.success("登录成功");
      router.push({ name: "Main" });
    } else {
      ElMessage.error(result.message || "登录失败");
    }
    store.commit("SET_USER", user);
  } catch (error) {
    loading.value = false;
  }
};

const onSubmit = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      doLogin();
    } else {
      ElMessage.warning("表单验证失败!请检查表单填写");
    }
  });
};
</script>

<style lang="scss" scoped>
@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 0 98% 0);
  }

  25% {
    clip-path: inset(0 98% 0 0);
  }
  50% {
    clip-path: inset(98% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 98%);
  }
}
.outline {
  &:hover {
    filter: contrast(1.1);
    opacity: 0.7;
  }

  &:active {
    filter: contrast(0.9);
    opacity: 0.7;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 2px solid #0dd2e6;
    transition: all 0.5s;
    animation: clippath 3s infinite linear;
    border-radius: 4px;
  }

  &::after {
    animation: clippath 3s infinite -1.5s linear;
  }
}

.login-bg {
  background-image: url(../assets/login-bg.jpg);
  background-size: 100% 100%;
  // background-size: cover;
  background-repeat: no-repeat;
}
.login-page {
  width: 100%;
  height: 100%;
  background-color: #021120;
  position: relative;
}
.login-form-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 1080px;
  margin-left: 1.5625vw;
}
.login-title {
  font-family: PangMenZhengDao;
  font-size: 50px;
  letter-spacing: 10px;
  margin-top: 4.083333vw;
  width: 100%;
  text-align: center;
  background-image: -webkit-linear-gradient(bottom, #65cce6, #def1f0, #7dd0df);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // text-shadow: 5px 5px 3px #7dd0df;
}
.login-wrap {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 26.041667vw;
  height: 22.083333vw;
  min-width: 500px;
  min-height: 424px;
}
.login-form-bg {
  background-image: url(../assets/login-form-bg@2x.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-form {
  width: 20.989583vw;
  min-width: 403px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .el-form-item-cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 0;
    :deep(.el-form-item__content) {
      display: flex;
      align-items: center;
      line-height: normal;
      height: 100%;
    }
  }
  .btn-login {
    min-width: 403px;
    min-height: 56px;
    // width: 20.989583vw;
    // height: 2.916667vw;
    background: #0dd2e6;
    border-radius: 4px;
    span {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .icon-username {
    background-image: url(../assets/icon-username@2x.png);
    display: inline-block;
    width: 22px;
    height: 26px;
    background-size: 100% 100%;
    // margin-right: 18px;
  }
  .icon-password {
    background-image: url(../assets/icon-password@2x.png);
    display: inline-block;
    width: 22px;
    height: 26px;
    background-size: 100% 100%;
    // margin-right: 18px;
  }
  .icon-captcha {
    background-image: url(../assets/icon-code@2x.png);
    display: inline-block;
    width: 22px;
    height: 26px;
    background-size: 100% 100%;
    flex-shrink: 0;
  }
  .input-cover {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-size: 100% 100%;
    width: 403px;
    height: 56px;
    margin-bottom: 1.5625vw;
    padding-left: 1.041667vw;
    :deep(.el-form-item__label) {
      width: 3.645833vw;
      padding: 0;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      // letter-spacing: 3px;
      text-align: left;
    }
    :deep(.el-input__wrapper) {
      background-color: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      color: #ffffff;
      &.is-focus {
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }
      &:hover {
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }
    }
  }
  .input-bg {
    background-image: url(../assets/input.png);
  }
  .input-bg__focus {
    background-image: url(../assets/input-selected@2x.png);
  }
  .operation {
    height: 3.28125vw;
    width: 20.989583vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .remember-password {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      :deep(.el-checkbox__inner) {
        background-color: transparent;
        width: 16px;
        height: 16px;
        border: 1px solid #00b8ff;
        border-radius: 3px 3px 3px 3px;
      }
      :deep(.el-checkbox__inner::after) {
        top: 2px;
        left: 5px;
      }
    }
    .forgot-password {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #00b8ff;
      cursor: pointer;
    }
  }
}
</style>

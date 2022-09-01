import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import store from "../store";

import { HTTPCODE } from "./httpCode";
import { isMobile } from "./utils";

const baseURL = import.meta.env.VITE_GO_API;
const goPath = import.meta.env.VITE_GO_PATH;
const instance = axios.create({
  baseURL: baseURL + goPath,
  timeout: 60 * 1000,
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    // if (!config.url.includes("login.do")) {
    //   config.headers["X-XSRF-TOKEN"] = store.state.user.USER_TOKEN;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (!isMobile()) {
      if (data?._MSG_?.startsWith("ERROR")) {
        ElMessage.error(data._MSG_);
      }
    }
    return data;
  },
  (error) => {
    console.warn("接口返回error", error);
    const response = error.response;
    console.log(response);
    if (response) {
      if (response?.status === HTTPCODE.Unauthorized && response?.data.STATE === "ERROR") {
        // store.commit("SET_USER", { USER_TOKEN: "XXXXXXXXXXX" });
        router.replace({ name: "Error" });
      } else if (response?.status === HTTPCODE.Unauthorized) {
        store.commit("SET_USER", {});
        store.commit("RESET_ALL_STATE");
        ElMessage.warning({ message: "会话已过期，请重新登录！", duration: 5 * 1000 });
        router.replace({ name: "Login" });
      } else {
        ElMessage.error(response.data || response.statusText);
      }
    } else {
      console.log(error.message);
      ElMessage.error({ message: error.message, duration: 5 * 1000 });
    }

    return Promise.reject(error);
  }
);

export default instance;

import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import store from "../store";
import { HTTPCODE } from "./httpCode";

const host = import.meta.env.VITE_GO_API;
const goPath = import.meta.env.VITE_GO_PATH;
const fileInstance = axios.create({
  baseURL: host + goPath,
  withCredentials: false,
});

fileInstance.interceptors.request.use(
  (config) => {
    // config.headers["X-XSRF-TOKEN"] = store.state.user.USER_TOKEN;
    return config;
  },
  (err) => Promise.reject(err)
);

fileInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const response = err.response;
    if (response) {
      if (response?.status === HTTPCODE.Unauthorized) {
        router.replace({ name: "Login" });
        store.commit("SET_USER", {});
        store.commit("RESET_ALL_STATE");
        ElMessage.warning({ message: "会话已过期，请重新登录！", duration: 5 * 1000 });
      } else {
        // 将Blob 对象转换成字符串
        const blob = response.data;
        const reader = new FileReader();
        reader.readAsText(blob, "utf-8");
        reader.onload = function (e) {
          console.warn(reader.result);
          ElMessage.error(reader.result);
        };
      }
    } else {
      ElMessage.error(err.message);
    }
    return Promise.reject(err);
  }
);

/**
 * 下载文件
 * @param {string} url
 * @param {object} config
 */
export function download(url, { method = "GET", responseType = "blob", params = {}, data = {} }) {
  return fileInstance({
    url,
    method,
    params,
    data,
    responseType,
  }).then((res) => {
    const { headers, data } = res;
    console.log("filename", headers["content-disposition"].split("filename="));
    console.log("type", headers["content-type"]);
    const filename = decodeURI(headers["content-disposition"].split("filename=")[1]);
    const blob = new Blob([data], { type: headers["content-type"] });
    return { filename, blob };
  });
}

/**
 * 保存文件到本地
 * @param {blob} blob
 * @param {string} filename 文件名
 */
export function saveAs(blob, filename) {
  if ("download" in document.createElement("a")) {
    const eleA = document.createElement("a");
    eleA.download = filename;
    eleA.style.display = "none";
    eleA.href = URL.createObjectURL(blob);
    document.body.appendChild(eleA);
    eleA.click();
    URL.revokeObjectURL(eleA.href); // 释放URL对象
    document.body.removeChild(eleA);
  } else {
    // IE下载
    navigator.msSaveOrOpenBlob(blob, filename);
  }
}

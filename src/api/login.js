import http from "../utils/request";
import { ver } from "../api/constants";

/**
 * 检查用户名是否需要输入验证码登录
 * @param {string} loginName 用户名
 * @returns {object} {check: "0"} check = 0不需要验证码，check = 1需要验证码
 */
export function isValidateCatchaCode(loginName) {
  const url = `/SY_ORG_LOGIN.isValidateCatchaCode.do`;
  return http.post(url, { loginName });
}

/**
 * 获取生成验证码需要的key
 * @returns {object} {key: "3kpV3UrTahafqLpyfN2c"}
 */
export function createKey() {
  const url = `/captcha?createKey=1`;
  return http.post(url);
}

/**
 * 获取验证码图片
 * @param {string} key
 */
export function captcha(key) {
  const url = `/captcha?key=${key}`;
  return http.get(url);
}

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export function login({ loginName, password }) {
  const url = `/${ver}/login`;
  return http.post(url, { loginName, passWd: password });
  // return new Promise((resolve, reject) => {
  //   if (loginName === "admin" && password === "aa123321") {
  //     resolve({ _MSG_: "OK,登录成功", USER_CODE: "usercode", USER_TOKEN: "usertoken" });
  //   } else {
  //     resolve({ _MSG_: "ERROR,用户名或密码错误" });
  //   }
  // });
}

/**
 * 登出
 */
export function logout() {
  // const url = `/SY_ORG_LOGIN.logout.do`;
  // return http.post(url);
  return new Promise((resolve, reject) => {
    resolve({ _MSG_: "OK," });
  });
}

/**
 * 获取用户信息
 */
export function getMobileLoginUser() {
  const url = `/SY_ORG_LOGIN.getMobileLoginUser.do`;
  return http.get(url);
}

/**
 * 获取菜单
 */
export function getRawMenus() {
  // const url = `/SY_COMM_INFO.menu.do`;
  // return http.get(url);
  return new Promise((resolve, reject) => {
    const data = {
      TOPMENU: [
        {
          NAME: "状态监控",
          ID: "0",
          TYPE: "2",
          NODE_VIRTUAL: "2",
          PID: "",
          INFO: "../views/ZTJC.vue",
        },
        {
          NAME: "路径选择产品",
          ID: "1",
          TYPE: "4",
          NODE_VIRTUAL: "2",
          PID: "",
          INFO: "",
          CHILD: [
            {
              NODE_VIRTUAL: "2",
              PID: "1",
              INFO: "../views/CPSC.vue",
              NAME: "产品生成",
              ID: "11",
              TYPE: "2",
            },
            {
              NODE_VIRTUAL: "2",
              PID: "1",
              INFO: "../views/TKZYZD.vue",
              NAME: "探空作业指导",
              ID: "12",
              TYPE: "2",
            },
          ],
        },
        {
          NAME: "数据管理",
          ID: "2",
          TYPE: "4",
          NODE_VIRTUAL: "2",
          PID: "",
          INFO: "",
          CHILD: [
            {
              NODE_VIRTUAL: "2",
              PID: "2",
              INFO: "../views/TKSJ.vue",
              NAME: "探空观测数据",
              ID: "21",
              TYPE: "2",
            },
            {
              NODE_VIRTUAL: "2",
              PID: "2",
              INFO: "../views/GJSJ.vue",
              NAME: "模拟仿真数据",
              ID: "22",
              TYPE: "2",
            },
            {
              NODE_VIRTUAL: "2",
              PID: "2",
              INFO: "../views/NLSJ.vue",
              NAME: "敏感性数据",
              ID: "23",
              TYPE: "2",
            },
          ],
        },
        {
          NAME: "对比分析",
          ID: "3",
          TYPE: "4",
          NODE_VIRTUAL: "2",
          PID: "",
          INFO: "",
          CHILD: [
            {
              NODE_VIRTUAL: "2",
              PID: "3",
              INFO: "../views/ZSCPDB.vue",
              NAME: "指数产品对比",
              ID: "31",
              TYPE: "2",
            },
            {
              NODE_VIRTUAL: "2",
              PID: "3",
              INFO: "../views/GDCSJDB.vue",
              NAME: "规定层数据",
              ID: "32",
              TYPE: "2",
            },
          ],
        },
        {
          NAME: "系统管理",
          ID: "4",
          TYPE: "4",
          NODE_VIRTUAL: "2",
          PID: "",
          INFO: "",
          CHILD: [
            {
              NODE_VIRTUAL: "2",
              PID: "41",
              INFO: "../views/YHGL.vue",
              NAME: "用户管理",
              ID: "41",
              TYPE: "2",
            },
          ],
        },
      ],
      _MSG_: "OK,",
    };
    resolve(data.TOPMENU);
  });
}

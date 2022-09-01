import { createRouter, createWebHashHistory } from "vue-router";
import { ElMessage } from "element-plus";
import store from "../store";
import tools from "../utils/tools";
import http from "../utils/request";

function getChildren(menus) {
  const views = import.meta.glob("../views/**/*.vue");
  // console.info("views - ", views);
  const subRoutes = [];
  function addRoute(item) {
    const link = item?.INFO.split("?")[0];
    const name = btoa(link);

    const subRoute = {
      path: "/" + name,
      name: name,
      component: views[link],
      meta: {},
    };

    if (subRoute) {
      subRoutes.push(subRoute);
    }
  }
  function getSubRoutes(menus) {
    menus.forEach((item, i) => {
      if (+item.TYPE !== 2 && item?.CHILD && Array.isArray(item?.CHILD)) {
        getSubRoutes(item.CHILD);
      } else if (
        item.INFO &&
        +item.TYPE === 2 &&
        +item.NODE_VIRTUAL === 1 &&
        item?.CHILD &&
        Array.isArray(item?.CHILD)
      ) {
        addRoute(item);
        getSubRoutes(item.CHILD);
      } else {
        if (item.INFO && +item.TYPE === 2) {
          addRoute(item);
        }
      }
    });
  }
  getSubRoutes(menus);
  return subRoutes;
}

async function registerRoutes() {
  // 添加Error页面
  router.addRoute({
    path: "/:catchAll(.*)*",
    // redirect: "/error",
    name: "NotFound",
    component: () => import("../views/Error.vue"),
    meta: { title: "友好页", requiresAuth: false },
  });
  const menus = await store.dispatch("getMenus");

  const children = getChildren(menus) || [];

  console.log("children", children);

  children.forEach((item) => {
    router.addRoute("Main", item);
  });
  // console.log(router.getRoutes());
  return router.getRoutes();
}
// 基础页面
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      meta: { title: "登录", requiresAuth: false },
    },
    {
      path: "/oaxzfx",
      name: "OAXZFX",
      component: () => import("../views/OAXZFX.vue"),
      meta: { title: "OA选址分析", requiresAuth: false },
    },
    {
      path: "/",
      name: "Main",
      component: () => import("../views/Main.vue"),
      meta: { title: "首页", requiresAuth: true },
      children: [],
      // redirect: btoa("../views/YKMD.vue"),
      // children: [
      //   {
      //     path: "/ykmd",
      //     name: "YKMD",
      //     component: () => import("../views/YKMD.vue"),
      //     meta: { requiresAuth: true },
      //   },
      //   {
      //     path: "/hxmd",
      //     name: "HXMD",
      //     component: () => import("../views/HXMD.vue"),
      //     meta: { requiresAuth: true },
      //   },
      // ],
    },
    {
      path: "/error",
      name: "Error",
      component: () => import("../views/Error.vue"),
      meta: { title: "友好页", requiresAuth: false },
    },
    {
      path: "/mobile",
      name: "index",
      component: () => import("../views/mobile/Index.vue"),
      redirect: "/mobile/tzdt",
      children: [
        {
          path: "/mobile/tzdt",
          name: "xzqh",
          component: () => import("../views/mobile/TZDT.vue"),
        },
        {
          path: "/mobile/ndjh",
          name: "ndjh",
          component: () => import("../views/mobile/TZJH-ND.vue"),
        },
        {
          path: "/mobile/fjjh",
          name: "fjjh",
          component: () => import("../views/mobile/TZJH-FJ.vue"),
        },
        {
          path: "/mobile/sqdw",
          name: "sqdw",
          component: () => import("../views/mobile/SQGL-DW.vue"),
        },
        {
          path: "/mobile/sqlb",
          name: "sqlb",
          component: () => import("../views/mobile/SQGL-LB.vue"),
        },
        {
          path: "/mobile/sqsp",
          name: "sqsp",
          component: () => import("../views/mobile/SQGL-SP.vue"),
        },
        {
          path: "/mobile/xzfx",
          name: "xzfx",
          component: () => import("../views/mobile/XZFX.vue"),
        },
      ],
    },
  ],
});

function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
}
// 默认浏览器打开
function openDefaultBrowser() { }
// 防止路由无限循环
// let routeFlag = false;
let isType = "";
// 全局路由守卫
router.beforeEach((to, from, next) => {
  const hrefData = to.query;
  const token = store.state.user?.USER_TOKEN;
  if (
    (tools.isQyweixin() === "APP" || tools.isQyweixin() === "APPWeixin") &&
    to.fullPath.indexOf("mobile") == -1 &&
    token
  ) {
    next("/mobile");
  } else if (tools.isQyweixin() === "PC" && to.fullPath.indexOf("mobile") > -1 && token) {
    // pc端访问
    next("/");
  } else if (tools.isQyweixin() === "PCWeixin" && to.fullPath.indexOf("mobile") > -1 && token) {
    // pc端微信访问
    next("/");
    // 实现企业微信打开默认浏览器（未完成）
    // tools.wxConfigFun()
    // tools.openDefaultBrowser()
  }
  if (to.fullPath.indexOf("mobile") > -1) {
    // 注册动态路由，内部会请求menu接口获取当前用户所拥有的菜单列表
    registerRoutes()
      .then((routes) => {
        // console.log("注册好的路由：", routes);
        // 拿到菜单并注册完路由，将标记置为true
        if (store?.state?.menus?.length) {
          store.commit("SET_ROUTEFLAG", true);
          next();
        }
      })
      .catch((e) => {
        // 处理异常事件
        ElMessage.error(e.message);
        console.warn("注册动态路由方法出现错误: ", e);
      });
  } else   //如果是oa审批页面
    if (to.fullPath === '/oaxzfx') {
      next();
    } else if (hrefData.type && hrefData.token) {
      if (hrefData.type === "oa") {
        if (isType != "") {
          next();
        } else {
          isType = "oa";
          store.commit("SET_PageInfo", {
            type: "oa",
            siteApplyNo: hrefData.siteApplyNo,
            longitude: hrefData.longitude,
            latitude: hrefData.latitude,
          });
          if (hrefData.token) {
            http.post("/SSO.loginByToken.do", { userToken: hrefData.token }).then(result => {
              const user = {};
              if (result._MSG_.startsWith("OK")) {
                user.USER_CODE = result.USER_CODE;
                user.USER_TOKEN = result.USER_TOKEN;
                user.DEPT_CODE = result.DEPT_CODE;
                user.ODEPT_CODE = result.ODEPT_CODE;
                user.TDEPT_CODE = result.TDEPT_CODE;
                store.commit("SET_CURMENUID", "");
                store.commit("SET_CURSUBMENUID", "");
                ElMessage.success({ message: "登录成功", duration: 2 * 1000 });
                store.commit("SET_USER", user);
                next({ name: "Main", params: { siteApplyNo: hrefData.siteApplyNo, longitude: hrefData.longitude, latitude: hrefData.latitude } });
              } else {
                next({ name: "Error" });
              }
            })
          }
        }
      } else if (hrefData.type === "sso") {
        if (isType != "") {
          next();
        } else {
          isType = "sso";
          if (hrefData.token) {
            http.post("/SSO.loginByToken.do", { userToken: hrefData.token }).then(result => {
              const user = {};
              if (result._MSG_.startsWith("OK")) {
                user.USER_CODE = result.USER_CODE;
                user.USER_TOKEN = result.USER_TOKEN;
                user.DEPT_CODE = result.DEPT_CODE;
                user.ODEPT_CODE = result.ODEPT_CODE;
                user.TDEPT_CODE = result.TDEPT_CODE;
                store.commit("SET_CURMENUID", "");
                store.commit("SET_CURSUBMENUID", "");
                ElMessage.success({ message: "登录成功", duration: 2 * 1000 });
                store.commit("SET_USER", user);
                next({ name: "Main" });
              } else {
                next({ name: "Error" });
              }
            })
          }
        }
      }
    } else {
      if (["Login", "Register", "Error"].includes(to.name)) {
        // 无论什么情况，要进入登录页就把标记置为false，
        // 这样再次进入登录以外的页面时，会重新获取菜单列表动态注册路由
        store.commit("SET_ROUTEFLAG", false);
        next();
      } else {
        // console.log("menus array:", store?.state?.menus);
        if (!token) {
          // 没有token，直接跳转登录页
          ElMessage.warning({ message: "请登录后继续访问！" });
          //标记一下退出状态
          store.commit("SET_LOGINOUT", true)
          next({ name: "Login" /* query: { redirect: to.fullPath } */ });
        } else if (store?.state?.routeFlag && store?.state?.menus?.length) {
          // 标记为true，表示已经注册过动态路由，直接跳转到目标页面即可
          next();
        } else {
          // 注册动态路由，内部会请求menu接口获取当前用户所拥有的菜单列表
          registerRoutes()
            .then((routes) => {
              // console.log("注册好的路由：", routes);
              // 拿到菜单并注册完路由，将标记置为true
              if (store?.state?.menus?.length) {
                store.commit("SET_ROUTEFLAG", true);
                next({ ...to, replace: true }); // 路由跳转进入页面
              }
            })
            .catch((e) => {
              // 处理异常事件
              ElMessage.error(e.message);
              console.warn("注册动态路由方法出现错误: ", e);
            });
        }
      }
    }
});

router.onError((error) => {
  console.log("router onerror");
  console.log(error);
});
export default router;

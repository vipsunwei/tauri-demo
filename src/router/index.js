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
    // console.log("link : ", link);
    const name = link.replace("../views/", "").replace(".vue", "");
    // console.log("name : ", name);
    const path = "/" + name.toLowerCase();
    // console.log("path : ", path);
    const subRoute = {
      path: path,
      name: name,
      component: views[link],
      meta: { title: item.NAME },
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
    name: "NotFound",
    component: () => import("../views/Error.vue"),
    meta: { title: "友好页", requiresAuth: false },
  });
  // 获取菜单
  await store.dispatch("getMenus");
  const menus = store.state.rawMenus;

  if (!menus || !menus?.length) return [];
  const children = getChildren(menus) || [];

  children.forEach((item) => {
    router.addRoute("Main", item);
  });
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
      path: "/",
      name: "Main",
      component: () => import("../views/Main.vue"),
      // children: [],
    },
    {
      path: "/error",
      name: "Error",
      component: () => import("../views/Error.vue"),
      meta: { title: "友好页", requiresAuth: false },
    },
  ],
});

// 全局路由守卫
router.beforeEach((to, _, next) => {
  const token = store.state.user?.USER_TOKEN;

  if (["Login", "Register", "Error"].includes(to.name)) {
    // 无论什么情况，要进入登录页就把标记置为false，
    // 这样再次进入登录以外的页面时，会重新获取菜单列表动态注册路由
    store.commit("SET_ROUTEFLAG", false);
    next();
  } else {
    console.log("menus array:", store?.state?.rawMenus);
    if (!token) {
      // 没有token，直接跳转登录页
      ElMessage.warning({ message: "请登录后继续访问！" });
      next({ name: "Login" /* query: { redirect: to.fullPath } */ });
    } else if (store?.state?.routerFlag && store?.state?.rawMenus?.length) {
      // 标记为true，表示已经注册过动态路由，直接跳转到目标页面即可
      next();
    } else {
      // 注册动态路由，内部会请求menu接口获取当前用户所拥有的菜单列表
      registerRoutes()
        .then((routes) => {
          console.log("注册好的路由：", routes);
          // 拿到菜单并注册完路由，将标记置为true
          if (store?.state?.rawMenus?.length) {
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
});

router.afterEach((to, _, failure) => {
  // document.title = to?.meta?.title || document.title;
});

router.onError((error) => {
  console.log("路由错误", error);
});
export default router;

<template>
  <div class="main-menu">
    <div class="menus" v-for="menu in menus" :key="menu.NAME">
      <div
        class="top-menu"
        :style="{ cursor: menu.TYPE === '2' ? 'pointer' : 'default' }"
        :class="curMenuName === menu.NAME ? 'menu-bg-selected' : 'menu-bg'"
        @click="menu.TYPE === '2' && clickMenu(menu)"
      >
        {{ menu.NAME }}
      </div>
      <template v-if="menu?.CHILD && menu.NODE_VIRTUAL !== '1'">
        <div
          class="sub-menu"
          :class="curSubMenuName === sub.NAME ? 'sub-menu-selected' : 'sub-menu'"
          v-for="sub in menu.CHILD"
          :key="sub.NAME"
          @click="clickSubMenu(menu, sub)"
        >
          {{ sub.NAME }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();
const menus = computed(() => store.state.rawMenus);
const curMenuName = computed(() => store.state.curMenuName);
const curSubMenuName = computed(() => store.state.curSubMenuName);
const path = computed(() => route.path);

function handleMenuHighLight() {
  if (path.value === "/" && menus.value?.length) {
    if (menus.value?.[0]?.CHILD?.length) {
      clickSubMenu(menus.value?.[0], menus.value?.[0]?.CHILD?.[0]);
    } else {
      clickMenu(menus.value?.[0]);
    }
    return;
  }
  const s = path.value?.substr(1).toUpperCase();

  menus.value?.forEach((el) => {
    if (el?.TYPE === "2") {
      if (s && el?.INFO?.includes(s)) {
        clickMenu(el, true);
      }
    } else if (el?.TYPE === "4" && el?.CHILD) {
      el?.CHILD?.forEach((ele) => {
        if (ele?.TYPE === "2") {
          if (s && ele?.INFO?.includes(s)) {
            clickSubMenu(el, ele, true);
          }
        }
      });
    }
  });
}

// 点击一级菜单
// form 为true表示只处理高亮，不做路由跳转
function clickMenu(menu, from = "") {
  store.commit("SET_CUR_MENU", { curMenuName: menu.NAME, curSubMenuName: "" });
  // const breadCrumbs = [];
  // breadCrumbs.push(menu);
  const infoArr = menu?.INFO.split("?");
  const link = infoArr[0];

  if (!from) {
    const name = link.replace("../views/", "").replace(".vue", "");
    router.push({ name });
  }

  // store.commit("SET_BREADCRUMBS", breadCrumbs);
}
// 点击二级菜单
// form 为true表示只处理高亮，不做路由跳转
function clickSubMenu(menu, subMenu, from = "") {
  store.commit("SET_CUR_MENU", { curMenuName: menu.NAME, curSubMenuName: subMenu.NAME });
  // const breadCrumbs = [];
  // breadCrumbs.push(subMenu);
  const infoArr = subMenu?.INFO.split("?");
  const link = infoArr[0];

  if (!from) {
    const name = link.replace("../views/", "").replace(".vue", "");
    router.push({ name });
  }

  // store.commit("SET_BREADCRUMBS", breadCrumbs);
}

onBeforeMount(() => {
  handleMenuHighLight();
});

// watch(
//   () => route.path,
//   (n, o) => {
//     console.log(n, o);
//     if (n === "/" && menus.value?.length) {
//       if (menus.value?.[0]) {
//         clickSubMenu(menus.value?.[0], menus.value?.[0]?.CHILD?.[0]);
//       }
//     }
//     try {
//       console.log("current page: ", n.replace("/", ""));
//     } catch (error) {
//       console.dir(error);
//     }
//   }
// );
</script>

<style lang="scss" scoped>
.main-menu {
  box-sizing: border-box;
  user-select: none;
  position: absolute;
  z-index: 1200;
  top: 70px;
  left: 20px;
  width: 152px;
  height: calc(100% - 70px - 20px);
  overflow: auto;
  background: #021132;
  border: 1px solid #043267;
  box-shadow: 0 0 10px #043267 inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  .menus {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .top-menu {
    margin: 16px 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: 100% 100%;
  }
  .menu-bg {
    background-image: url(../assets/menu-bg.png);
    width: 120px;
    height: 41px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    // line-height: 24px;
  }
  .menu-bg-selected {
    width: 131px;
    height: 41px;
    background-image: url(../assets/menu-bg-selected.png);
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #0dd2e6;
    // line-height: 24px;
  }
  .sub-menu {
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #88b3d2;
    line-height: 1;
    padding: 8px 30px;
    cursor: pointer;
    margin-top: 5px;
  }
  .sub-menu-selected {
    color: rgba(13, 210, 230, 1);
  }
}
</style>

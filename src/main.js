import { createApp } from "vue";
import App from "./App.vue";
// 按需引入
import ep from "./ep";
import router from "./router";
import store from "./store";
// 全局引入
// import ep from "element-plus";
// import "element-plus/dist/index.css";

// 如果只想导入css变量
import "element-plus/theme-chalk/dark/css-vars.css";
import "animate.css";
// import "../public/Build/Cesium/Widgets/widgets.css";
// import "../public/Build/Cesium/cesium-navigation.css";
import "./assets/css/mapbox-gl.css";
import "./assets/index.css";
const app = createApp(App);

app.use(router);
app.use(store);
app.use(ep, { zIndex: 3000 });

app.mount("#app");

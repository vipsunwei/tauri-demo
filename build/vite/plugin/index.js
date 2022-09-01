import vue from "@vitejs/plugin-vue";
import ElementPlus from "unplugin-element-plus/vite";

// import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from "@vitejs/plugin-legacy";
// import windiCSS from 'vite-plugin-windicss'
// import purgeIcons from 'vite-plugin-purge-icons'
// import VitePluginCertificate from 'vite-plugin-mkcert'
// import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { configHtmlPlugin } from "./html";
// import { configMockPlugin } from './mock'
import { configCompressPlugin } from "./compress";
// import { configVisualizerConfig } from './visualizer'
import { configImageminPlugin } from "./imagemin";
// import { configSvgIconsPlugin } from './svgSprite'

/**
 * vite 插件
 * @param {*} viteEnv
 * @param {boolean} isBuild
 */
export function createVitePlugins(viteEnv, isBuild) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_LEGACY,
  } = viteEnv;

  const vitePlugins = [
    // have to
    vue(),
    // have to
    // vueJsx(),
    // support name
    // vueSetupExtend(),
    // VitePluginCertificate({
    //   source: "coding",
    // }),
    ElementPlus(),
  ];

  // vite-plugin-windicss
  // vitePlugins.push(windiCSS());

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons
  // vitePlugins.push(configSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  // VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-purge-icons
  // vitePlugins.push(purgeIcons());

  // vite-plugin-style-import
  // vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  // vitePlugins.push(configVisualizerConfig());

  // vite-plugin-theme
  // vitePlugins.push(configThemePlugin(isBuild));

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    );

    // vite-plugin-pwa
    // vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}

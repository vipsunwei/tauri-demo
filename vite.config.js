import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build/vite/plugin";

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  const isBuild = command === "build";
  // loadEnv 读取的布尔类型是一个字符串。 该函数可以转换为布尔类型
  const viteEnv = wrapperEnv(loadEnv(mode, process.cwd()));
  console.log("command: ", command);
  console.log("mode: ", mode);
  console.log("viteEnv: ", viteEnv);
  const { VITE_PORT, VITE_CONFIG_BASE, VITE_DROP_CONSOLE } = viteEnv;
  return defineConfig({
    base: VITE_CONFIG_BASE,
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: { "@": resolve(__dirname, "./src") },
    },
    esbuild: { drop: VITE_DROP_CONSOLE ? ["console", "debugger"] : [] },
    // Vite optons tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      https: false,
      host: true,
      proxy: {
        "^/api/traj/go/.*": {
          target: "https://sonde.r7tec.com",
          changeOrigin: true,
        },
      },
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: ["es2021", "chrome100", "safari13"],
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  });
};

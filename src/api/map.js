import axios from "axios";
import http from "../utils/request";
import { ver } from "./constants";

// const baseURL = import.meta.env.VITE_PY_API;
// const pyPath = import.meta.env.VITE_PY_PATH;

// const instance = axios.create({
//   baseURL: baseURL + pyPath,
//   timeout: 60 * 1000,
//   withCredentials: false,
// });

export const mapboxToken =
  "pk.eyJ1IjoiMTMxNDExMDAxNzUiLCJhIjoiY2tlOXE5cWdpMjh6eDJzbXdzZml3dGZqYiJ9.1sDBvADV8KvrOKIJLwqLBw";
export const TianDiTuToken = "a714c85d6f6b4c1813ba1de9833bc6ce";

// 获取站点信息
export function getStation() {
  const url = "https://sonde.r7tec.com/project/sy/base/view/TK_STATION.finds.do";
  return axios.get(url);
}

/**
 * 轨迹数据 可视化
 * @param {object} params
 * @param {string} params.date 格式：202107191215 年月日时分
 * @param {string} params.lon 经度
 * @param {string} params.lat 纬度
 * @returns
 * 落点距离差
 * 落点高度，纬度，经度
 * rhu 湿度
 */
export function getTrajectory(params) {
  const url = `${ver}/trajectory`;
  return http.get(url, { params });
}
// export function getTrajectory(data) {
//   const url = `/traj_data`;
//   return instance.post(url, data);
//   // return axios.get("/mockData/traj.json");
// }

/**
 * 能量数据 可视化
 * @param {object} params
 * @param {string} params.date 格式：2021071912 年月日时
 */
export function getEnergy(params) {
  const url = `${ver}/energy2d`;
  return http.get(url, { params });
}
// export function getEnergy(data) {
//   const url = `/energy_deal`;
//   return instance.post(url, data);
//   // return axios.get("/mockData/data.json");
// }

// 处理时间
export function processingDate(time = new Date()) {
  let hour = 0;
  const dates = new Date(new Date(time).getTime() - 8 * 60 * 60 * 1000);
  if (dates < 12) {
    hour = 0;
  } else {
    hour = 12;
  }
  return {
    day: dates.getDate(),
    hour,
  };
}

/**
 * 数据处理量统计
 */
export function homeCount() {
  const url = `/${ver}/homecount`;
  return http.get(url);
}

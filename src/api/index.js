// import axios from "axios";
import { download } from "../utils/handleFiles";
import http from "../utils/request";
import { ver } from "./constants";

export * from "./login";
export { getStation } from "./map";

/**
 * 规定层数据提取
 * ?stationNum=57494&date=2021-10-24 07:00:00&fileNum=9&element=temp,rhum,index
 * @param {object} params
 * @param {string|number} params.stationNum
 * @param {string} params.date
 * @param {string} params.fileNum
 * @param {string} params.element 要素；多个使用英文逗号拼接
 * @param {string|number} params.stage 1|2|3 分段标记：1上升，2平漂，3下降
 */
export function speclayerpro(params) {
  const url = `/${ver}/speclayerpro`;
  return http.get(url, { params });
  // return axios.get("/mockData/规定层数据提取.json");
}
/**
 * 指数产品对比
 * @param {object} params
 * @param {string|number} params.stationNum
 * @param {string} params.date
 * @param {string} params.element
 * @param {string|number} params.stage 1|3 分段标记 1 上升， 3 下降
 */
export function indexproduct(params) {
  const url = `/${ver}/indexproduct`;
  return http.get(url, { params });
}

/**
 * 探空数据
 * @param {object} params
 * @param {string|number} params.showNum
 * @param {string|number} params.nowPage
 * @param {string|number} params.stationNum
 * @param {string} params.date
 */
export function dpsdata(params) {
  const url = `/${ver}/dpsdata`;
  return http.get(url, { params });
}

/**
 * 轨迹数据
 * @param {object} params
 * @param {string|number} params.nowPage
 * @param {string|number} params.showNum
 * @param {string|number} params.stationNum
 * @param {string} params.date
 */
export function predata(params) {
  const url = `/${ver}/predata`;
  return http.get(url, { params });
}

/**
 * 产品生成
 * @param {object} params
 * @param {string|number} params.nowPage
 * @param {string|number} params.showNum
 * @param {string|number} params.stationNum
 * @param {string} params.date
 */
export function preproduct(params) {
  const url = `/${ver}/preproduct`;
  return http.get(url, { params });
}

/**
 * 探空作业指导
 * @param {object} params
 * @param {string|number} params.nowPage
 * @param {string|number} params.showNum
 * @param {string|number} params.stationNum
 * @param {string} params.startDate
 * @param {string} params.endDate
 */
export function preoperation(params) {
  console.log("探空作业指导参数：", params);
  const url = `/${ver}/preoperation`;
  return http.get(url, { params });
  // return axios.get("/mockData/探空作业指导.json").then(({ data }) => data);
}

/**
 * 探空作业指导 - 生成
 * @param {object} data
 * @param {string} data.id 用逗号拼接的多个id字符串
 * @param {string} data.releaseTime
 * @param {number} data.horHeight
 * @param {number} data.dstRangeStart
 * @param {number} data.dstRangeEnd
 * @param {number} data.downLon
 * @param {number} data.downLat
 */
export function dpstask(data) {
  console.log("探空作业指导生成参数：", data);
  const url = `/${ver}/dpstask`;
  return http.post(url, data);
}

/**
 * 查询探空作业指导单
 * @param {object} params
 * @param {number} params.id
 */
export function dpstaskq(params) {
  console.log("探空作业指导单查询参数：", params);
  const url = `/${ver}/dpstaskq`;
  return http.get(url, { params });
}

/**
 * 能量数据
 * @param {object} params
 * @param {string|number} params.nowPage
 * @param {string|number} params.showNum
 * @param {string} params.startDate
 * @param {string} params.endDate
 */
export function energydata(params) {
  console.log("能量数据参数： ", params);
  const url = `/${ver}/energydata`;
  return http.get(url, { params });
  // return axios.get("/mockData/能量数据.json").then(({ data }) => data);
}

/**
 * 用户列表
 * @param {object} params
 * @param {string|number} params.nowPage
 * @param {string|number} params.showNum
 * @param {string} params.loginName
 */
export function user(params) {
  console.log("用户管理列表参数： ", params);
  const url = `/${ver}/user`;
  return http.get(url, { params });
  // return axios.get("/mockData/用户管理.json").then(({ data }) => data);
}
/**
 * 添加用户
 * @param {object} data
 * @param {string} data.loginName 登录名
 * @param {string} data.userName 用户姓名
 * @param {string} data.passWd 密码
 * @param {string} data.department 部门
 * @param {string} data.post 职务
 */
export function adduser(data) {
  console.log("data:", data);
  const url = `/${ver}/adduser`;
  return http.post(url, data);
}
/**
 * 删除用户
 * @param {object} data
 * @param {string} data.loginName 登录名
 */
export function deleteuser(data) {
  const url = `/${ver}/deleteuser`;
  return http.post(url, data);
}

/**
 * 下载轨迹数据文件
 * @param {object} params
 * @param {string|number} params.stationNum
 * @param {string} params.date
 */
export function downloadpre(params) {
  const url = `/${ver}/downloadpre`;
  // params.stationNum = "59758";
  // params.date = "2021-10-13 12:30:00";
  // const url = `http://172.16.100.37:8001/api/v1/downloadpre`;
  return download(url, { params });
}

/**
 * 下载能量数据文件
 * @param {object} params
 * @param {string} params.fileName
 */
export function downloadenergy(params) {
  const url = `/${ver}/downloadenergy`;
  return download(url, { params });
}

/**
 * 下载探空数据文件
 * @param {object} params
 * @param {string|number} params.stationNum
 * @param {string} params.date
 */
export function downloadqc(params) {
  const url = `/${ver}/downloadqc`;
  return download(url, { params });
}
/**
 * 产品生成 - 点击生成按钮
 * @param {number} id
 * @returns
 */
export function preproductgen(id) {
  const url = `/${ver}/preproductgen`;
  return http.get(url, { params: { id } });
}
/**
 * 产品生成：修改能量中心点经纬度
 * @param {object} data
 * @param {number} data.id
 * @param {number} data.lon
 * @param {number} data.lat
 * @returns
 */
export function preProductModify(data) {
  const url = `/${ver}/preproductmodify`;
  return http.post(url, data);
}

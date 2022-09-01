import http from "../utils/request";

/**
 * 获取字典
 * @param {string} DICT_ID 字典ID
 */
export function getDict(DICT_ID) {
  const url = "/SY_COMM_INFO.dict.do";
  return http.post(url, { DICT_ID });
}

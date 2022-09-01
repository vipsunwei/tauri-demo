/**
 * @desc 防抖函数
 * @param {function} func 需要防抖的函数
 * @param {number} wait 延迟时间
 * @param {boolean} immediate 是否立即执行
 */
export function debounce(func, wait, immediate) {
  let timeout;

  return function (...args) {
    let context = this;
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}
/**
 * 节流函数
 * @param {function} fn 执行的函数
 * @param {number} gapTime 多久执行一次
 */
export function throttle(fn, gapTime) {
  let _lastTime = null;

  return function (...args) {
    let context = this;
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(context, args);
      _lastTime = _nowTime;
    }
  };
}

/**
 * 格式化日期
 * @param date
 * @param format
 * @return {string}
 */
export const formatDate = (date = new Date(), format = "yyyy-MM-dd") => {
  const o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "H+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

/**
 * 保留n位小数
 * @param {number|string} v 源数据
 * @param {number} n 保留小数点后 n 位，默认保留2位小数
 * @returns {string}
 */
export function toFixed(v, n = 2) {
  const arr = [0, "0"];
  if (arr.includes(v)) return "0";
  if (!v) return "";
  return typeof v === "number" ? v.toFixed(n) : (+v).toFixed(n);
}

// 判断是手机端还是pc端
export function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
}

/**
 * px转vw
 * @param {number} px px值
 * @param {number} base 基于多宽做转换（即设计稿的宽度）
 * @param {number} n vw精确小数点几位
 */
export const px2vw = (px, base = 1920, n = 6) => (px / (base / 100)).toFixed(n);

/**
 * 生成UUID
 * @returns {string} UUID
 */
export function UUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/**
 * 深拷贝（不支持对象中有函数）
 * @param {object} o
 */
export function deepCopy(o) {
  try {
    return JSON.parse(JSON.stringify(o));
  } catch (error) {
    console.warn("deepCopy 报错：", error);
  }
}

/**
 * 校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串
 * @param {string} s 登录名
 */
export function isRegisterUserName(s) {
  const patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
  if (!patrn.exec(s)) return false;
  return true;
}
/**
 * 校验密码：只能输入6-20个字母、数字、下划线
 * @param {string} s 密码
 */
export function isPasswd(s) {
  const patrn = /^(\w){6,20}$/;
  if (!patrn.exec(s)) return false;
  return true;
}
/**
 * 校验用户名：只能输入1-20个字母和汉字
 * @param {string} s 用户名
 */
export function isTrueName(s) {
  const patrn = /^[a-zA-Z\u2E80-\u9FFF]{1,20}$/;
  if (!patrn.exec(s)) return false;
  return true;
}

/**
 * 禁用iframe右键菜单和选中行为
 * @param {*} ifm
 */
export function disableIfmRightClickMenu(ifm) {
  ifm.onload = function () {
    ifm.contentWindow.document.oncontextmenu = function () {
      return false;
    };
    ifm.contentWindow.document.onselectstart = function () {
      return false;
    };
  };
}

export default {
  /**
   * 过滤table列展示
   * */
  deduplicationKey(obj) {
    const arr = Object.keys(obj);
    arr.forEach((item) => {
      if (item.indexOf("_NAME") != "-1") {
        delete obj[item.split("_")[0]];
      }
    });
    return obj;
  },
  /*随机字符串生成*/
  randomString(len) {
    len = len || 32;
    var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = $chars.length;
    var pwd = "";
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
};

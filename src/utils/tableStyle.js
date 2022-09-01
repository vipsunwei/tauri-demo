import { px2vw } from "./utils";
export function rowStyle({ rowIndex }) {
  const _style = {
    fontSize: px2vw(14) + "vw",
    fontWeight: 400,
    color: "#D3EAF5",
    background: "transparent",
    height: px2vw(36) + "vw",
    // borderBottom: 0,
  };
  if (rowIndex % 2 === 0) {
    _style.background = "rgba(3, 17, 52, 1)";
  } else {
    _style.background = "rgba(5, 28, 70, 1)";
  }
  return _style;
}

export function cellStyle() {
  return {
    borderColor: "#043267",
  };
}

export function headerCellStyle() {
  return {
    background: "#051c46",
    height: px2vw(48) + "vw",
    fontSize: px2vw(16) + "vw",
    fontWeight: "bold",
    color: "#03CBF0",
    // borderBottom: 0,
    borderColor: "#043267",
  };
}
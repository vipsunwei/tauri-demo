import { reactive, onMounted } from "vue";
import { homeCount } from "@/api/map";

export default function useHomeCount() {
  // 格点数据处理量、作业单数量、轨迹预测数据、接收数据总数（格点+轨迹预测+质控）
  const homeCountState = reactive({ gribNum: "", taskNum: "", preNum: "", recNum: "" });
  function getData() {
    homeCount().then((data) => {
      Object.keys(homeCountState).forEach((key) => {
        homeCountState[key] = data[key];
      });
    });
  }
  onMounted(() => {
    getData();
  });
  return { homeCountState };
}

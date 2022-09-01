import { dpstask } from "@/api/index";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

export default function useCreatTask(getTableData) {
  const createTaskRef = ref(null);
  const isShowCreate = ref(false);
  const validateReleaseTime = (rule, value, callback) => {
    if (!value) {
      callback(new Error("请选择时间"));
      return false;
    }
    callback();
  };
  const isNumer = (rule, value, callback) => {
    const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
    if (!reg.exec(value)) {
      callback(new Error("请输入数字"));
      return false;
    }
    callback();
  };
  const createTaskRules = {
    releaseTime: [{ validator: validateReleaseTime, trigger: ["blur", "change"] }],
    horHeight: [{ validator: isNumer, trigger: ["blur", "change"] }],
    dstRangeStart: [{ validator: isNumer, trigger: ["blur", "change"] }],
    dstRangeEnd: [{ validator: isNumer, trigger: ["blur", "change"] }],
    downLon: [{ validator: isNumer, trigger: ["blur", "change"] }],
    downLat: [{ validator: isNumer, trigger: ["blur", "change"] }],
  };
  const createTaskState = reactive({
    releaseTime: null, // 放球时间
    horHeight: null, // 平漂高度
    dstRangeStart: null, // 目标区域范围开始
    dstRangeEnd: null, // 目标区域范围结束
    downLon: null, // 下降位置经度
    downLat: null, // 下降位置纬度
  });

  function onCreateTaskClose() {
    console.log("create task close ");
    createTaskRef.value.resetFields();
  }

  function onCreateTaskSubmit(ids) {
    createTaskRef.value.validate((valid) => {
      if (!valid) return false;
      console.log("id: ", ids);
      dpstask({
        id: ids,
        releaseTime: createTaskState.releaseTime,
        horHeight: +createTaskState.horHeight,
        dstRangeStart: +createTaskState.dstRangeStart,
        dstRangeEnd: +createTaskState.dstRangeEnd,
        downLon: +createTaskState.downLon,
        downLat: +createTaskState.downLat,
      }).then((data) => {
        console.log("dpstask result ", data);
        isShowCreate.value = false;
        if (!data?.success) return ElMessage.error("操作失败");
        getTableData();
        ElMessage.success("操作成功");
      });
    });
  }
  return {
    createTaskRef,
    isShowCreate,
    createTaskRules,
    createTaskState,
    onCreateTaskClose,
    onCreateTaskSubmit,
  };
}

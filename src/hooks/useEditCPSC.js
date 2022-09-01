// import { dpstask } from "@/api/index";
import { preProductModify } from "@/api/index";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

export default function useEditCPSC(getTableData) {
  const editCPSCRef = ref(null);
  const isShowEdit = ref(false);

  const isNumber = (rule, value, callback) => {
    const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;

    if (!reg.exec(value)) {
      callback(new Error("请输入数字"));
      return false;
    }
    callback();
  };
  const editCPSCRules = {
    lon: [{ validator: isNumber, message: "请填写中心点经度", trigger: ["blur", "change"] }],
    lat: [{ validator: isNumber, message: "请填写中心点纬度", trigger: ["blur", "change"] }],
  };
  const editCPSCState = reactive({
    id: null,
    lon: null, // 中心点经度
    lat: null, // 中心点纬度
  });

  function onEditCPSCClose() {
    editCPSCRef.value.resetFields();
  }

  function onEditCPSCSubmit() {
    editCPSCRef.value.validate(async (valid) => {
      if (!valid) return false;
      const data = await preProductModify({ ...editCPSCState });
      if (!data?.success) return ElMessage.error("操作失败");
      console.log("preProductModify result ", data);
      ElMessage.success("操作成功");
      isShowEdit.value = false;
      getTableData();
    });
  }
  return {
    editCPSCRef,
    isShowEdit,
    editCPSCRules,
    editCPSCState,
    onEditCPSCClose,
    onEditCPSCSubmit,
  };
}

import { ElMessage } from "element-plus";

export default function useDateRange(form, endDateRef) {
  function startDateChange(e) {
    console.log("start date: ", e);
    if (!form.endDate || !form.startDate) return;
    if (form.startDate > form.endDate) {
      form.startDate = null;
      ElMessage.warning("开始时间不可以大于结束时间");
      return;
    }
  }
  function startDateBlur() {
    setTimeout(() => {
      console.log("start date blur: ");
      if (!form.startDate) return;
      endDateRef.value.focus();
    }, 300);
  }
  function endDateChange(e) {
    console.log("end date: ", e);
    if (!form.startDate || !form.endDate) return;
    if (form.startDate > form.endDate) {
      form.endDate = null;
      ElMessage.warning("开始时间不可以大于结束时间");
      return;
    }
  }
  function isDateOk() {
    if (form.startDate && !form.endDate) {
      ElMessage.warning("请选择结束时间");
      return false;
    }
    if (form.endDate && !form.startDate) {
      ElMessage.warning("请选择开始时间");
      return false;
    }

    return true;
  }

  function isAllOk() {
    if (!isDateOk()) return false;
    if (form.startDate && !form.stationNum) {
      ElMessage.warning("请选择站名(站号)");
      return false;
    }
    if (form.stationNum && !form.startDate) {
      ElMessage.warning("请选择开始时间");
      return false;
    }
    return true;
  }

  return { startDateChange, endDateChange, startDateBlur, isDateOk, isAllOk };
}

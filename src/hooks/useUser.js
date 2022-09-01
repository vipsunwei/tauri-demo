import { reactive, ref, toRaw } from "vue";
import { isPasswd, isRegisterUserName, isTrueName } from "../utils/utils";
import { adduser, deleteuser } from "../api";
import { ElMessage } from "element-plus";

export default function useUser(getTableData) {
  function validateLoginName(rule, value, callback) {
    if (!isRegisterUserName(value)) {
      callback(new Error("只能输入5-20个以字母开头、可带数字、“_”、“.”的字串"));
      return;
    }
    callback();
  }
  function validatePassWd(rule, value, callback) {
    if (!isPasswd(value)) {
      callback(new Error("只能输入6-20个字母、数字、下划线"));
      return;
    }
    callback();
  }
  function validateUserName(rule, value, callback) {
    if (!isTrueName(value)) {
      callback(new Error("只能输入1-20个字母和汉字"));
      return;
    }
    callback();
  }
  const rules = {
    loginName: [{ validator: validateLoginName, trigger: ["blur", "change"] }],
    passWd: [{ validator: validatePassWd, trigger: ["blur", "change"] }],
    userName: [{ validator: validateUserName, trigger: ["blur", "change"] }],
  };
  const isAdd = ref(true);
  const isShow = ref(false);
  const userFormRef = ref(null);
  const loading = ref(false);
  const deleting = ref(false);
  const userState = reactive({
    loginName: "",
    passWd: "",
    userName: "",
    department: "",
    post: "",
  });

  function onClose() {
    console.log("on close");
    userFormRef.value.resetFields();
  }

  function onSubmit() {
    console.log("on submit ");
    userFormRef.value.validate((valid) => {
      if (valid) {
        doAddUser();
      } else {
        ElMessage.warning("表单验证失败!请检查表单填写");
      }
    });
  }

  function doAddUser() {
    if (loading.value) {
      ElMessage.warning("正在添加...");
      return;
    }
    loading.value = true;
    adduser(toRaw(userState))
      .then((data) => {
        if (data.success) {
          isShow.value = false;
          ElMessage.success("添加成功");
          getTableData();
        } else {
          ElMessage.error(data.message || "添加失败");
        }
      })
      .finally(() => {
        setTimeout(() => {
          loading.value = false;
        }, 200);
      });
  }

  function doDeleteUser(loginName) {
    if (deleting.value) {
      ElMessage.warning("正在删除...");
      return;
    }
    deleting.value = true;
    deleteuser({ loginName })
      .then((data) => {
        console.log(data);
        if (data.success) {
          ElMessage.success("删除成功");
          getTableData();
        } else {
          ElMessage.error(data.message || "删除失败");
        }
      })
      .finally(() => {
        setTimeout(() => {
          deleting.value = false;
        }, 200);
      });
  }

  return { isShow, isAdd, userFormRef, userState, rules, onClose, onSubmit, doDeleteUser };
}

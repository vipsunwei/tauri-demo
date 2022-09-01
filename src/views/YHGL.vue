<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.table_toolbar {
  margin-top: 20px;
  padding: 0 20px;
  .search_wrap {
    width: 100%;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    border: 1px solid #043267;

    .loginName {
      display: flex;
      align-items: center;
    }
    .label {
      white-space: nowrap;
      color: #a3cccc;
      margin-right: 20px;
      font-size: 14px;
    }
    :deep(.el-input__inner) {
      color: #b5dff3;
      // background: #042d53;
      // width: 240px;
      border: none;
      outline: none;
      border-radius: 0;
    }
    :deep(.el-input__suffix-inner) {
      align-items: center;
    }
    :deep(.el-button) {
      background: #042d53;
      border: none;
      outline: none;
      border-radius: 0;
      color: #00cced;
    }
  }

  .button_wrap {
    padding-top: 20px;
    padding-bottom: 20px;
    :deep(.el-button) {
      background: #042d53;
      border: none;
      outline: none;
      border-radius: 0;
      color: #00cced;
    }
  }
}
.table_wrap {
  padding: 0 20px;
  :deep(.el-pagination.is-background) {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;

    .el-pagination__total {
      color: #a3cccc;
    }
    .el-select .el-input .el-input__inner {
      border-radius: 0;
      // background: #042d53;
      border: none;
      outline: none;
      color: #a3cccc;
    }
    .btn-next,
    .btn-prev,
    .el-pager li {
      background: #043267;
      color: #b5dff3;
    }
    .el-pager li:not(.disabled).active {
      color: #b5dff3;
      background: #256fc3;
    }
    .el-pagination__jump {
      color: #71959c;

      .el-input__inner {
        // background: #042d53;
        // border: 1px solid #042d53;
        outline: none;
        border-radius: 0;
        font-weight: 400;
        color: #b5dff3;
      }
    }
  }
}
.dialog_title {
  font-size: 0.9375vw;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #21ceee;
}
.dialog_footer {
  .el-button {
    box-sizing: content-box;
    width: 5.9375vw;
    height: 1.666667vw;
    background: #042d53;
    border: 1px solid #042d53;
    outline: none;
    font-size: 0.833333vw;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #03cbf0;
    padding: 4px 0;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

<template>
  <section class="animate__animated animate__fadeInLeft" style="height: 100%">
    <section class="container" v-loading="loading" element-loading-background="rgba(0,0,0,0.3)">
      <section class="table_toolbar">
        <div class="search_wrap">
          <el-space :size="20" wrap>
            <div class="loginName">
              <span class="label">登录名</span>
              <el-input
                v-model="form.loginName"
                placeholder="请输入登录名"
                autocomplete="off"
                clearable
              ></el-input>
            </div>

            <el-button-group>
              <el-button type="primary" @click="search">查询</el-button>
              <!-- <el-button type="primary" @click="reset">重置</el-button> -->
            </el-button-group>
          </el-space>
        </div>

        <div class="button_wrap">
          <el-button type="primary" v-if="loginName === 'admin'" @click="isShow = true">
            添加
          </el-button>
          <!-- <el-button type="primary" @click="dels">批量删除</el-button> -->
          <!-- <el-button type="primary" @click="reload">刷新</el-button> -->
        </div>
      </section>
      <section class="table_wrap">
        <div v-show="!!tableData.length">
          <el-table
            border
            :data="tableData"
            :row-style="rowStyle"
            :cell-style="cellStyle"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column
              v-for="col in columns"
              :prop="col.id"
              :key="col.id"
              :label="col.label"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <!-- <el-button type="primary" v-if="row.loginName !== 'admin'" @click="edit(row)">
                修改
              </el-button> -->
                <!-- <el-button type="error" @click="showDelConfirm(scope.row)">删除</el-button> -->
                <el-popconfirm
                  v-if="row.loginName !== 'admin' && loginName === 'admin'"
                  confirm-button-text="是"
                  cancel-button-text="否"
                  :icon="InfoFilled"
                  icon-color="red"
                  title="确定要删除吗?"
                  @confirm="doDeleteUser(row.loginName)"
                >
                  <template #reference>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="paginationState.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="paginationState.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
          >
          </el-pagination>
        </div>

        <el-empty v-show="!tableData.length && !first" description="暂无数据"></el-empty>
      </section>
    </section>
  </section>

  <el-dialog v-model="isShow" width="30%" :close-on-click-modal="false" @close="onClose">
    <template #title>
      <span class="dialog_title">{{ isAdd ? "添加用户" : "编辑用户" }}</span>
    </template>
    <el-form ref="userFormRef" :model="userState" :rules="rules" label-width="100px">
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="userState.loginName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="userState.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWd">
        <el-input v-model="userState.passWd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="userState.department" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="post">
        <el-input v-model="userState.post" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog_footer">
        <el-button @click="onSubmit">确认</el-button>
        <el-button @click="isShow = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { rowStyle, cellStyle, headerCellStyle } from "../utils/tableStyle";
import { InfoFilled } from "@element-plus/icons-vue";
import { user } from "../api";
import { ElMessage } from "element-plus";
import usePagination from "../hooks/usePagination";
import useUser from "../hooks/useUser";
import { useStore } from "vuex";

const store = useStore();
const loginName = computed(() => store.state.user.loginName);
const first = ref(true);
const form = reactive({
  loginName: null,
});

const columns = ref([]);
const tableData = ref([]);
const loading = ref(false);

const total = ref(0);
const { currentChange, sizeChange, paginationState } = usePagination(getTableData);

const params = {
  loginName: form.loginName,
};

const { isShow, isAdd, userFormRef, userState, onClose, onSubmit, rules, doDeleteUser } =
  useUser(getTableData);

function search() {
  if (paginationState.currentPage !== 1) paginationState.currentPage = 1;
  setParams();
  getTableData();
}
// todo 待定
function reset() {
  form.loginName = null;
  setParams();
}

function setParams() {
  params.loginName = form.loginName || null;
}

function dels() {
  alert("dels");
}
function reload() {
  getTableData();
}

function getTableData() {
  if (loading.value) return;
  loading.value = true;

  user({ ...params, nowPage: paginationState.currentPage, showNum: paginationState.pageSize })
    .then((data) => {
      if (!data.success) {
        ElMessage.error("暂无数据");
        columns.value = [];
        tableData.value = [];
        total.value = 0;
        return;
      }
      columns.value = data.col;
      tableData.value = data.data.map((item) => {
        return item;
      });
      total.value = data.total;
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
        first.value && (first.value = false);
      }, 30);
    });
}
onMounted(() => {
  getTableData();
});
</script>

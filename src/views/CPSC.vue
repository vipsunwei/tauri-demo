<style lang="scss" scoped>
@keyframes shan {
  0% {
    background-color: rgba(4, 45, 83, 1);
  }
  50% {
    background-color: rgba(4, 45, 83, 0.5);
  }
  100% {
    background-color: rgba(4, 45, 83, 1);
  }
}
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
    // display: flex;
    // align-items: center;
    border: 1px solid #043267;
    box-shadow: 0 0 10px #043267 inset;

    .label {
      white-space: nowrap;
      color: #a3cccc;
      margin-right: 20px;
      font-size: 14px;
    }
    .separator {
      padding: 0 15px;
      color: #a3cccc;
      font-size: 14px;
    }
    // .station {
    // display: flex;
    // align-items: center;
    // }
    :deep(.el-input__inner) {
      color: #a3cccc;
      // background: #042d53;
      // width: 240px;
      border: none;
      outline: none;
      border-radius: 0;
    }
    :deep(.el-input__prefix-inner) {
      align-items: center;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    :deep(.el-button) {
      background: #042d53;
      border: none;
      outline: none;
      border-radius: 0;
      color: #00cced;
    }
  }
}

.alert-wrap {
  width: 300px;
  user-select: none;
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 20px;
  animation: shan 1s infinite;
  background-color: rgba(4, 45, 83, 1);
  :deep(.el-alert) {
    --el-color-warning: transparent;
    &.el-alert--warning.is-dark {
      color: #00cced;
    }
    &.is-dark .el-alert__close-btn {
      color: #00cced;
    }
  }
}

.table_wrap {
  padding: 0 20px;

  .btns {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
  }

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
  <section class="animate__animated animate__fadeInDown" style="height: 100%">
    <section class="container" v-loading="loading" element-loading-background="rgba(0,0,0,0.3)">
      <section class="table_toolbar">
        <div class="search_wrap">
          <el-space wrap :size="20">
            <div class="station">
              <span class="label">站名(站号)</span>
              <el-select v-model="form.stationNum" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in stationOptions"
                  :key="item.STATION_NUMBER"
                  :label="item.STATION_NAME"
                  :value="item.STATION_NUMBER"
                >
                  <span style="float: left">{{ item.STATION_NAME }}</span>
                  <span
                    style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                  >
                    {{ item.STATION_NUMBER }}
                  </span>
                </el-option>
              </el-select>
            </div>

            <div class="receive_time">
              <span class="label">时间</span>
              <el-date-picker
                v-model="form.startDate"
                type="datetime"
                placeholder="开始时间"
                @change="startDateChange"
                @blur="startDateBlur"
              >
              </el-date-picker>
              <span class="separator">至</span>
              <el-date-picker
                ref="endDateRef"
                v-model="form.endDate"
                type="datetime"
                placeholder="结束时间"
                @change="endDateChange"
              >
              </el-date-picker>
            </div>

            <el-button-group>
              <el-button type="primary" @click="search">查询</el-button>
              <!-- <el-button type="primary" @click="reset">重置</el-button> -->
            </el-button-group>
          </el-space>
        </div>

        <div class="button_wrap">
          <div>
            <el-button
              v-if="0"
              type="primary"
              :disabled="!multipleSelection.length"
              @click="pCreate"
            >
              批量生成
            </el-button>
          </div>

          <!-- 提示能量中心点有修改 -->
          <div class="alert-wrap" v-if="isShowAlert">
            <el-alert
              title="能量中心点有修改"
              type="warning"
              effect="dark"
              show-icon
              @close="onAlertClose"
            />
          </div>
        </div>
      </section>

      <section class="table_wrap">
        <div v-show="!!tableData.length">
          <el-table
            border
            ref="tableRef"
            :data="tableData"
            :row-style="rowStyle"
            :cell-style="cellStyle"
            :header-cell-style="headerCellStyle"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="60" align="center" />
            <el-table-column
              v-for="col in columns"
              :prop="col.id"
              :key="col.id"
              :label="col.label"
              align="center"
            >
              <template #default="{ row, column }">
                <span
                  v-if="column.property === 'status' && row[column.property] === '未生成'"
                  style="color: #f40"
                >
                  {{ row[column.property] }}
                </span>
                <span v-else>{{ row[column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="170">
              <template #default="scope">
                <div class="btns">
                  <el-popconfirm
                    confirm-button-text="是"
                    cancel-button-text="否"
                    :icon="InfoFilled"
                    title="确定要生成吗?"
                    @confirm="create(scope.row)"
                  >
                    <template #reference>
                      <el-button type="primary"> 生成 </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button type="primary" @click="edit(scope.row)"> 修改 </el-button>
                </div>
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

      <remark color="#a3cccc">
        备注：此模块由模拟仿真数据与探空观测数据生成了能量数据(落点距离差)、指数产品对比、规定层数据。
      </remark>
    </section>
  </section>

  <!-- 修改能量中心点经纬度表单 -->
  <el-dialog
    v-model="isShowEdit"
    :close-on-click-modal="false"
    width="30%"
    @close="onEditCPSCClose"
  >
    <template #title>
      <span class="dialog_title">{{ "修改能量中心点" }}</span>
    </template>

    <el-form :model="editCPSCState" ref="editCPSCRef" :rules="editCPSCRules" label-width="130px">
      <el-form-item label="能量中心点经度(°)" prop="lon">
        <el-input v-model="editCPSCState.lon" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="能量中心点纬度(°)" prop="lat">
        <el-input v-model="editCPSCState.lat" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog_footer">
        <el-button @click="onEditCPSCSubmit">确认</el-button>
        <el-button @click="isShowEdit = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { preproduct, preproductgen } from "../api";
import { rowStyle, cellStyle, headerCellStyle } from "../utils/tableStyle";
import { formatDate } from "../utils/utils";
import { InfoFilled } from "@element-plus/icons-vue";

import usePagination from "../hooks/usePagination";
import useDateRange from "../hooks/useDateRange";
import useEditCPSC from "../hooks/useEditCPSC";

import Remark from "../components/remark.vue";

const store = useStore();
const endDateRef = ref(null);
const first = ref(true);
const form = reactive({
  stationNum: null,
  startDate: null,
  endDate: null,
});
const stationOptions = computed(() => store.state.rawStations);
const multipleSelection = ref([]);
const columns = ref([]);
const tableData = ref([]);
const loading = ref(false);
const { startDateChange, startDateBlur, endDateChange, isAllOk } = useDateRange(form, endDateRef);
const { paginationState, currentChange, sizeChange } = usePagination(getTableData);
const total = ref(0);

const params = {
  stationNum: form.stationNum,
  startDate: form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss"),
  endDate: form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss"),
};

const { isShowEdit, editCPSCRef, editCPSCState, editCPSCRules, onEditCPSCClose, onEditCPSCSubmit } =
  useEditCPSC(getTableData);
function search() {
  if (!isAllOk()) return;
  if (paginationState.currentPage !== 1) paginationState.currentPage = 1;
  setParams();
  getTableData();
}

// todo 待定
function reset() {
  form.stationNum = null;
  form.startDate = null;
  form.endDate = null;
  setParams();
}
function reload() {
  getTableData();
}
function pCreate() {
  console.log("批量生成multipleSelection: ", multipleSelection.value);
}
function selectionChange(val) {
  console.log("selection-change: ", val);
  multipleSelection.value = val;
}

function setParams() {
  params.stationNum = form.stationNum || null;
  params.startDate = form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss");
  params.endDate = form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss");
}
function getTableData() {
  if (loading.value) return;
  loading.value = true;

  preproduct({ ...params, nowPage: paginationState.currentPage, showNum: paginationState.pageSize })
    .then((data) => {
      if (!data.success) {
        ElMessage.error("暂无数据");
        columns.value = [];
        tableData.value = [];
        total.value = 0;
        return;
      }
      columns.value = data?.col?.map((el) =>
        el.id === "horHeigh" ? { ...el, id: "horHeighFixed" } : el
      );

      tableData.value = (data.data || []).map((item) => {
        item.horHeighFixed = Number(item.horHeigh).toFixed(3);
        return item;
      });
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
      first.value && (first.value = false);
    });
}
// 生成
async function create(row) {
  console.log("生成row", row);
  const { data } = await preproductgen(row.id);
  console.log("产品生成结果：", data);
  if (data?.success) {
    ElMessage.success(data.message);
    getTableData();
    return;
  }
  ElMessage.error(data.message);
}
// 修改
function edit(row) {
  console.log("修改row", row);
  editCPSCState.id = row.id;
  isShowEdit.value = true;
}

const isShowAlert = ref(false);
function onAlertClose() {
  isShowAlert.value = false;
}

onMounted(() => {
  getTableData();
  // setTimeout(() => {
  //   isShowAlert.value = true;
  // }, 1000);
});
</script>

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
  min-height: 300px;
  padding: 0 20px;

  .demo-tabs {
    --el-border-color-light: #043267;

    :deep(.el-tabs__header) {
      --el-text-color-primary: #88b3d2;
      --el-color-primary: #0dd2e6;
    }
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
.textimg {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  .text {
    flex-shrink: 0;
  }
  .img {
    width: auto;
    height: 36px;
  }
  .img2 {
    width: auto;
    height: 76px;
  }
  .overline {
    text-decoration: overline;
  }
}
</style>

<template>
  <section class="animate__animated animate__fadeInLeft" style="height: 100%">
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
              <span class="label">数据时间</span>
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
          <el-button type="primary" @click="showIndexSettings = true"> 指标设置 </el-button>
        </div>
      </section>
      <section class="table_wrap">
        <el-tabs class="demo-tabs" v-model="stage" @tab-click="onTabClick">
          <el-tab-pane :name="stageEnum.UP">
            <template #label>
              <div class="custom-tabs-label"><span>上升段</span></div>
            </template>
            <div v-show="!!tableData.length">
              <el-table
                border
                scrollbar-always-on
                ref="tableRef"
                :data="tableData"
                :row-style="rowStyle"
                :cell-style="cellStyle"
                :header-cell-style="headerCellStyle"
              >
                <el-table-column prop="station" label="站名(站号)" width="150" align="center" />
                <el-table-column prop="date" label="时间" width="200" align="center" />
                <el-table-column
                  label="LFC温度"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcT')"
                >
                  <el-table-column prop="lfcTAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="lfcTMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="LFC气压"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcP')"
                >
                  <el-table-column prop="lfcPAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="lfcPMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="沙氏指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'shack')"
                >
                  <el-table-column prop="shackAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="shackMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="抬升指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lifted')"
                >
                  <el-table-column prop="liftedAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="liftedMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="对流层有效位能"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'cape')"
                >
                  <el-table-column prop="capeAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="capeMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="总指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'total')"
                >
                  <el-table-column prop="totalAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="totalMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  prop="compreIndex"
                  label="综合对比指数(权重)"
                  width="170"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="centerLonLat"
                  label="能量中心点经纬度"
                  width="160"
                  align="center"
                >
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
          </el-tab-pane>
          <el-tab-pane :name="stageEnum.DOWN">
            <template #label>
              <div class="custom-tabs-label"><span>下降段</span></div>
            </template>
            <div v-show="!!tableData.length">
              <el-table
                border
                scrollbar-always-on
                ref="tableRef"
                :data="tableData"
                :row-style="rowStyle"
                :cell-style="cellStyle"
                :header-cell-style="headerCellStyle"
              >
                <el-table-column prop="station" label="站名(站号)" width="150" align="center" />
                <el-table-column prop="date" label="时间" width="200" align="center" />
                <el-table-column
                  label="LFC温度"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcT')"
                >
                  <el-table-column prop="lfcTAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="lfcTMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="LFC气压"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcP')"
                >
                  <el-table-column prop="lfcPAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="lfcPMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="沙氏指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'shack')"
                >
                  <el-table-column prop="shackAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="shackMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="抬升指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lifted')"
                >
                  <el-table-column prop="liftedAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="liftedMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="对流层有效位能"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'cape')"
                >
                  <el-table-column prop="capeAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="capeMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="总指数"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'total')"
                >
                  <el-table-column prop="totalAbs" label="绝对差" width="120" align="center" />
                  <el-table-column prop="totalMse" label="均方根误差" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  prop="compreIndex"
                  label="综合对比指数(权重)"
                  width="170"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="centerLonLat"
                  label="能量中心点经纬度"
                  width="160"
                  align="center"
                >
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
          </el-tab-pane>
        </el-tabs>
      </section>

      <remark color="#a3cccc">
        <p>备注：权重默认为平均权重</p>
        <p>绝对差：|Predicted-Actual|</p>
        <p class="textimg">
          <span class="text">均方根误差：</span>
          <img class="img" draggable="false" src="./../assets/dbfxjfg.png" />
          <!-- <dbfx-jfg /> -->
        </p>
        <p>Predicted 为预测数据，Actual为实际数据</p>
        <p class="textimg">
          <span class="text">相关系数：</span>
          <img class="img2" draggable="false" src="./../assets/dbfxxgx.png" />
          <!-- <dbfx-xgx /> -->
        </p>
        <p class="textimg">
          <span>X为预测数据；</span><span>Y为实际数据；</span>
          <span><span class="overline">X</span><span>为预测数据的平均值；</span></span>
          <span><span class="overline">Y</span><span>为实际数据的平均值</span></span>
        </p>
      </remark>
    </section>
  </section>

  <el-dialog custom-class="el_dialog" v-model="showIndexSettings" :close-on-click-modal="false">
    <template #header><span class="dialog_title">指标设置</span></template>
    <el-checkbox
      v-if="dialogState.fields?.length"
      v-model="dialogState.checkAll"
      :indeterminate="dialogState.isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group v-model="dialogState.checkedFields" @change="handleCheckedFieldsChange">
      <el-checkbox v-for="field in dialogState.fields" :key="field" :label="field">
        {{ COLUMNS_MAP[field] }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog_footer">
        <el-button @click="onSubmit"> 确定 </el-button>
        <el-button @click="onCancel"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRaw } from "vue";
import { rowStyle, cellStyle, headerCellStyle } from "../utils/tableStyle";
// import { px2vw } from "../utils/utils";
import { indexproduct } from "../api";
import { ElMessage } from "element-plus";
import { formatDate } from "../utils/utils";
import { useStore } from "vuex";
import useDateRange from "../hooks/useDateRange";
import usePagination from "../hooks/usePagination";
import { stageEnum } from "@/api/constants";
import Remark from "@/components/remark.vue";
// import DbfxJfg from "@/components/math/dbfx.jfg.vue";
// import DbfxXgx from "@/components/math/dbfx.xgx.vue";

const first = ref(true);
const endDateRef = ref(null);
const store = useStore();

const form = reactive({
  stationNum: null,
  startDate: null,
  endDate: null,
});
const stationOptions = computed(() => store.state.rawStations);

const { startDateChange, startDateBlur, endDateChange, isAllOk } = useDateRange(form, endDateRef);

const { paginationState, currentChange, sizeChange } = usePagination(getTableData);

const asyncColumns = ["lfcT", "lfcP", "shack", "lifted", "cape", "total"];
const COLUMNS_MAP = {
  lfcT: "lfc温度",
  lfcP: "lfc气压",
  shack: "沙氏指数",
  lifted: "抬升指数",
  cape: "对流有效位能",
  total: "总指数",
};
const displayColumns = ref([...asyncColumns]);
const showIndexSettings = ref(false);
const dialogState = reactive({
  checkAll: true,
  isIndeterminate: false,
  checkedFields: asyncColumns,
  fields: asyncColumns,
});

const tableRef = ref(null);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const stage = ref(stageEnum.UP);
const params = {
  stage: stage.value,
  stationNum: form.stationNum,
  startDate: form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss"),
  endDate: form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss"),
  element: getElement(toRaw(dialogState.checkedFields)),
};

function search() {
  if (!isAllOk()) return;
  if (paginationState.currentPage !== 1) paginationState.currentPage = 1;
  setParams();
  getTableData();
}
/**
 * @param {string|null} element 要素：逗号拼接
 */
function setParams(element) {
  params.stage = stage.value;
  params.stationNum = form.stationNum || null;
  params.startDate = form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss");
  params.endDate = form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss");
  element && (params.element = element);
}
// function reset() {}
// const columns = [
//   "lfcTAbs", // lfc 温度绝对差
//   "lfcTMse", // lfc 温度均方根误差
//   "lfcPAbs", // lfc 气压绝对差
//   "lfcPMse", // lfc 气压均方根误差
//   "shackAbs", // 沙氏指数绝对差
//   "shackMse", // 沙氏指数均方根误差
//   "liftedAbs", // 抬升指数绝对差
//   "liftedMse", // 抬升指数均方根误差
//   "capeAbs", // 对流有效位能绝对差
//   "capeMse", // 对流有效位能均方根误差
//   "totalAbs", // 总指数绝对差
//   "totalMse", // 总指数均方根误差
//   "compreIndex", // 综合对比指数
// ];
function handleCheckAllChange(val) {
  console.log(val);
  dialogState.checkedFields = val ? asyncColumns : [];
  dialogState.isIndeterminate = false;
  console.log(dialogState.checkedFields);
}
function handleCheckedFieldsChange(value) {
  console.log(value);
  const checkedCount = value.length;
  dialogState.checkAll = checkedCount === dialogState.fields.length;
  dialogState.isIndeterminate = checkedCount > 0 && checkedCount < dialogState.fields.length;
}
function onCancel() {
  showIndexSettings.value = false;
  dialogState.checkedFields = displayColumns.value;
}
function onSubmit() {
  console.log("columns:", dialogState.checkedFields);
  if (!dialogState.checkedFields?.length) {
    ElMessage.error("请选择指标");
    return;
  }

  displayColumns.value = toRaw(dialogState.checkedFields);

  setParams(getElement(toRaw(dialogState.checkedFields)));
  getTableData();

  showIndexSettings.value = false;
}

function getElement(checkedFields) {
  let element = "";
  element = checkedFields.reduce((r, c) => {
    if (c?.length) {
      r = r + c + ",";
    }
    return r;
  }, "");
  element = element.slice(0, -1) || null;
  console.log("element: ", element);
  return element;
}
function getTableData() {
  if (loading.value) return;
  loading.value = true;

  indexproduct({
    ...params,
    nowPage: paginationState.currentPage,
    showNum: paginationState.pageSize,
  })
    .then((data) => {
      console.log("indexproduct", data);
      if (!data?.success) {
        ElMessage.error("暂无数据");
        tableData.value = [];
        return;
      }
      total.value = data.total;
      handleTableData(data.data);
    })
    .finally(() => {
      loading.value = false;
      first.value && (first.value = false);
    });
}
function handleTableData(arr) {
  // let tempArr = [];
  // for (const key in obj) {
  //   if (Object.hasOwnProperty.call(obj, key)) {
  //     const element = obj[key];
  //     element.n = key.replace("n", "");
  //     tempArr.push(element);
  //   }
  // }
  tableData.value = arr.sort((a, b) => b.surface - a.surface);
  console.log(tableData.value);
}

function onTabClick() {
  setParams();
  getTableData();
}

onMounted(() => {
  getTableData();
});
</script>

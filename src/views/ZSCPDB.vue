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
              <span class="label">??????(??????)</span>
              <el-select v-model="form.stationNum" placeholder="?????????" clearable filterable>
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
              <span class="label">????????????</span>
              <el-date-picker
                v-model="form.startDate"
                type="datetime"
                placeholder="????????????"
                @change="startDateChange"
                @blur="startDateBlur"
              >
              </el-date-picker>
              <span class="separator">???</span>
              <el-date-picker
                ref="endDateRef"
                v-model="form.endDate"
                type="datetime"
                placeholder="????????????"
                @change="endDateChange"
              >
              </el-date-picker>
            </div>

            <el-button-group>
              <el-button type="primary" @click="search">??????</el-button>
              <!-- <el-button type="primary" @click="reset">??????</el-button> -->
            </el-button-group>
          </el-space>
        </div>

        <div class="button_wrap">
          <el-button type="primary" @click="showIndexSettings = true"> ???????????? </el-button>
        </div>
      </section>
      <section class="table_wrap">
        <el-tabs class="demo-tabs" v-model="stage" @tab-click="onTabClick">
          <el-tab-pane :name="stageEnum.UP">
            <template #label>
              <div class="custom-tabs-label"><span>?????????</span></div>
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
                <el-table-column prop="station" label="??????(??????)" width="150" align="center" />
                <el-table-column prop="date" label="??????" width="200" align="center" />
                <el-table-column
                  label="LFC??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcT')"
                >
                  <el-table-column prop="lfcTAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="lfcTMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="LFC??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcP')"
                >
                  <el-table-column prop="lfcPAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="lfcPMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'shack')"
                >
                  <el-table-column prop="shackAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="shackMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lifted')"
                >
                  <el-table-column prop="liftedAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="liftedMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="?????????????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'cape')"
                >
                  <el-table-column prop="capeAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="capeMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="?????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'total')"
                >
                  <el-table-column prop="totalAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="totalMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  prop="compreIndex"
                  label="??????????????????(??????)"
                  width="170"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="centerLonLat"
                  label="????????????????????????"
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
            <el-empty v-show="!tableData.length && !first" description="????????????"></el-empty>
          </el-tab-pane>
          <el-tab-pane :name="stageEnum.DOWN">
            <template #label>
              <div class="custom-tabs-label"><span>?????????</span></div>
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
                <el-table-column prop="station" label="??????(??????)" width="150" align="center" />
                <el-table-column prop="date" label="??????" width="200" align="center" />
                <el-table-column
                  label="LFC??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcT')"
                >
                  <el-table-column prop="lfcTAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="lfcTMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="LFC??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lfcP')"
                >
                  <el-table-column prop="lfcPAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="lfcPMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'shack')"
                >
                  <el-table-column prop="shackAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="shackMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'lifted')"
                >
                  <el-table-column prop="liftedAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="liftedMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="?????????????????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'cape')"
                >
                  <el-table-column prop="capeAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="capeMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="?????????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'total')"
                >
                  <el-table-column prop="totalAbs" label="?????????" width="120" align="center" />
                  <el-table-column prop="totalMse" label="???????????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  prop="compreIndex"
                  label="??????????????????(??????)"
                  width="170"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="centerLonLat"
                  label="????????????????????????"
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
            <el-empty v-show="!tableData.length && !first" description="????????????"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </section>

      <remark color="#a3cccc">
        <p>????????????????????????????????????</p>
        <p>????????????|Predicted-Actual|</p>
        <p class="textimg">
          <span class="text">??????????????????</span>
          <img class="img" draggable="false" src="./../assets/dbfxjfg.png" />
          <!-- <dbfx-jfg /> -->
        </p>
        <p>Predicted ??????????????????Actual???????????????</p>
        <p class="textimg">
          <span class="text">???????????????</span>
          <img class="img2" draggable="false" src="./../assets/dbfxxgx.png" />
          <!-- <dbfx-xgx /> -->
        </p>
        <p class="textimg">
          <span>X??????????????????</span><span>Y??????????????????</span>
          <span><span class="overline">X</span><span>??????????????????????????????</span></span>
          <span><span class="overline">Y</span><span>???????????????????????????</span></span>
        </p>
      </remark>
    </section>
  </section>

  <el-dialog custom-class="el_dialog" v-model="showIndexSettings" :close-on-click-modal="false">
    <template #header><span class="dialog_title">????????????</span></template>
    <el-checkbox
      v-if="dialogState.fields?.length"
      v-model="dialogState.checkAll"
      :indeterminate="dialogState.isIndeterminate"
      @change="handleCheckAllChange"
    >
      ??????
    </el-checkbox>
    <el-checkbox-group v-model="dialogState.checkedFields" @change="handleCheckedFieldsChange">
      <el-checkbox v-for="field in dialogState.fields" :key="field" :label="field">
        {{ COLUMNS_MAP[field] }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog_footer">
        <el-button @click="onSubmit"> ?????? </el-button>
        <el-button @click="onCancel"> ?????? </el-button>
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
  lfcT: "lfc??????",
  lfcP: "lfc??????",
  shack: "????????????",
  lifted: "????????????",
  cape: "??????????????????",
  total: "?????????",
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
 * @param {string|null} element ?????????????????????
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
//   "lfcTAbs", // lfc ???????????????
//   "lfcTMse", // lfc ?????????????????????
//   "lfcPAbs", // lfc ???????????????
//   "lfcPMse", // lfc ?????????????????????
//   "shackAbs", // ?????????????????????
//   "shackMse", // ???????????????????????????
//   "liftedAbs", // ?????????????????????
//   "liftedMse", // ???????????????????????????
//   "capeAbs", // ???????????????????????????
//   "capeMse", // ?????????????????????????????????
//   "totalAbs", // ??????????????????
//   "totalMse", // ????????????????????????
//   "compreIndex", // ??????????????????
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
    ElMessage.error("???????????????");
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
        ElMessage.error("????????????");
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

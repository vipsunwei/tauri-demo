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
    .receive_time {
      display: flex;
      align-items: center;
      :deep(.el-input.el-date-editor) {
        width: 150px;
      }
      :deep(.el-select) {
        width: 110px;
      }
    }
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

  // .buttons_wrap {
  //   margin-bottom: 10px;
  // }
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

  .bottom_tips {
    color: #a3cccc;
    padding: 20px 0;
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
                v-model="form.date"
                type="date"
                placeholder="???????????????"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
              <el-time-select
                v-model="form.hour"
                start="00:00"
                step="12:00"
                end="12:00"
                placeholder="??????"
                format="HH???"
              ></el-time-select>
            </div>

            <div class="file_num">
              <span class="label">????????????</span>
              <el-select v-model="form.fileNum" placeholder="?????????" clearable filterable>
                <el-option v-for="item in fileNumOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>

            <el-button-group>
              <el-button type="primary" @click="search">??????</el-button>
              <!-- <el-button type="primary" @click="reset">??????</el-button> -->
            </el-button-group>
          </el-space>
        </div>

        <div class="button_wrap">
          <!-- <el-button type="primary" @click="add">??????</el-button> -->
          <!-- <el-button type="primary" @click="dels">????????????</el-button> -->
          <el-button type="primary" @click="showIndexSettings = true">????????????</el-button>
          <!-- <el-button type="primary" @click="weightSettings">????????????</el-button> -->
        </div>
      </section>
      <section class="table_wrap">
        <!-- <section class="buttons_wrap">
          <el-button color="#042d53" style="color: #00cced">?????????</el-button>
          <el-button color="#042d53" style="color: #00cced">?????????</el-button>
          <el-button color="#042d53" style="color: #00cced">?????????</el-button>
        </section> -->
        <el-tabs class="demo-tabs" v-model="stage" @tab-click="onTabClick">
          <el-tab-pane :name="stageEnum.UP">
            <template #label>
              <div class="custom-tabs-label">
                <span>?????????</span>
              </div>
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
                <el-table-column
                  prop="surface"
                  label="???????????????(hPa)"
                  width="150"
                  align="center"
                />
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'temp')"
                >
                  <el-table-column prop="temp_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="temp_mse" label="???????????????" width="120" align="center" />
                  <el-table-column
                    prop="temp_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'rhum')"
                >
                  <el-table-column prop="rhum_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="rhum_mse" label="???????????????" width="120" align="center" />
                  <el-table-column
                    prop="rhum_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'pre')"
                >
                  <el-table-column prop="pre_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="pre_mse" label="???????????????" width="120" align="center" />
                  <el-table-column prop="pre_relevance" label="?????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="???u"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windu')"
                >
                  <el-table-column prop="wind_u_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_u_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_u_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="???v"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windv')"
                >
                  <el-table-column prop="wind_v_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_v_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_v_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="???w"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windw')"
                >
                  <el-table-column prop="wind_w_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_w_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_w_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  prop="compre_index"
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
            </div>
            <el-empty v-show="!tableData.length && !first" description="????????????"></el-empty>
          </el-tab-pane>
          <el-tab-pane :name="stageEnum.DOWN">
            <template #label>
              <div class="custom-tabs-label">
                <span>?????????</span>
              </div>
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
                <el-table-column
                  prop="surface"
                  label="???????????????(hPa)"
                  width="150"
                  align="center"
                />
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'temp')"
                >
                  <el-table-column prop="temp_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="temp_mse" label="???????????????" width="120" align="center" />
                  <el-table-column
                    prop="temp_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'rhum')"
                >
                  <el-table-column prop="rhum_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="rhum_mse" label="???????????????" width="120" align="center" />
                  <el-table-column
                    prop="rhum_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="??????"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'pre')"
                >
                  <el-table-column prop="pre_abs" label="?????????" width="120" align="center" />
                  <el-table-column prop="pre_mse" label="???????????????" width="120" align="center" />
                  <el-table-column prop="pre_relevance" label="?????????" width="120" align="center" />
                </el-table-column>
                <el-table-column
                  label="???u"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windu')"
                >
                  <el-table-column prop="wind_u_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_u_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_u_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="???v"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windv')"
                >
                  <el-table-column prop="wind_v_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_v_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_v_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="???w"
                  align="center"
                  v-if="displayColumns.find((item) => item === 'windw')"
                >
                  <el-table-column prop="wind_w_abs" label="?????????" width="120" align="center" />
                  <el-table-column
                    prop="wind_w_mse"
                    label="???????????????"
                    width="120"
                    align="center"
                  />
                  <el-table-column
                    prop="wind_w_relevance"
                    label="?????????"
                    width="120"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  prop="compre_index"
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
            </div>
            <el-empty v-show="!tableData.length && !first" description="????????????"></el-empty>
          </el-tab-pane>
          <!-- <el-tab-pane :name="stageEnum.HOR">
            <template #label>
              <div class="custom-tabs-label"><span>?????????</span></div>
            </template>
            ??????
          </el-tab-pane> -->
        </el-tabs>
      </section>
      <remark color="#a3cccc">
        <p>????????????????????????????????????</p>
        <p>????????????|Predicted-Actual|</p>
        <p class="textimg">
          <span class="text">??????????????????</span>
          <img class="img" draggable="false" src="./../assets/dbfxjfg.png" />
        </p>
        <p>Predicted ??????????????????Actual???????????????</p>
        <p class="textimg">
          <span class="text">???????????????</span>
          <img class="img2" draggable="false" src="./../assets/dbfxxgx.png" />
        </p>
        <p class="textimg">
          <span>X??????????????????</span><span>Y??????????????????</span>
          <span><span class="overline">X</span><span>??????????????????????????????</span></span>
          <span><span class="overline">Y</span><span>???????????????????????????</span></span>
        </p>
      </remark>
    </section>
  </section>

  <!-- ???????????? -->
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
import { useStore } from "vuex";
import { speclayerpro } from "../api";
import { ElMessage } from "element-plus";
// import { formatDate } from "../utils/utils";
import { stageEnum } from "@/api/constants";
import Remark from "@/components/remark.vue";

const store = useStore();
// const defaultDate = new Date("2021-10-24 07:00:00");
const first = ref(true);
const tableRef = ref(null);
const tableData = ref([]);
const loading = ref(false);
const form = reactive({
  stationNum: null,
  date: null,
  hour: null,
  fileNum: null,
});
const stationOptions = computed(() => store.state.rawStations);
const fileNumOptions = ref(["1", "2", "3", "4", "5", "6", "7", "8", "9", "a"]);

const asyncColumns = ["temp", "rhum", "pre", "windu", "windv", "windw"];
const COLUMNS_MAP = {
  temp: "??????",
  rhum: "??????",
  pre: "??????",
  windu: "???u",
  windv: "???v",
  windw: "???w",
};
const displayColumns = ref([...asyncColumns]);
const showIndexSettings = ref(false);
const dialogState = reactive({
  checkAll: true,
  isIndeterminate: false,
  checkedFields: asyncColumns,
  fields: asyncColumns,
});
function search() {
  getTableData();
}

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
  getTableData();

  showIndexSettings.value = false;
}
function validateDate(date, hour) {
  if (!date && hour) return { valid: false, message: "???????????????" };
  if (!hour && date) return { valid: false, message: "???????????????" };
  return { valid: true };
}
function handleDate(date, hour) {
  if (!date) return null;
  if (!hour) return `${date} 00:00:00`;
  const time = hour.replace("???", "") + ":00:00";
  return `${date} ${time}`;
}
function getParams(form, checkedFields) {
  const params = {
    stationNum: form.stationNum || null,
    date: handleDate(form.date, form.hour),
    fileNum: form.fileNum || null,
    element: null,
    stage: stage.value,
  };

  let element = "";
  element = checkedFields.reduce((r, c) => {
    if (c?.length) {
      r = r + c + ",";
    }
    return r;
  }, "");
  params.element = element.slice(0, -1) || null;
  console.log("params: ", params);
  return params;
}
function getTableData() {
  const validRes = validateDate(form.date, form.hour);
  if (!validRes.valid) {
    ElMessage.warning(validRes.message);
    return;
  }
  if (loading.value) return;
  loading.value = true;

  speclayerpro(getParams(form, displayColumns.value))
    .then((data) => {
      console.log("speclayerpro", data);
      if (!data?.success) {
        ElMessage.error("????????????");
        tableData.value = [];
        return;
      }
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
}

const stage = ref(stageEnum.UP);
function onTabClick() {
  // switchTab(stage.value);
  getTableData();
}
// function switchTab(active) {
//   getTableData();
// }

onMounted(() => {
  getTableData();
});
</script>

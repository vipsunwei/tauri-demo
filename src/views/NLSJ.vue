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
</style>

<template>
  <section class="animate__animated animate__fadeInRight" style="height: 100%">
    <section class="container" v-loading="loading" element-loading-background="rgba(0,0,0,0.3)">
      <section class="table_toolbar">
        <div class="search_wrap">
          <el-space wrap :size="20">
            <div class="station" v-if="false">
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
              <span class="label">??????????????????</span>
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
          <el-button type="primary" @click="reload">??????</el-button>
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
              <template #default="{ row, column }">
                <span
                  v-if="column.property === 'status' && row[column.property] !== '??????'"
                  style="color: #f40"
                >
                  {{ row[column.property] }}
                </span>
                <span v-else>{{ row[column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="??????" align="center">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  :loading="curDownloading === row.fileName"
                  :disabled="curDownloading === row.fileName"
                  @click="download(row)"
                >
                  ????????????
                </el-button>
                <!-- <el-button type="error" @click="showDelConfirm(scope.row)">??????</el-button> -->
                <!-- <el-popconfirm
              confirm-button-text="???"
              cancel-button-text="???"
              :icon="InfoFilled"
              icon-color="red"
              title="???????????????????"
              @confirm="doDel(scope.row)"
            >
              <template #reference>
                <el-button type="danger">??????</el-button>
              </template>
            </el-popconfirm> -->
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

        <el-empty v-show="!tableData.length && !first" description="????????????"></el-empty>
      </section>

      <remark color="#a3cccc">????????????????????????????????????????????????????????????????????????</remark>
    </section>
  </section>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { downloadenergy, energydata } from "../api";
import { rowStyle, cellStyle, headerCellStyle } from "../utils/tableStyle";
// import { InfoFilled } from "@element-plus/icons-vue";
import { formatDate } from "../utils/utils";

import useDateRange from "../hooks/useDateRange";
import usePagination from "../hooks/usePagination";
import { saveAs } from "../utils/handleFiles";

import Remark from "../components/remark.vue";

const store = useStore();
const endDateRef = ref(null);
const first = ref(true);
const form = reactive({
  startDate: null,
  endDate: null,
});
const stationOptions = computed(() => store.state.rawStations);
const columns = ref([]);
const tableData = ref([]);
const loading = ref(false);

const { paginationState, currentChange, sizeChange } = usePagination(getTableData);
const total = ref(0);

const params = {
  startDate: form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss"),
  endDate: form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss"),
};
const { startDateChange, endDateChange, startDateBlur, isDateOk } = useDateRange(form, endDateRef);

function search() {
  if (!isDateOk()) return;

  if (paginationState.currentPage !== 1) paginationState.currentPage = 1;
  setParams();
  getTableData();
}
function reset() {
  form.startDate = null;
  form.endDate = null;
  setParams();
}
function setParams() {
  params.startDate = form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss");
  params.endDate = form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss");
}

function reload() {
  getTableData();
}

function getTableData() {
  if (loading.value) return;
  loading.value = true;

  energydata({ ...params, nowPage: paginationState.currentPage, showNum: paginationState.pageSize })
    .then((data) => {
      if (!data.success) {
        ElMessage.error("????????????");
        columns.value = [];
        tableData.value = [];
        total.value = 0;
        return;
      }
      columns.value = data.col;
      tableData.value = data.data || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
      first.value && (first.value = false);
    });
}

const curDownloading = ref(null);
function download(row) {
  console.log(row);
  if (curDownloading.value) return;
  if (!row.fileName) {
    ElMessage.warning("???????????????");
    return;
  }
  const fileName = row.fileName;
  curDownloading.value = row.fileName;
  downloadenergy({ fileName })
    .then((data) => {
      const { filename, blob } = data;
      saveAs(blob, filename);
    })
    .catch((err) => {
      console.dir(err);
    })
    .finally(() => {
      curDownloading.value = null;
    });
}

onMounted(() => {
  getTableData();
});
</script>

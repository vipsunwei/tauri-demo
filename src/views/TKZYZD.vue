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
.dst-range {
  display: flex;
  align-items: center;
  .dst-range__separator {
    width: 30px;
    text-align: center;
    padding: 0 8px;
    font-size: 18px;
    color: #b5dff3;
  }
}
.textimg {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  .img {
    width: auto;
    height: 37px;
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
          <!-- <el-button type="primary" @click="reload">刷新</el-button> -->
          <el-button type="primary" :disabled="!multipleSelection.length" @click="pCreate">
            批量生成
          </el-button>
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
                  v-if="column.property === 'status' && row[column.property] !== '成功'"
                  style="color: #f40"
                >
                  {{ row[column.property] }}
                </span>
                <span
                  v-else-if="column.property === 'geodis' && !!row?.isOptimal"
                  style="color: #87d068; font-weight: bold"
                >
                  {{ row[column.property] }}
                </span>
                <span
                  v-else-if="column.property === 'taskStatus' && row[column.property] !== '未生成'"
                  style="color: #87d068; font-weight: bold"
                >
                  {{ row[column.property] }}
                </span>
                <span v-else>{{ row[column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="170">
              <template #default="{ row }">
                <el-button v-if="row.taskStatus === '未生成'" type="primary" @click="create(row)">
                  生成
                </el-button>
                <el-button v-else type="primary" @click="lookOver(row)"> 查看 </el-button>
                <el-button type="primary" @click="send(row)"> 下发 </el-button>
                <!-- <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilled"
              icon-color="red"
              title="确定要删除吗?"
              @confirm="doDel(row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
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
        <el-empty v-show="!tableData.length && !first" description="暂无数据"></el-empty>
      </section>
      <remark color="#a3cccc">
        <p>落点距离差公式：预测落点经度和纬度与能量中心点的经度和纬度计算两点距离差</p>
        <p class="textimg">
          <img class="img" draggable="false" src="./../assets/tkzyzd.png" />
          <!-- <tkzyzd /> -->
        </p>
        <p>1. Lng1 Lat1 表示能量中心点经纬度，Lng2 Lat2 表示预测落点的经纬度</p>
        <p>2. a=Lat1 - Lat2 为两点纬度之差 b=Lng1 - Lng2 为两点经度之差</p>
        <p>3. 6371000为地球平均半径，单位为米</p>
      </remark>
    </section>
  </section>

  <!-- 生成指导单表单 -->
  <el-dialog
    v-model="isShowCreate"
    :close-on-click-modal="false"
    width="30%"
    @close="onCreateTaskClose"
  >
    <template #title>
      <span class="dialog_title">{{ "探空作业指导单信息" }}</span>
    </template>

    <el-form
      :model="createTaskState"
      ref="createTaskRef"
      :rules="createTaskRules"
      label-width="160px"
    >
      <el-form-item label="放球时间" prop="releaseTime">
        <el-date-picker
          v-model="createTaskState.releaseTime"
          type="datetime"
          placeholder="请选择"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="平漂高度(m)" prop="horHeight">
        <el-input v-model="createTaskState.horHeight" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="预测下降位置经度(°)" prop="downLon">
        <el-input v-model="createTaskState.downLon" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="预测下降位置纬度(°)" prop="downLat">
        <el-input v-model="createTaskState.downLat" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="目标区域误差范围(m)">
        <div class="dst-range">
          <el-form-item prop="dstRangeStart">
            <el-input v-model="createTaskState.dstRangeStart" autocomplete="off"></el-input>
          </el-form-item>
          <span class="dst-range__separator">~</span>
          <el-form-item prop="dstRangeEnd">
            <el-input v-model="createTaskState.dstRangeEnd" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog_footer">
        <el-button @click="onCreateTaskSubmit(ids)">确认</el-button>
        <el-button @click="isShowCreate = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { dpstaskq, preoperation } from "../api";
import { rowStyle, cellStyle, headerCellStyle } from "../utils/tableStyle";
import { formatDate } from "../utils/utils";
// import { InfoFilled } from "@element-plus/icons-vue";
import usePagination from "../hooks/usePagination";
import useDateRange from "../hooks/useDateRange";
import useCreateTask from "../hooks/useCreatTask";
import Remark from "@/components/remark.vue";
// import tkzyzd from "@/components/math/tkzyzd.vue";

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
const total = ref(0);
const loading = ref(false);
const { startDateChange, startDateBlur, endDateChange, isAllOk } = useDateRange(form, endDateRef);
const { paginationState, currentChange, sizeChange } = usePagination(getTableData);
const {
  createTaskRef,
  isShowCreate,
  createTaskRules,
  createTaskState,
  onCreateTaskClose,
  onCreateTaskSubmit,
} = useCreateTask(getTableData);

const params = {
  stationNum: form.stationNum,
  startDate: form.startDate && formatDate(new Date(form.startDate), "yyyy-MM-dd HH:mm:ss"),
  endDate: form.endDate && formatDate(new Date(form.endDate), "yyyy-MM-dd HH:mm:ss"),
};

function search() {
  if (!isAllOk()) return;
  if (paginationState.currentPage !== 1) paginationState.currentPage = 1;
  setParams();
  getTableData();
}

function reset() {
  form.stationNum = null;
  form.startDate = null;
  form.endDate = null;
  setParams();
}

// function reload() {
//   getTableData();
// }
// 批量生成指导单
function pCreate() {
  console.log("批量生成指导单: ", multipleSelection.value);
  ids.value = multipleSelection.value.reduce((pre, cur) => {
    return pre ? `${pre},${cur.id}` : `${cur.id}`;
  }, "");
  !isShowCreate.value && (isShowCreate.value = true);
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
  preoperation({
    ...params,
    nowPage: paginationState.currentPage,
    showNum: paginationState.pageSize,
  })
    .then((data) => {
      if (!data.success) {
        ElMessage.error("暂无数据");
        columns.value = [];
        tableData.value = [];
        total.value = 0;
        return;
      }
      columns.value = data.col;
      tableData.value = (data.data || []).map((item) => {
        item.horHeigh = Number(item.horHeigh).toFixed(3);
        return item;
      });
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
      first.value && (first.value = false);
    });
}
// 生成指导单
const ids = ref(""); // 逗号拼接id
function create(row) {
  ids.value = `${row.id}`;
  !isShowCreate.value && (isShowCreate.value = true);
}
// 查看指导单
function lookOver(row) {
  ids.value = `${row.id}`;
  !isShowCreate.value && (isShowCreate.value = true);
  /**
   * 1.查询是否已经有生成过的指导单
   */
  dpstaskq({ id: row.id }).then((data) => {
    console.log("查询是否已经有生成过的指导单: ", data);
    if (!data?.success) return;

    Object.keys(createTaskState).forEach((key) => {
      createTaskState[key] = data.data?.[key];
    });
  });
}
// 下发指导单
function send(row) {
  console.log(row);
  ElMessage.warning("系统未对接放球作业平台，无法下发探空作业指导单。");
}

onMounted(() => {
  getTableData();
});
</script>

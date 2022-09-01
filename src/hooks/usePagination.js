import { reactive } from "vue";

export default function usePagination(getTableData) {
  const paginationState = reactive({
    currentPage: 1,
    pageSize: 10,
  });

  function currentChange(e) {
    paginationState.currentPage !== e && (paginationState.currentPage = e);
    getTableData();
  }
  function sizeChange(e) {
    paginationState.pageSize !== e && (paginationState.pageSize = e);
    paginationState.currentPage != 1 && (paginationState.currentPage = 1);
    getTableData();
  }

  return { paginationState, currentChange, sizeChange };
}

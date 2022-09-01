<template>
  <div class="breadcrumb">
    <img class="icon-breadcrumb" src="../assets/icon-breadcrumb.png" />
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-if="true">首页</el-breadcrumb-item>
      <template v-for="(bc, i) in breadCrumbs" :key="i">
        <el-breadcrumb-item v-if="false">{{ bc.NAME }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>{{ bc.NAME }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup>
// import { ArrowRight } from "@element-plus/icons";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const breadCrumbs = computed(() => store.state.breadCrumbs);
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 28px;
  width: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  .icon-breadcrumb {
    width: 13px;
    height: 16px;
    margin-right: 6px;
  }
  :deep(.el-breadcrumb__inner) {
    color: #fff;
  }
}
</style>

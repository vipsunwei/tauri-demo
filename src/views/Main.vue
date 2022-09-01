<style lang="scss" scoped>
.main-container {
  box-sizing: border-box;
  width: calc(100% - 204px);
  height: calc(100% - 90px);
  overflow: hidden;
  background-color: #021132;
  border: 1px solid #043267;
  box-shadow: 0 0 10px #043267 inset;
  position: absolute;
  top: 70px;
  left: 188px;
  z-index: 1024;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <main-header></main-header>
  <main-menu></main-menu>
  <div class="main-container">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import MainHeader from "../components/Header.vue";
import MainMenu from "../components/Menu.vue";
const store = useStore();
store.dispatch("getStations");
</script>

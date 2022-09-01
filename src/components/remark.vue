<template>
  <section class="remark_wrap">
    <span v-if="props.text" key="0">
      {{ props.text }}
    </span>
    <slot v-else key="1"></slot>
  </section>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ text: String, color: String });
const color = computed(() => props.color || "rgba(255,255,255, 0.8)");
</script>

<style lang="scss" scoped>
.remark_wrap {
  user-select: none;
  padding: 10px 20px;
  color: v-bind(color);
}
</style>

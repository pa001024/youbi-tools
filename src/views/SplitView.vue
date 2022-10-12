<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Fleet } from "@/util/vector";

const mission = reactive({
  start: "(0,0)",
});

const state = reactive({
  fleets: [] as Fleet[],
  now: Date.now(),
});

</script>

<template>
  <el-row :gutter="20" class="split-main">
    not implement
  </el-row>
</template>

<style>
.fly-main .el-date-editor--time .el-input__wrapper {
  width: 100%;
}
@media only screen and (max-width: 768px) {
  .fly-main .xs-pandding {
    margin-top: 8px;
  }
}
.row-block {
  width: 100%;
}
</style>

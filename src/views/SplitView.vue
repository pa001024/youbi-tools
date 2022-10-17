<script setup lang="ts">
import { reactive, watch } from "vue";
import { Plus } from "@element-plus/icons";

const mission = reactive({
  start: "(0,0)",
});

const state = reactive({
  names: [] as string[],
  targets: [] as string[],
  now: Date.now(),
});

const page = reactive({
  nameInput: "",
  targetInput: "",
});

if (localStorage.getItem("split_state")) {
  try {
    const saved = JSON.parse(localStorage.getItem("split_state")!);
    Object.assign(state, saved);
  } finally {
  }
}

const ev = {
  addName() {
    const newNames = page.nameInput
      .split(" ")
      .filter((v) => !state.names.includes(v));
    if (newNames.length) {
      state.names.push(...newNames);
      ev.save();
    }
    page.nameInput = "";
  },
  addTarget() {
    const newTargets = page.targetInput
      .split(" ")
      .filter((v) => !state.targets.includes(v) && /\(-?\d+,-?\d+\)/.test(v));
    if (newTargets.length) {
      state.targets.push(...newTargets);
      ev.save();
    }
    page.targetInput = "";
  },
  save() {
    localStorage.setItem("split_state", JSON.stringify(state));
  },
};
</script>

<template>
  <el-row :gutter="20" class="split-main">
    <!-- 人员名单 -->
    <el-col :span="12" :xs="24">
      <el-form>
        <el-form-item label="人员">
          <div class="flex">
            <el-input
              v-model="page.nameInput"
              placeholder="输入名字 以空格分隔 如: A B"
            />
            <el-button @click="ev.addName" :icon="Plus"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-card class="names">
        <el-tag
          v-for="name of state.names"
          :key="name"
          class="mx-1"
          closable
          size="default"
        >
          {{ name }}
        </el-tag>
      </el-card>
    </el-col>
    <!-- 目标 -->
    <el-col :span="12" :xs="24">
      <el-form>
        <el-form-item label="目标">
          <div class="flex">
            <el-input
              v-model="page.targetInput"
              placeholder="输入坐标 以空格分隔 如: (1,3) (1,2)"
            />
            <el-button @click="ev.addTarget" :icon="Plus"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-card class="names">
        <el-tag
          v-for="target of state.targets"
          :key="target"
          closable
          size="default"
        >
          {{ target }}
        </el-tag>
      </el-card>
    </el-col>
    <!-- 分配结果 -->
    <el-col :span="24">
      <el-card>
        
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="less">
.split-main {
  .el-date-editor--time .el-input__wrapper {
    width: 100%;
  }
  .flex {
    display: flex;
    align-content: center;
    width: 100%;
    gap: 8px;
  }
  .names .el-card__body {
    display: flex;
    align-content: center;
    gap: 8px;
  }
}
@media only screen and (max-width: 768px) {
  .split-main .xs-pandding {
    margin-top: 8px;
  }
}
</style>

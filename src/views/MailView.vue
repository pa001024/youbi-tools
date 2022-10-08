<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { reactive, watch } from "vue";
import "../assets/bg.png";

const state = reactive({
  text: localStorage.getItem("text"),
  history: [],
});

const attackInfo = reactive({
  target: "",
  level: 5,
  coordinate: "",
  time: "10月8日 22:00",
  info: "蓝线集结，跟指令围城。",
});
const levelView = computed(
  () =>
    ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"][attackInfo.level]
);

const attackView = computed(() => {
  return `#c2192FF主要目标: #W ${attackInfo.coordinate} ${levelView.value}${attackInfo.target}#r
#c38E54D计划时间: #c9CFF2E10月8日 22:00#r#cFDFF00
${attackInfo.info}`;
});

const onSubmit = () => {
  state.text = attackView.value;
};

watch(
  () => state.text,
  (v) => {
    localStorage.setItem("text", v!);
  }
);

const htmlView = computed(() => {
  let t = `<span>${state.text}</span>`;
  t = t.replace(/#r/g, "<br>");
  const VT: { [x: string]: string } = {
    B: "0000FF",
    D: "FFD700",
    E: "FFD700",
    G: "00FF00",
    K: "000000",
    O: "FFA500",
    P: "FFC0CB",
    R: "FF0000",
    U: "800080",
    W: "FFFFFF",
    Y: "FFFF00",
  };
  t = t.replace(
    /#([BDEKOPRUWY])/g,
    (_, v) => `</span><span style="color:#${VT[v]}">`
  );
  t = t.replace(
    /#c([A-Z0-9]{6})/g,
    (_, v) => `</span><span style="color:#${v}">`
  );
  t = t.replace(/##/g, "#");
  return t;
});
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form :inline="true" :model="attackInfo" class="demo-form-inline">
        <el-form-item label="目标">
          <el-input v-model="attackInfo.target" placeholder="杜汉" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="attackInfo.level">
            <el-option label="2" :value="2" />
            <el-option label="3" :value="3" />
            <el-option label="5" :value="5" />
            <el-option label="7" :value="7" />
            <el-option label="10" :value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="坐标">
          <el-input v-model="attackInfo.coordinate" placeholder="(0,0)" />
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="attackInfo.time" placeholder="..." />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="attackInfo.info" placeholder="..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">生成打城</el-button>
        </el-form-item>
      </el-form>
      <el-input
        v-model="state.text"
        autosize
        :rows="3"
        type="textarea"
        placeholder="请输入邮件内容"
        class="trans-input"
      />
    </el-col>
    <el-col :span="12">
      <el-card class="trans-bg">
        <div id="mail-preview" v-html="htmlView"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style>
#mail-preview {
  background: url("/assets/bg.png");
}
.trans-input .el-textarea__inner {
  background: none;
  color: #f3f3f3;
  font-size: 14px;
}
.trans-bg {
  background-color: #293039;
  color: #f3f3f3;
  font-size: 14px;
}
</style>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { reactive, watch } from "vue";
import ClipboardJS from "clipboard";
import { CopyDocument } from "@element-plus/icons";
import moment from "moment";

const state = reactive({
  mode: "攻城",
  text: "",
});

const attackInfo = reactive({
  target: "天空奥尔赛",
  reason: "防守",
  level: 5,
  coordinate: "(233,233)",
  time: moment(Math.ceil(Date.now() / (60 * 60 * 1e3)) * 60 * 60 * 1e3).format(
    "M月D日 HH:mm"
  ),
  info: "蓝线集结，跟指令围城。",
});

if (localStorage.getItem("mail_state")) {
  try {
    const saved = JSON.parse(localStorage.getItem("mail_state")!);
    Object.assign(state, saved);
  } finally {
  }
}
if (localStorage.getItem("mail_attack_info")) {
  try {
    const saved = JSON.parse(localStorage.getItem("mail_attack_info")!);
    Object.assign(attackInfo, saved);
  } finally {
  }
}

const onSubmit = () => {
  switch (state.mode) {
    case "攻城":
      const lv = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"][
        attackInfo.level
      ];
      state.text = `#c2192FF主要目标: #W${attackInfo.coordinate} ${lv}${attackInfo.target}#r
#c38E54D计划时间: #c9CFF2E${attackInfo.time}#r#cFDFF00
${attackInfo.info}`;
      break;
    case "集结":
      state.text = `#cD9F8C4集结点: #W${attackInfo.coordinate}#r
#cF9F9C5目的: #c9CFF2E${attackInfo.reason}#r
#cFAD9A1到位时间: #c9CFF2E${attackInfo.time}#r#cF37878
${attackInfo.info}`;
      break;
  }
};

watch(
  () => state,
  (v) => {
    localStorage.setItem("mail_state", JSON.stringify(v));
  }
);

watch(attackInfo, (v) => {
  localStorage.setItem("mail_attack_info", JSON.stringify(v));
});

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

new ClipboardJS("#copy-btn");
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :xs="24" class="attack-info">
      <el-form>
        <el-form-item label="模板">
          <el-select v-model="state.mode" @change="onSubmit">
            <el-option value="攻城"></el-option>
            <el-option value="集结"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="attackInfo">
        <el-form-item label="目标" v-if="state.mode === '攻城'">
          <el-input
            v-model="attackInfo.target"
            placeholder="杜汉"
            @input="onSubmit"
          />
        </el-form-item>
        <el-form-item label="目的" v-if="state.mode === '集结'">
          <el-input
            v-model="attackInfo.reason"
            placeholder="防守"
            @input="onSubmit"
          />
        </el-form-item>
        <el-form-item label="等级" v-if="state.mode === '攻城'">
          <el-select v-model="attackInfo.level" @change="onSubmit">
            <el-option label="2" :value="2" />
            <el-option label="3" :value="3" />
            <el-option label="5" :value="5" />
            <el-option label="7" :value="7" />
            <el-option label="10" :value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="坐标">
          <el-input
            v-model="attackInfo.coordinate"
            placeholder="(0,0)"
            @input="onSubmit"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-input
            v-model="attackInfo.time"
            placeholder="..."
            @change="onSubmit"
          />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="attackInfo.info"
            placeholder="..."
            @change="onSubmit"
          />
        </el-form-item>
      </el-form>
      <el-input
        v-model="state.text"
        autosize
        placeholder="请输入邮件内容"
        class="trans-input"
        id="copy-text"
      >
        <template #append>
          <el-button
            id="copy-btn"
            type="primary"
            data-clipboard-target="#copy-text"
            :icon="CopyDocument"
          ></el-button>
        </template>
      </el-input>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-card class="trans-bg">
        <div id="mail-preview" v-html="htmlView"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style>
.trans-input .el-textarea__inner {
  font-size: 14px;
}
@media (prefers-color-scheme: dark) {
  .trans-input .el-textarea__inner {
    background: none;
    color: #f3f3f3;
  }
}
.trans-bg {
  background: url("../assets/bg.png");
  background-color: #293039;
  color: #f3f3f3;
  font-size: 14px;
}
.attack-info {
  margin-bottom: 16px;
}
.attack-info .el-select .el-input {
  width: 160px;
}
</style>

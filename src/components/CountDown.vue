<script setup lang="ts">
defineProps<{
  title: string;
  label: string;
  speed: string;
}>();
</script>
<template>
  <div class="count-down">
    <div class="title">{{ title }}</div>
    <div class="label">{{ label }}</div>
    <div class="speed">{{ speed }}速</div>
    <div class="time">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.count-down {
  width: 300px;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  padding: 20px;
  display: inline-block;
  margin: 8px 4px;
  position: relative;
}
.count-down .title {
}
.count-down .label {
}
.count-down .speed {
  position: absolute;
  right: 20px;
  top: 12px;
  color: #222;
  font-weight: bold;
  font-size: 18px;
}
.count-down .time {
  font-weight: bold;
  font-size: 24px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  color: #222;
}

@media (prefers-color-scheme: dark) {
  .count-down .time,
  .count-down .speed {
    color: #ddd;
  }
}
</style>

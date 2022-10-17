<script setup lang="ts">
import type { ShipEx } from "@/util/infLag";

defineProps<{ ship: ShipEx }>();
const emit = defineEmits(["add"]);
</script>
<template>
  <el-dropdown
    class="ship"
    split-button
    @click="emit('add', ship)"
    v-if="ship.subTypes"
  >
    {{ ship.name }}
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="emit('add', ship)">
          {{ ship.key }}
        </el-dropdown-item>
        <el-dropdown-item
          v-for="ex of ship.subTypes"
          :key="ex.key"
          @click="emit('add', ex)"
        >
          {{ ex.key }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <div class="el-dropdown ship" v-else>
    <el-button @click="emit('add', ship)">
      {{ ship.name }}
    </el-button>
  </div>
</template>
<style lang="less">
.ship {
  padding: 4px 8px;
  .name {
    color: var(--color-highlight);
  }
}
</style>

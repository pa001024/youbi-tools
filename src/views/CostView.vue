<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { ShipsData, type ShipGroup, type ShipEx } from "@/util/infLag";
import { base62, debase62 } from "@/util/util";
import ShipSelect from "../components/ShipSelect.vue";
import { Minus } from "@element-plus/icons";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const types = [
  "护卫舰",
  "驱逐舰",
  "巡洋舰",
  "战列巡洋舰",
  "航母",
  "战斗机",
  "护航艇",
  "工程舰",
];

const sortedShips: { [x: string]: ShipEx } = {};

for (const ship of ShipsData) {
  if (ship.name in sortedShips) {
    if ("subTypes" in sortedShips[ship.name]) {
      sortedShips[ship.name].subTypes!.push(ship);
    } else {
      sortedShips[ship.name].subTypes = [ship];
    }
  } else {
    sortedShips[ship.name] = { ...ship };
  }
}

const shipList = Object.keys(sortedShips).map((v) => sortedShips[v]);

const page = reactive({
  shipType: "全部",
});

const state = reactive({
  ships: [] as ShipGroup[],
});

if (route.params.info) {
  const str = route.params.info as string;
  const p: ShipGroup[] = [];
  for (let i = 0; i < str.length; i += 3) {
    const info = str.substr(i, 3);
    const ship = ShipsData.find((v) => v.k === info.substr(0, 2));
    if (ship) {
      p.push({
        ship,
        count: debase62(info.slice(2, 3)),
      } as ShipGroup);
    }
  }
  state.ships = p;
}

watch(state, () => {
  router.push({
    name: "costWithInfo",
    params: {
      info: state.ships.map((v) => v.ship.k + base62(v.count)).join(""),
    },
  });
});

const ev = {
  addShip(ship: ShipEx) {
    if (state.ships.every((v) => v.ship.key !== ship.key)) {
      state.ships.push({ ship, count: 1 });
    } else {
      const g: ShipGroup = state.ships.find((v) => v.ship.key === ship.key)!;
      if (g.count < (g.ship.limit || 0)) {
        g.count = g.count + 1;
      }
    }
  },
  removeShip(index: number) {
    state.ships.splice(index, 1);
    console.log(JSON.stringify(state.ships));
  },
};

const res = computed(() => {
  return {
    metal: state.ships.reduce((a, b) => a + (b.ship.metal || 0) * b.count, 0),
    crystal: state.ships.reduce(
      (a, b) => a + (b.ship.crystal || 0) * b.count,
      0
    ),
    hydro: state.ships.reduce((a, b) => a + (b.ship.hydro || 0) * b.count, 0),
    rp: state.ships.reduce((a, b) => a + (b.ship.rp || 0) * b.count, 0),
  };
});
</script>

<template>
  <el-row :gutter="20" class="cost-main">
    <el-col :span="12" :xs="24">
      <el-card class="status-card">
        <el-form inline>
          <el-form-item label="金属">
            {{ res.metal }}
          </el-form-item>
          <el-form-item label="晶体">
            {{ res.crystal }}
          </el-form-item>
          <el-form-item label="重氢">
            {{ res.hydro }}
          </el-form-item>
          <el-form-item label="指挥值">
            {{ res.rp }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card
        class="ship-card"
        v-for="(group, index) of state.ships"
        :key="group.ship.key"
      >
        <el-form :model="group" inline>
          <el-form-item :label="group.ship.key">
            <el-button @click="ev.removeShip(index)" :icon="Minus">
              移除
            </el-button>
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number
              style="margin-right: 8px"
              v-model="group.count"
              :min="1"
              :max="group.ship.limit || 8"
            />
            <el-button @click="group.count = group.ship.limit || 1">
              max
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-tabs v-model="page.shipType">
        <el-tab-pane label="全部" name="全部">
          <ShipSelect v-for="ship of shipList" :ship="ship" @add="ev.addShip" />
        </el-tab-pane>
        <el-tab-pane v-for="ty of types" :key="ty" :label="ty" :name="ty">
          <ShipSelect
            v-for="ship of shipList.filter((v) => v.type === ty)"
            :ship="ship"
            @add="ev.addShip"
          />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<style lang="less">
.cost-main {
  .el-card__body {
    padding: 14px 8px 0 8px;
  }
  .el-form-item--small {
    margin-bottom: 14px;
  }
  .status-card {
    margin-bottom: 8px;
  }
  .ship-card {
    margin-bottom: 8px;
  }
}
@media only screen and (max-width: 768px) {
}
</style>

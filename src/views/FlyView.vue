<script setup lang="ts">
import { reactive, watch } from "vue";
import moment from "moment";
import { Plus, Minus } from "@element-plus/icons";
import { useRoute, useRouter } from "vue-router";
import { calcTime, Coord, toDiffTime, Vector, type Fleet } from "@/util/vector";

const route = useRoute();
const router = useRouter();

const attackInfo = reactive({
  start: "(0,0)",
  target: "(100,100)",
  timeMode: 1,
  time: Date.now(),
  baseSpeed: 1250,
});

const state = reactive({
  outpost: "(115,115)",
  outpostBorder: "(110,110)",
  distance: 15,
  postMode: 2,
  fleets: [] as Fleet[],
  now: Date.now(),
  expendCoord: false,
  lessMode: true,
});

if (route.params.info) {
  const p = JSON.parse(atob(route.params.info as string));
  Object.assign(attackInfo, p);
}

watch([attackInfo], () => {
  router.push({
    name: "flyWithInfo",
    params: {
      info: btoa(JSON.stringify(attackInfo)),
    },
  });
});

const saveFleets = () => {
  localStorage.setItem("fly_fleets", JSON.stringify(state.fleets));
};
const addFleet = () => {
  const speeds = [1250, 2000, 2500, 3250];
  state.fleets.push({
    start: "",
    target: "",
    speed: speeds[state.fleets.length] || 1250,
  });
  saveFleets();
};
const removeFleet = (index: number) => {
  state.fleets.splice(index, 1);
  saveFleets();
};

if (localStorage.getItem("fly_fleets")) {
  state.fleets = JSON.parse(localStorage.getItem("fly_fleets")!);
}

const toTime = (t: number) => {
  return moment(
    attackInfo.timeMode === 1
      ? attackInfo.time - t * 1e3
      : attackInfo.time + t * 1e3
  ).format("HH:mm:ss");
};

const toCountdown = (t: number) => {
  const c =
    attackInfo.timeMode === 1
      ? attackInfo.time / 1e3 - t - state.now / 1e3
      : attackInfo.time / 1e3 + t - state.now / 1e3;
  if (c < 0) return "已出发";
  const h = ~~(c / 3600) ? `${~~(c / 3600)}时` : "";
  const m = ~~((c / 60) % 60) ? `${~~((c / 60) % 60)}分` : "";
  return `${h}${m}${~~(c % 60)}秒`;
};

/// evevt
const ev = {
  distanceChange: () => {
    const s = new Coord(attackInfo.start);
    const e = new Coord(attackInfo.target);
    const vector = e.minus(s).add(state.distance * 10);
    state.outpost = s
      .add(vector)
      .round(10)
      .add(new Vector(vector.x > 0 ? 5 : -5, vector.y > 0 ? 5 : -5))
      .toString();
    state.outpostBorder = s.add(vector).round(10).toString();
  },
  countDown: setInterval(() => {
    state.now = Date.now();
  }, 1e3),
};

ev.distanceChange();
</script>

<template>
  <el-row :gutter="20" class="fly-main">
    <el-col :span="12" :xs="24" class="attack-info">
      <el-form :model="attackInfo">
        <el-form-item label="起点坐标">
          <el-input
            v-model="attackInfo.start"
            placeholder="(0,0)"
            @input="ev.distanceChange"
          />
        </el-form-item>
        <el-form-item label="目标坐标">
          <el-input
            v-model="attackInfo.target"
            placeholder="(0,0)"
            @input="ev.distanceChange"
          />
        </el-form-item>
        <el-form-item label="前哨模式">
          <el-radio v-model="state.postMode" :label="1">坐标</el-radio>
          <el-radio v-model="state.postMode" :label="2">距离</el-radio>
        </el-form-item>
        <el-form-item label="前哨距离" v-if="state.postMode === 2">
          <el-input
            v-model="state.distance"
            placeholder="15"
            @input="ev.distanceChange"
          />
        </el-form-item>
        <el-form-item label="前哨坐标">
          <el-input
            :disabled="state.postMode === 2"
            v-model="state.outpost"
            placeholder="(0,0)"
          />
        </el-form-item>
        <!-- <el-form-item label="越点坐标">
          <el-input
            disabled
            v-model="state.outpostBorder"
            placeholder="(0,0)"
          />
        </el-form-item> -->
        <el-form-item label="时间模式">
          <el-radio v-model="attackInfo.timeMode" :label="1">落地时间</el-radio>
          <el-radio v-model="attackInfo.timeMode" :label="2">起飞时间</el-radio>
        </el-form-item>
        <el-form-item
          :label="attackInfo.timeMode === 1 ? '落地时间' : '起飞时间'"
        >
          <el-time-picker
            v-model="attackInfo.time"
            @change="attackInfo.time -= 0"
            style="margin-right: 8px"
          />
          <el-button-group>
            <el-button @click="attackInfo.time = state.now"> now </el-button>
            <el-button @click="attackInfo.time += 10 * 60e3"> +10m </el-button>
            <el-button @click="attackInfo.time += 60 * 60e3"> +1h </el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item label="最慢速度" v-if="attackInfo.timeMode !== 1">
          <el-input v-model="attackInfo.baseSpeed" placeholder="1250" />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12" :xs="24" class="fleet-info">
      <el-form inline>
        <el-form-item label="坐标修正">
          <el-switch v-model="state.expendCoord"></el-switch>
        </el-form-item>
        <el-form-item label="精简模式">
          <el-switch v-model="state.lessMode"></el-switch>
        </el-form-item>
      </el-form>
      <el-card
        v-for="(fleet, index) of state.fleets"
        :key="index"
        style="margin-bottom: 8px"
      >
        <el-form :model="fleet" inline>
          <el-form-item :label="`#${index + 1}`">
            <el-button @click="removeFleet(index)" :icon="Minus">
              移除
            </el-button>
          </el-form-item>
          <el-form-item label="起点坐标" v-if="state.expendCoord">
            <el-input v-model="fleet.start" :placeholder="attackInfo.start" />
          </el-form-item>
          <el-form-item label="目标坐标" v-if="state.expendCoord">
            <el-input v-model="fleet.target" :placeholder="attackInfo.target" />
          </el-form-item>
          <el-form-item label="曲率速度">
            <el-input
              v-model="fleet.speed"
              placeholder="1250"
              @change="saveFleets"
            />
          </el-form-item>
          <el-form-item label="飞行时间" v-if="!state.lessMode">
            {{
              toDiffTime(
                calcTime(
                  fleet.start || attackInfo.start,
                  fleet.target || attackInfo.target,
                  +fleet.speed
                )
              )
            }}
          </el-form-item>
          <el-form-item label="起飞时间" v-if="!state.lessMode">
            {{
              toTime(
                calcTime(
                  fleet.start || attackInfo.start,
                  fleet.target || attackInfo.target,
                  +fleet.speed
                )
              )
            }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-button @click="addFleet" :icon="Plus">增加舰队</el-button>
    </el-col>
    <el-col :span="24">
      <CountDown
        v-for="(fleet, index) of state.fleets"
        :key="index"
        :title="`#${index + 1}号舰队`"
        :speed="fleet.speed"
        :label="`离 ${toTime(
          calcTime(
            fleet.start || attackInfo.start,
            fleet.target || attackInfo.target,
            +fleet.speed
          )
        )} 起飞还有`"
      >
        {{
          toCountdown(
            calcTime(
              fleet.start || attackInfo.start,
              fleet.target || attackInfo.target,
              +fleet.speed
            )
          )
        }}
      </CountDown>
    </el-col>
  </el-row>
</template>

<style lang="less">
.fly-main {
  .el-date-editor--time .el-input__wrapper {
    width: 100%;
  }
  .el-card__body {
    padding: 14px 8px 0 8px;
  }
  .el-form-item--small {
    margin-bottom: 14px;
  }
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

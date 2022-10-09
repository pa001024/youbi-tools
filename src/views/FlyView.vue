<script setup lang="ts">
import { reactive, watch } from "vue";
import moment from "moment";
import { Plus, Minus } from "@element-plus/icons";
import { useRoute, useRouter } from "vue-router";

interface Fleet {
  start: string;
  target: string;
  speed: number;
}

class Coord {
  x: number;
  y: number;
  constructor(x: string);
  constructor(x: number, y: number);
  constructor(x: string | number, y = 0) {
    if (typeof x === "string") {
      const m = x.match(/\((-?\d+),(-?\d+)\)/);
      this.x = m ? +m[1] : 0;
      this.y = m ? +m[2] : 0;
    } else {
      this.x = x;
      this.y = y;
    }
  }
  distance(target: Coord) {
    return Math.sqrt(
      Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)
    );
  }
  add(v: Vector) {
    return new Coord(this.x + v.x, this.y + v.y);
  }
  minus(start: Coord) {
    return new Vector(this.x - start.x, this.y - start.y);
  }
  round(num: number) {
    return new Coord(
      Math.round(this.x / num) * num,
      Math.round(this.y / num) * num
    );
  }
  toString() {
    return `(${this.x},${this.y})`;
  }
}

class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(d: number) {
    const c = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    const x = this.x + (d / c) * this.x;
    const y = this.y + (d / c) * this.y;
    return new Vector(x, y);
  }
  toString() {
    return `(${this.x},${this.y})`;
  }
}

const route = useRoute();
const router = useRouter();

const attackInfo = reactive({
  start: "(0,0)",
  target: "(100,100)",
  timeMode: 1,
  endTime: Date.now(),
  startTime: Date.now(),
});

const state = reactive({
  outpost: "(115,115)",
  outpostBorder: "(110,110)",
  distance: 15,
  postMode: 2,
  fleets: [] as Fleet[],
  now: Date.now(),
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

const addFleet = () => {
  const speeds = [1250, 2000, 2500, 3250];
  state.fleets.push({
    start: "",
    target: "",
    speed: speeds[state.fleets.length] || 1250,
  });
};
const removeFleet = (index: number) => {
  state.fleets.splice(index, 1);
};

const calcTime = (start: string, end: string, speed: number) => {
  const s = new Coord(start);
  const e = new Coord(end);
  const d = s.distance(e);
  const t = ~~(1e4 * d) / speed;
  return t;
};

const toDiffTime = (t: number) => {
  if (t < 0) return "无法到达";
  const h = ~~(t / 3600) ? `${~~(t / 3600)}时` : "";
  const m = ~~((t / 60) % 60) ? `${~~((t / 60) % 60)}分` : "";
  return `${h}${m}${~~(t % 60)}秒`;
};

const toTime = (t: number) => {
  return moment(
    attackInfo.timeMode === 1
      ? attackInfo.endTime - t * 1e3
      : attackInfo.startTime + t * 1e3
  ).format("HH:mm:ss");
};

const toCountdown = (t: number) => {
  const c =
    attackInfo.timeMode === 1
      ? attackInfo.endTime / 1e3 - t - state.now / 1e3
      : attackInfo.startTime / 1e3 + t - state.now / 1e3;
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
    const vector = e.minus(s).add(state.distance);
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
        <el-form-item label="落地时间" v-if="attackInfo.timeMode === 1">
          <el-time-picker
            v-model="attackInfo.endTime"
            @change="attackInfo.endTime -= 0"
            style="margin-right: 8px"
          />
          <el-button-group>
            <el-button @click="attackInfo.endTime = state.now"> now </el-button>
            <el-button @click="attackInfo.endTime += 10 * 60e3">
              +10m
            </el-button>
            <el-button @click="attackInfo.endTime += 60 * 60e3">
              +1h
            </el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item label="起飞时间" v-if="attackInfo.timeMode !== 1">
          <el-time-picker
            :disabled="attackInfo.timeMode !== 2"
            v-model="attackInfo.startTime"
            @change="attackInfo.startTime -= 0"
            style="margin-right: 8px"
          />
          <el-button-group>
            <el-button @click="attackInfo.startTime = state.now">
              now
            </el-button>
            <el-button @click="attackInfo.startTime += 10 * 60e3">
              +10m
            </el-button>
            <el-button @click="attackInfo.startTime += 60 * 60e3">
              +1h
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12" :xs="24" class="fleet-info">
      <el-form
        v-for="(fleet, index) of state.fleets"
        :key="index"
        :model="fleet"
      >
        <el-form-item :label="`#${index + 1}`">
          <el-button @click="removeFleet(index)" :icon="Minus">移除</el-button>
        </el-form-item>
        <el-form-item label="起点坐标">
          <el-input v-model="fleet.start" :placeholder="attackInfo.start" />
        </el-form-item>
        <el-form-item label="目标坐标">
          <el-input v-model="fleet.target" :placeholder="attackInfo.target" />
        </el-form-item>
        <el-form-item label="曲率速度">
          <el-input v-model="fleet.speed" placeholder="1250" />
        </el-form-item>
        <el-form-item label="飞行时间">
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
        <el-form-item label="起飞时间">
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

export interface Ship {
  k: string;
  /** 键 */ key: string;
  /** 名称 */ name: string;
  /** 舰船分类 */ type?: string;
  /** 类型 */ subType?: string;
  /** 所属 */ company?: string;
  /** 舰船介绍 */ desc?: string;
  /** 舰船定位 */ position?: string;
  /** 名人名言 */ quote?: string;
  /** 故事 */ story?: string;
  /** 对舰能力 */ atkLevel?: string;
  /** 支援能力 */ assLevel?: string;
  /** 防空能力 */ airLevel?: string;
  /** 生存能力 */ defLevel?: string;
  /** 攻城能力 */ sigLevel?: string;
  /** 战略能力 */ strLevel?: string;
  /** 金属 */ metal?: number;
  /** 晶体 */ crystal?: number;
  /** 重氢 */ hydro?: number;
  /** 建造时间 */ buildTime?: number;
  /** 指挥值 */ rp?: number;
  /** 服役上限 */ limit?: number;
  /** 对舰火力 */ atk?: number;
  /** 对空火力 */ air?: number;
  /** 攻城火力 */ aig?: number;
  /** 耐久 */ durable?: number;
  /** 抵抗能力 */ res?: number;
  /** 仓储容量 */ cap?: number;
  /** 巡航速度 */ speed?: number;
  /** 曲率速度 */ curSpeed?: number;
}
export interface ShipEx extends Ship {
  subTypes?: Ship[];
}

export interface ShipGroup {
  ship: Ship;
  count: number;
}

import data from "./infLag.data.json";

export const ShipsData = data.ships as Ship[];

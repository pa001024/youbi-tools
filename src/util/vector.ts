import moment from "moment";

export interface Fleet {
  start: string;
  target: string;
  speed: number;
}

export class Coord {
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

export class Vector {
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

export const calcTime = (start: string, end: string, speed: number) => {
  const s = new Coord(start);
  const e = new Coord(end);
  const d = s.distance(e);
  const t = ~~(1e4 * d) / speed;
  return t;
};

export const toDiffTime = (t: number) => {
  if (t < 0) return "无法到达";
  const h = ~~(t / 3600) ? `${~~(t / 3600)}时` : "";
  const m = ~~((t / 60) % 60) ? `${~~((t / 60) % 60)}分` : "";
  return `${h}${m}${~~(t % 60)}秒`;
};

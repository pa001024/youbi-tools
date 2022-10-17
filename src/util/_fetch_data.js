const axios = require("axios");
const fs = require("fs-extra");

const getPage = async (name) => {
  const url = `https://wiki.biligame.com/wjdlglr/${name}?action=raw`;
  const { data } = await axios.get(url);
  return data;
};

const pageMap = {
  名称: "name",
  舰船分类: "type",
  类型: "subType",
  所属: "company",
  舰船介绍: "desc",
  舰船定位: "position",
  名人名言: "quote",
  故事: "story",
  对舰能力: "atkLevel",
  支援能力: "assLevel",
  防空能力: "airLevel",
  生存能力: "defLevel",
  攻城能力: "sigLevel",
  战略能力: "strLevel",
};

const pageMapNum = {
  金属: "metal",
  晶体: "crystal",
  重氢: "hydro",
  建造时间: "buildTime",
  指挥值: "rp",
  服役上限: "limit",
  对舰火力: "atk",
  对空火力: "air",
  攻城火力: "aig",
  耐久: "durable",
  抵抗能力: "res",
  仓储容量: "cap",
  巡航速度: "speed",
  曲率速度: "curSpeed",
};

const main = async () => {
  const {
    data: {
      query: { categorymembers },
    },
  } = await axios.get(
    "https://wiki.biligame.com/wjdlglr/api.php?action=query&format=json&formatversion=2&list=categorymembers&cmtitle=Category:%E8%88%B0%E8%88%B9&cmlimit=500"
  );

  let ships = [];
  for (let i = 0; i < categorymembers.length; i++) {
    const { title } = categorymembers[i];
    if (title === "模板:舰船信息") continue;
    const page = await getPage(title);
    let ship = { key: title };
    page.replace(/^\|(.+?)=(.+)/gm, (_, key, value) => {
      if (key in pageMap) {
        ship[pageMap[key]] = value;
      }
      if (key in pageMapNum) {
        ship[pageMapNum[key]] = parseInt(value) || value;
      }
    });
    ships.push(ship);
    console.log(`[ship] ${title}`);
  }

  const result = {
    ships,
    types: [...new Set(ships.map((v) => v.type))],
  };

  await fs.outputFile("infLag.data.json", JSON.stringify(result));
};

main();

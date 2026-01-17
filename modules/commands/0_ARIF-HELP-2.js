module.exports.config = {
  name: "help2",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Image based help (ALL commands, Y-Style Box)",
  usePrefix: true,
  commandCategory: "BOT-COMMAND-LIST",
  usages: "[category]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const fs = require("fs-extra");
  const { createCanvas } = require("canvas");

  /* ================= CACHE ================= */
  const cacheDir = __dirname + "/cache";
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  /* ================= CATEGORY MAP (NO FILTER) ================= */
  const categories = {};
  for (const [name, cmd] of commands) {
    let cate = cmd.config.commandCategory;

    if (!cate || typeof cate !== "string") cate = "OTHER";
    cate = cate.toUpperCase();

    if (!categories[cate]) categories[cate] = [];
    categories[cate].push(name);
  }

  /* ================= CANVAS ================= */
  const width = 900;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // BACKGROUND
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  /* ================= HEADER BOX ================= */
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 20, 840, 120);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "bold 30px Arial";
  ctx.fillText("📜 HELP2 – ALL COMMAND LIST", 220, 70);

  ctx.font = "22px Arial";
  ctx.fillText(`Prefix: ${prefix}`, 60, 115);

  /* ================= MAIN BOX ================= */
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 160, 840, 760);

  let y = 210;

  /* ================= SINGLE CATEGORY ================= */
  if (args[0]) {
    const cateName = args.join(" ").toUpperCase();
    const findCate = Object.keys(categories).find(c => c === cateName);

    if (!findCate) {
      return api.sendMessage(
        `❌ Category "${args.join(" ")}" nahi mili!\nUse: ${prefix}help2i`,
        threadID,
        messageID
      );
    }

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 30px Arial";
    ctx.fillText(`┏━━ CATEGORY: ${findCate} ━━┓`, 60, y);
    y += 50;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "24px Arial";

    for (const cmd of categories[findCate]) {
      ctx.fillText(`• ${prefix}${cmd}`, 80, y);
      y += 34;
      if (y >= height - 120) break;
    }

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 26px Arial";
    ctx.fillText("┗━━━━━━━━━━━━━━━━━━━━━━┛", 60, y + 20);
  }

  /* ================= ALL CATEGORIES ================= */
  else {
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 30px Arial";
    ctx.fillText("┏━━ CATEGORIES ━━┓", 60, y);
    y += 50;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "26px Arial";

    for (const cate of Object.keys(categories)) {
      ctx.fillText(
        `• ${cate} (${categories[cate].length})`,
        80,
        y
      );
      y += 38;
      if (y >= height - 140) break;
    }

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 26px Arial";
    ctx.fillText("┗━━━━━━━━━━━━━━━━━━━━━━┛", 60, y + 10);

    ctx.fillStyle = "#e5e7eb";
    ctx.font = "22px Arial";
    ctx.fillText(
      `Use: ${prefix}help2i <category>`,
      80,
      y + 50
    );
  }

  /* ================= FOOTER ================= */
  ctx.fillStyle = "#a855f7";
  ctx.font = "20px Arial";
  ctx.fillText(
    "BOT BY MR ARIF BABU 💜",
    300,
    height - 30
  );

  /* ================= SAVE & SEND ================= */
  const path = cacheDir + "/help2.png";
  fs.writeFileSync(path, canvas.toBuffer());

  return api.sendMessage(
    { attachment: fs.createReadStream(path) },
    threadID,
    () => fs.unlinkSync(path),
    messageID
  );
};
const os = require("os");

global.client.timeStart = global.client.timeStart || Date.now();

module.exports.config = {
  name: "upt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Bot uptime & system status",
  commandCategory: "system",
  usages: "upt",
  cooldowns: 5
};

// 🧠 UPTIME FORMAT
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// 📤 SEND UPTIME
async function sendUptime(api, event) {
  const { threadID, messageID } = event;

  const now = new Date();
  const uptime = formatUptime(process.uptime());

  // 🇵🇰 TIME
  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const date = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // 💾 RAM
  const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const usedRAM = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);

  const botName = global.config.BOTNAME || "ARIF BABU BOT";

  const msg =
`╭────〔 UPTIME 〕────╮
│ 🤖 Bot Name : ${botName}
│ ⏳ Uptime   : ${uptime}
╰─────────────────╯

╭────〔 SYSTEM 〕────╮
│ 📅 Date    : ${date}
│ ⏰ Time    : ${time}
│ 💾 RAM     : ${usedRAM}GB / ${totalRAM}GB
│ ⚡ Status  : Running Smoothly
╰─────────────────╯

✅ Powered By ⟶͇̽𝘼𝙆𝘼𝙎𝙃-𝙅𝙐𝙏𝙏⎯꯭̽`;

  return api.sendMessage(msg, threadID, messageID);
}

// 🔹 NO PREFIX
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  if (event.body.trim().toLowerCase() === "ꜛ") {
    return sendUptime(api, event);
  }
};

// 🔹 PREFIX
module.exports.run = async ({ api, event }) => {
  return sendUptime(api, event);
};

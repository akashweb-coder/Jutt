const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "help2",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Shows bot commands page 2",
  usePrefix: true,
  commandCategory: "BOT-COMMAND-LIST",
  usages: "help2",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  const prefix = global.config.PREFIX;

  /* 🖼️ IMGUR LINKS */
  const imgurLinks = [
    "https://i.imgur.com/i1BgQhz.png",
    "https://i.imgur.com/iTskEvb.png",
    "https://i.imgur.com/AJkpAle.png",
    "https://i.imgur.com/i7Ngm0f.png",
    "https://i.imgur.com/gyxhVCh.png",
    "https://i.imgur.com/nLh8oLe.png"
  ];

  const randomImg = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
  const imgPath = path.join(__dirname, "cache", "help2.png");

  // download image
  await axios({
    url: randomImg,
    method: "GET",
    responseType: "stream"
  }).then(res => {
    res.data.pipe(fs.createWriteStream(imgPath));
  });

  const page2Commands = [
    "𒁍 kick → Remove member (Admin)",
    "𒁍 ban → Ban member (Admin)",
    "𒁍 setprefix → Change bot prefix",
    "𒁍 clear → Clear messages",
    "𒁍 mute → Mute member (Admin)",
    "𒁍 unmute → Unmute member (Admin)",
    "𒁍 warn → Warn member",
    "𒁍 delwarn → Remove warning"
  ];

  let msg = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
  msg += `┃ ✧═══❁ ♥️ ARIF-BABU BOT ♥️ ❁═══✧ ┃\n`;
  msg += `┃                            ┃\n`;
  msg += `┃ 𒁍 Help Page 2             ┃\n`;
  msg += `┃                            ┃\n`;

  page2Commands.forEach(cmd => {
    let line = cmd.length > 26 ? cmd.slice(0, 23) + "..." : cmd;
    msg += `┃ ${line.padEnd(26, " ")} ┃\n`;
  });

  msg += `┃                            ┃\n`;
  msg += `┃ Use "${prefix}help" for page 1 ┃\n`;
  msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━┛`;

  return api.sendMessage(
    {
      body: msg,
      attachment: fs.createReadStream(imgPath)
    },
    threadID,
    () => fs.unlinkSync(imgPath)
  );
};
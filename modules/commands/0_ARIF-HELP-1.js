module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Shows bot commands page 1",
  usePrefix: true,
  commandCategory: "BOT-COMMAND-LIST",
  usages: "help",
  cooldowns: 5,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 0
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const prefix = global.config.PREFIX;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  /* 🖼️ IMGUR LINKS for help.js */
  const imgurLinks = [
    "https://i.imgur.com/i1BgQhz.png",
        "https://i.imgur.com/iTskEvb.png",
        "https://i.imgur.com/AJkpAle.png",
        "https://i.imgur.com/i7Ngm0f.png",
        "https://i.imgur.com/gyxhVCh.png",
        "https://i.imgur.com/nLh8oLe.png",
    ];

  const randomImg = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];

  const page1Commands = [
    "𒁍 help → Show this page",
    "𒁍 ping → Check bot response",
    "𒁍 info → Bot info",
    "𒁍 dp → Profile DP commands"
  ];

  let msg = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
  msg += `┃ ✧═══❁ ♥️ ARIF-BABU BOT ♥️ ❁═══✧ ┃\n`;
  msg += `┃                            ┃\n`;
  msg += `┃ 𒁍 Help Page 1             ┃\n`;
  msg += `┃                            ┃\n`;

  page1Commands.forEach((cmd) => {
    let line = `${cmd}`;
    if (line.length > 26) line = line.slice(0, 23) + '...';
    msg += `┃ ${line.padEnd(26, ' ')} ┃\n`;
  });

  msg += `┃                            ┃\n`;
  msg += `┃ Use "${prefix}help [command]" for details ┃\n`;
  msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━┛`;

  const info = await api.sendMessage(
    { body: msg, attachment: await global.utils.getStreamFromURL(randomImg) },
    threadID
  );

  if (autoUnsend) setTimeout(() => api.unsendMessage(info.messageID), delayUnsend * 1000);
};
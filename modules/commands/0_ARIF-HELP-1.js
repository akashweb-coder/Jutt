module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Shows bot commands page by page",
  usePrefix: true,
  commandCategory: "BOT-COMMAND-LIST",
  usages: "help/help2",
  cooldowns: 5,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 0
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  const prefix = global.config.PREFIX;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  // Hard-coded pages (example: page 1 = help, page 2 = help2)
  const pages = {
    1: [
      "𒁍 help → Show this page",
      "𒁍 ping → Check bot response",
      "𒁍 info → Bot info",
      "𒁍 dp → Profile DP commands"
    ],
    2: [
      "𒁍 kick → Remove member (Admin)",
      "𒁍 ban → Ban member (Admin)",
      "𒁍 setprefix → Change bot prefix",
      "𒁍 clear → Clear messages"
    ]
  };

  // Determine which page to show
  let page = 1;
  if (this.config.name === "help2") page = 2;

  let msg = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
  msg += `┃ ✧═══❁ ♥️ ARIF-BABU BOT ♥️ ❁═══✧ ┃\n`;
  msg += `┃                            ┃\n`;
  msg += `┃ 𒁍 Help Page ${page}               ┃\n`;
  msg += `┃                            ┃\n`;

  pages[page].forEach((cmd, i) => {
    let line = `${cmd}`;
    msg += `┃ ${line.padEnd(26, ' ')} ┃\n`;
  });

  msg += `┃                            ┃\n`;
  msg += `┃ Use "${prefix}help [command]" for details ┃\n`;
  msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━┛`;

  const info = await api.sendMessage(msg, threadID);
  if (autoUnsend) setTimeout(() => api.unsendMessage(info.messageID), delayUnsend * 1000);
};
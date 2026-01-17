module.exports.config = {
  name: "help2",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "THIS BOT IS MR ARIF BABU",
  usePrefix: true,
  commandCategory: "system",
  usages: "[page | command name]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Cooldown: %5 second(s)\n❯ Permission: %6\n\n» Module by %7 «",
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Admin Bot"
  }
};

/* ================= HANDLE EVENT ================= */

module.exports.handleEvent = function ({ api, event, getText }) {
  const { body, threadID, messageID } = event;
  const { commands } = global.client;

  if (!body) return;
  if (!body.startsWith("help2 ")) return;

  const args = body.split(/\s+/);
  const cmdName = args[1]?.toLowerCase();
  if (!commands.has(cmdName)) return;

  const command = commands.get(cmdName);
  const prefix = global.config.PREFIX;

  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermssion == 0
        ? getText("user")
        : command.config.hasPermssion == 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

/* ================= RUN ================= */

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const config =
    global.configModule?.[this.config.name] || this.config.envConfig;
  const { autoUnsend, delayUnsend } = config;

  const prefix = global.config.PREFIX;

  const cmd = commands.get((args[0] || "").toLowerCase());
  if (cmd) {
    return api.sendMessage(
      getText(
        "moduleInfo",
        cmd.config.name,
        cmd.config.description,
        `${prefix}${cmd.config.name} ${cmd.config.usages || ""}`,
        cmd.config.commandCategory,
        cmd.config.cooldowns,
        cmd.config.hasPermssion == 0
          ? getText("user")
          : cmd.config.hasPermssion == 1
          ? getText("adminGroup")
          : getText("adminBot"),
        cmd.config.credits
      ),
      threadID,
      messageID
    );
  }

  /* ===== COMMAND LIST ===== */

  const page = parseInt(args[0]) || 1;
  const perPage = 20;

  const list = [...commands.keys()].sort();
  const maxPage = Math.ceil(list.length / perPage);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const slice = list.slice(start, end);

  let msg = `╭──────── ★ ────────╮
📄 FULL COMMAND LIST
╰──────── ★ ────────╯

┏━━━━━━━━━━━━━━━┓ 
`; 

  slice.forEach((name, index) => {
    msg += `𒁍 [${start + index + 1}] → ${prefix}${name}\n`;
  });

  msg +=
`
┗━━━━━━━━━━━━━━━┛

PAGE [ ${page}/${maxPage} ]
Type: ${prefix}help2 <command name>
BOT BY MR ARIF BABU 🙂✌️`;

  return api.sendMessage(msg, threadID, async (err, info) => {
    if (autoUnsend) {
      await new Promise(r => setTimeout(r, delayUnsend * 1000));
      api.unsendMessage(info.messageID);
    }
  }, messageID);
};
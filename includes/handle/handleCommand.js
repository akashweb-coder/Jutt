const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");
const moment = require("moment-timezone");
const logger = require("../../utils/log.js");
const axios = require("axios");

module.exports = function ({ api, models, Users, Threads, Currencies }) {

  // ===== VIP helpers =====
  const vipFilePath = path.join(__dirname, "../../modules/commands/rx/vip.json");
  const vipModePath = path.join(__dirname, "../../modules/commands/rx/vipMode.json");

  const loadVIP = () => {
    if (!fs.existsSync(vipFilePath)) return [];
    return JSON.parse(fs.readFileSync(vipFilePath, "utf-8"));
  };

  const loadVIPMode = () => {
    if (!fs.existsSync(vipModePath)) return false;
    const parsed = JSON.parse(fs.readFileSync(vipModePath, "utf-8"));
    return parsed.vipMode || false;
  };
  // ===== End VIP helpers =====

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
    const { PREFIX, ADMINBOT, NDH, DeveloperMode } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData } = global.data;
    const { commands } = global.client;

    let { body, senderID, threadID, messageID } = event;
    senderID = String(senderID);
    threadID = String(threadID);
    body = body || "";

    const threadSetting = threadData.get(threadID) || {};
    const threadPrefix = threadSetting.PREFIX || PREFIX;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(threadPrefix)})\\s*`);

    let args = [];
    let commandName = "";

    const isAdmin = ADMINBOT.includes(senderID);
    const prefixUsed = body.startsWith(threadPrefix);

    // ================== 🚫 DOUBLE RUN FIX ==================
    if (prefixUsed) {
      // PREFIX COMMAND (ADMIN + USER)
      if (!prefixRegex.test(body)) return;
      const [matchedPrefix] = body.match(prefixRegex);
      const temp = body.slice(matchedPrefix.length).trim().split(/ +/);
      commandName = temp.shift()?.toLowerCase();
      args = temp;
    } else {
      // NO PREFIX (ONLY ADMIN)
      if (!isAdmin) return;
      const temp = body.trim().split(/ +/);
      commandName = temp.shift()?.toLowerCase();
      args = temp;
    }
    // =======================================================

    if (!commandName) return;

    // ===== Alias Resolve =====
    for (const [cmdName, cmdObj] of commands) {
      if (cmdObj.config.aliases && cmdObj.config.aliases.includes(commandName)) {
        commandName = cmdName;
        break;
      }
    }

    let command = commands.get(commandName);

    // ===== Fuzzy Search =====
    if (!command && prefixUsed) {
      const allCommandName = Array.from(commands.keys());
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) {
        command = commands.get(checker.bestMatch.target);
      } else return;
    }

    if (!command) return;

    // ===== Banned Check =====
    if ((userBanned.has(senderID) || threadBanned.has(threadID)) && !isAdmin) {
      return api.sendMessage("❌ You are banned from using commands.", threadID, messageID);
    }

    // ===== VIP Mode =====
    const vipList = loadVIP();
    const vipMode = loadVIPMode();

    if (!isAdmin && vipMode && !vipList.includes(senderID)) {
      return api.sendMessage("> ❌ Only VIP users can use this command", threadID, messageID);
    }

    // ===== Permission Check =====
    let permssion = 0;
    const threadInfoo = threadInfo.get(threadID) || await Threads.getInfo(threadID);
    const isGroupAdmin = threadInfoo.adminIDs.some(e => e.id == senderID);

    if (NDH.includes(senderID)) permssion = 2;
    else if (isAdmin) permssion = 3;
    else if (isGroupAdmin) permssion = 1;

    if (command.config.hasPermssion > permssion) {
      return api.sendMessage("❌ Permission denied.", threadID, messageID);
    }

    // ===== Cooldown =====
    if (!global.client.cooldowns.has(command.config.name))
      global.client.cooldowns.set(command.config.name, new Map());

    const timestamps = global.client.cooldowns.get(command.config.name);
    const cooldown = (command.config.cooldowns || 1) * 1000;

    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + cooldown) {
      return api.sendMessage("⏳ Please wait before using this command.", threadID, messageID);
    }

    // ===== RUN COMMAND (ANTI DOUBLE SHIELD) =====
    global.client.runningCmd = global.client.runningCmd || new Set();
    const runKey = `${senderID}_${commandName}`;

    if (global.client.runningCmd.has(runKey)) return;
    global.client.runningCmd.add(runKey);

    try {
      await command.run({
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion
      });

      timestamps.set(senderID, dateNow);

      if (DeveloperMode)
        logger(`[CMD] ${commandName} | ${senderID} | ${threadID}`, "[ DEV ]");

    } catch (e) {
      api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
    } finally {
      global.client.runningCmd.delete(runKey);
    }
  };
};
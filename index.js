const { spawn } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const deviceID = require("uuid");
const adid = require("uuid");
const totp = require("totp-generator");
const logger = require("./utils/log");

/* ================= GLOBAL INIT (🔥 IMPORTANT FIX 🔥) ================= */
global.client = global.client || {};
global.client.timeStart = Date.now(); // ✅ uptime fix
global.countRestart = 0;
/* ==================================================================== */

const colors = ["FF9900","FFFF33","33FFFF","FF99FF","FF3366","FFFF66","FF00FF","66FF99"];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

fs.readFile("package.json", "utf8", (err, data) => {
  if (err) return;
  try {
    const packageJson = JSON.parse(data);
    const dependencies = packageJson.dependencies || {};
    logger(`Total installed packages: ${Object.keys(dependencies).length}`, "[PACKAGE]");
  } catch {}
});

/* ================= LOAD COMMANDS ================= */
try {
  const files = fs.readdirSync("./modules/commands");
  files.forEach(file => {
    if (file.endsWith(".js")) require(`./modules/commands/${file}`);
  });
  logger("All modules loaded successfully", "[AUTO-CHECK]");
} catch (error) {
  logger("Module error detected", "[AUTO-CHECK]");
  console.log(error);
}
/* ================================================= */

function startBot(message) {
  if (message) logger(message, "[START]");

  const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "ARIF-BABU.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true
    }
  );

  child.on("close", (code) => {
    if (code !== 0 && global.countRestart < 5) {
      global.countRestart++;
      startBot("Bot crashed, restarting...");
    }
  });

  child.on("error", (error) => {
    logger("Error occurred: " + JSON.stringify(error), "[START]");
  });
}

const logacc = require("./ARIF-LOGACC.json");
const config = require("./config.json");

/* ================= LOGIN SYSTEM ================= */
async function login() {
  if (config.ACCESSTOKEN !== "") return;

  if (!logacc?.EMAIL || !logacc?.PASSWORD) {
    return console.log("Missing account info in ARIF-LOGACC.json");
  }

  const form = {
    adid: adid.v4(),
    email: logacc.EMAIL,
    password: logacc.PASSWORD,
    format: "json",
    device_id: deviceID.v4(),
    family_device_id: deviceID.v4(),
    locale: "en_US",
    client_country_code: "US",
    credentials_type: "device_based_login_password",
    generate_session_cookies: "1",
    generate_machine_id: "1",
    machine_id: randomString(24),
    api_key: "882a8490361da98702bf97a021ddc14d",
    access_token: "275254692598279|585aec5b4c27376758abb7ffcb9db2af"
  };

  form.sig = encodesig(sort(form));

  try {
    const res = await axios.post(
      "https://b-graph.facebook.com/auth/login",
      require("querystring").stringify(form),
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );

    if (res.data.access_token) {
      config.ACCESSTOKEN = res.data.access_token;
      saveConfig(config);
    }
  } catch (err) {
    console.log(err.response?.data || err);
  }
}
/* ================================================= */

function saveConfig(data) {
  fs.writeFileSync("./config.json", JSON.stringify(data, null, 4));
}

function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = chars[Math.floor(Math.random() * chars.length)];
  for (let i = 1; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function encodesig(obj) {
  const crypto = require("crypto");
  let data = "";
  Object.keys(obj).forEach(k => (data += k + "=" + obj[k]));
  return crypto
    .createHash("md5")
    .update(data + "62f8ce9f74b12f84c123cc23437a4a32")
    .digest("hex");
}

function sort(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((r, k) => ((r[k] = obj[k]), r), {});
}

async function startb() {
  if (config.ACCESSTOKEN !== "") startBot();
  else {
    await login();
    setTimeout(startBot, 7000);
  }
}

/* ================= WEB SERVER ================= */
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => res.send("ARIF-BABU V3 is running"));
app.listen(PORT, () =>
  console.log(`[SERVER] Listening on port ${PORT}`)
);
/* ================================================= */

startb();
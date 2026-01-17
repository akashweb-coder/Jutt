module.exports.config = {
	name: "groupname",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "ARIF BABU",
	description: "THIS BOT WAS MADE BY MR ARIF BABU",
	commandCategory: "CHANGE GROUP NAME", 
	usages: "PREFIX", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	var name = args.join(" ")
	if (!name) api.sendMessage("BOSS SAATH ME GROUP KANAME LIKHO JO AAP RAKHNA CHAHTA HO 😐✌️", event.threadID, event.messageID)
	else api.setTitle(name, event.threadID, () => api.sendMessage(`AB IS GROUP KA NAME YAHI HA 👉 ${name}\n━━━━━━━━━━━━━━━━━━━━━━━\nOWNER  𒁍 MR ⟶͇̽𝘼𝙆𝘼𝙎𝙃-𝙅𝙐𝙏𝙏⎯꯭̽ 🌺`, event.threadID, event.messageID));
}

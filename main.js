const Discord = require("discord.js");
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ]
});
require("./functions/eventLoader.js")(client);
require("./databases/database.js")(client);
require("./views/index.js")(client, app, io);
const listener = server.listen(process.env.PORT);

process.on("unhandledRejection", err => {
    console.log("[AntiCrash] V1", err);
});
process.on("uncaughtException", err => {
    console.log("[AntiCrash] V2", err);
});
process.on("uncaughtExceptionMonitor", err => {
    console.log("[AntiCrash] V3", err);
});
process.on("multipleResolves", err => {
    console.log("[AntiCrash] V4", err);
});
const path = require("path");
const passport = require("passport");
const url = require("url");
const axios = require("axios");
const Discord = require("discord.js");
const Strategy = require("passport-discord").Strategy;
const express = require("express");
const http = require("http");
const fs = require("fs");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const globalfun = require("../../functions/global.js");
module.exports = function (client, app, listener) {
const csybot = new globalfun(client, null);
  
const mainlocation = path.resolve(`${process.cwd()}${path.sep}views`);
const templateslocation = path.resolve(`${mainlocation}${path.sep}views${path.sep}`);
  
this.download = async function(res, req, template, data = {}) {
  
let headershortcut = require(path.join(__dirname, "shortcuts/header.js"));
let realfooter = require(path.join(__dirname, "shortcuts/realfooter.js"));
let footerdesingshortcut = require(path.join(__dirname, "shortcuts/footerdesing.js"));

var accessToken;
  
if(template == "index.ejs" || template == "server.ejs") {
  let testdata = await csybot.data("fetch", "users", `user_${req?.user?.id}`);
  if(!testdata) return res.render(path.resolve(`${templateslocation}${path.sep}${template}`), Object.assign({ error: 408, message: "Permission Problem!" }, data));

  let parsed = JSON.parse(testdata);
  accessToken = parsed?.accessToken;
}
  
    const baseData = {
      client: client,
      user: (req.user) ? req.user : null,
      base: (!data.lang) ? csybot.config.panel : csybot.config.panel/* + "/" + data.lang*/,
      rbase: csybot.config.panel,
      path: req.path,
      csybot: csybot,
      header: headershortcut(client, csybot, template),
      footerdesing: footerdesingshortcut(client, csybot, template),
      realfooter: realfooter(client, csybot, template),
      token: accessToken,
      profile: `https://cdn.discordapp.com/avatars/${req?.user?.id}/${req?.user?.avatar}.png`
    };
    res.render(path.resolve(`${templateslocation}${path.sep}${template}`), Object.assign(baseData, data), /*{ async: true } */);
    
};
this.loginrequired = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.backURL = req.url;
  res.redirect("/giris");
}
  
this.login = function (csybotsub) {
  
let strategy = new Strategy({
  clientID: csybot.config.bot.id,
  clientSecret: csybot.config.bot.secret,
  callbackURL: csybot.config.panel + "/callback",
  scope: csybot.config.bot.scopes
}, async (accessToken, refreshToken, profile, cb) => {
    await process.nextTick(async () => {
        if (profile.guilds == undefined) return cb(null, false);
        
        return cb(null, profile);
    });
});
  
  
passport.use(strategy);
  
passport.serializeUser((user, done) => {
    if (!user) return;
    return done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

csybotsub.use(session({
  secret: 'we56rv5wer4vwer',
  key: "wer9999swerwervwe",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
      checkPeriod: 86400000
  }),
  cookie: {
      maxAge: 60000
  }
}));
  
app.use(session({
  secret: 'aadsadnssddasnmndasdasdasdasdsdaghasdaa',
  key: "aaqwce165dsadnsqwce1q5wec15qwsddasnmndasdasdasdasdsdaghasdaa",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
      checkPeriod: 86400000
  }),
  cookie: {
      maxAge: 60000
  }
}));

csybotsub.use(passport.initialize());
csybotsub.use(passport.session());
  
}
  
this.end = function() {
app.use(function (err, req, res, next) {
  if(csybot.config.maintenance) return res.status(200).json({ "message": `${csybot.config.maintenance}`, "code": 404 });
  let globalfun2 = require("../libs/global.js");
  let panel = new globalfun2(client, app);
  res.status(500);
  panel.download(res, req, "error.ejs", { error: 500, message: "Internal Error" });
})
  
app.use((req, res, next) => {
  if(csybot.config.maintenance) return res.status(200).json({ "message": `${csybot.config.maintenance}`, "code": 404 });
  let globalfun2 = require("../libs/global.js");
  let panel = new globalfun2(client, app);
    res.status(404);
  panel.download(res, req, "error.ejs", { error: 404, message: "Page Not Found!" });
})

}
  
}
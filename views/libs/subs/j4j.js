const passport = require("passport");
const express = require("express");
const axios = require("axios");
const path = require("path");
const global = require("../../../functions/global.js");

const { REST } = require('@discordjs/rest');

const rest = new REST({ version: '10' }).setToken(process.env.token);

module.exports = function(client, realapp, app, panel) {

const csybot = new global(client, null);
  
/*
app.get('*', function(req, res, next) {
  if("https://"+req.hostname != csybot.config.panel) {
    res.status(404).send("Unkown URL!");
  } else {
    next();
  }
});
*/
  
app.all("/", async(req, res) => {
  if (!req.isAuthenticated() || !req.user || !req.user.id) return res.redirect("/login");
  
  
  let testdata = await csybot.data("fetch", "users", `user_${req?.user?.id}`);
  if(!testdata) return res.redirect("/exit");
  
  let parsed = JSON.parse(testdata);
  
  panel.download(res, req, "index.ejs", { enabled: Boolean(parsed?.invite), spin: Boolean(parsed?.spin) });
});
  
app.get("/server", async(req, res) => {
  if (!req.isAuthenticated() || !req.user || !req.user.id) return res.redirect("/login");
  
  let testdata = await csybot.data("fetch", "users", `user_${req?.user?.id}`);
  if(!testdata) return res.redirect("/exit");
  
  let parsed = JSON.parse(testdata);
  
  panel.download(res, req, "server.ejs", { servercode: (parsed?.invite) ? parsed?.invite : false, message: false });
});
  
app.post("/server", async(req, res) => {
  if (!req.isAuthenticated() || !req.user || !req.user.id) return res.redirect("/login");
  
  let testdata = await csybot.data("fetch", "users", `user_${req?.user?.id}`);
  if(!testdata) return res.redirect("/exit");
  
  var parsed = JSON.parse(testdata);
  var message = false;
  
  if(req?.body?.servercode && typeof req?.body?.servercode === "string" && req?.body?.servercode.length <= 20 && req?.body?.servercode.length >= 1) {
    
    let servercode = req.body.servercode;
    
    
    let invitecontrol = await axios.get(`https://discord.com/api/invite/${encodeURIComponent(servercode)}`).catch(err => err + "1");
    if(!invitecontrol || !invitecontrol.data || invitecontrol == "AxiosError: Request failed with status code 4041") {
      message = 1;
    } else if (invitecontrol?.data?.guild?.id && invitecontrol != "AxiosError: Request failed with status code 4041") {
      
      let userdoublejoincontrol = await csybot.join(invitecontrol?.data?.guild?.id, req.user.id, req.user.accessToken);
      if(!userdoublejoincontrol?.result) {
        message = 3;        
      } else {
        parsed.invite = servercode;

        await csybot.data("set", "users", `user_${req?.user?.id}`, JSON.stringify(parsed))
        message = 2;
      }
    }
    
  } else {
    message = 1;
  }
  
  panel.download(res, req, "server.ejs", { servercode: (parsed?.invite) ? parsed?.invite : false, message: message });
});
  
app.all("/invite", async(req, res) => {
  let invite = `https://discord.com/oauth2/authorize?scope=bot+applications.commands&client_id=${csybot.config.bot.id}&permissions=8`;
  res.redirect(invite);
});
app.use('/images', express.static(path.join(__dirname, '../static')))
  
/* login */
app.get("/login", (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.id) return res.redirect(csybot.config.panel);
    next();
  },
  passport.authenticate("discord", { prompt: 'none' }));
  
/* EXIT */
app.all("/exit", (req, res, next) => {
  if(csybot.config.maintenance.web == true) return res.status(200).json({ "message": `${csybot.config.maintenance.web_message}`, "code": 404 });
    if (!req.isAuthenticated() || !req.user || !req.user.id) return res.redirect(csybot.config.panel);
      req.session.destroy(() => {
        req.logout(() => {});
        res.redirect(csybot.config.panel);
      });
  });
  
/* callback */
  
app.get("/callback", function (req, res, next) { 
  return passport.authenticate("discord", { failureRedirect: "/" }, async function (err, user, info) {
    if (err) {
        err + "1"
        return panel.download(res, req, "error.ejs", { error: 403, message: "Rate Limit Please Retry!" });
    }
    await req.login(user, function (e) {
        if (e) return next(e);
        return next();
    });
})(req, res, next); }, async function (req, res) {
    
    // BLACK LIST YERI
  
    if(!req?.user?.guilds) {
      req.session.destroy(() => {
        req.logout(() => {});
      });
        return panel.download(res, req, "error.ejs", { error: 408, message: "Permission Problem!" });
    }
  
    
    let testdata = await csybot.data("fetch", "users", `user_${req.user.id}`);
  
    if(!testdata) {
      await csybot.data("set", "users", `user_${req.user.id}`, JSON.stringify({
        id: req.user.id,
        accessToken: req.user.accessToken,
        date: new Date(req.user.fetchedAt).getTime()
      }));
    } else {
      let jsontested = JSON.parse(testdata);
      jsontested.accessToken = req.user.accessToken;
      jsontested.date = new Date(req.user.fetchedAt).getTime();
      await csybot.data("set", "users", `user_${req.user.id}`, JSON.stringify(jsontested))
    }
  
    res.redirect(csybot.config.panel);
})


app.all('/sitemap.xml', async function(req, res, next){
  let xml_content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"',
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>'+csybot.config.panel+'</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '</urlset>'
  ]
  
  res.set('Content-Type', 'text/xml')
  res.status(200);
  res.send(xml_content.join('\n'))
});
  
app.all("/robots.txt", async function (req, res, next){

  let robots_content = [
    'Sitemap: '+csybot.config.panel+'/sitemap.xml',
    'User-agent:*',
    'Disallow'
  ]
  
  
    res.type('text/plain');
    res.send(robots_content.join('\n'))

});
  
};
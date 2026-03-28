const axios = require("axios");
const request = require("request");
const Discord = require("discord.js");
const db = require("csy.db");
module.exports = function(client, interaction = null) {
  
  /* Database Method */
  this.data = async function (type, mymodel, dataname, data, unqueued = false) {
    let getmodel = require(`../databases/models/${mymodel}.js`);
    if(type == "set") {
      const doc = await getmodel.findOneAndUpdate({ dataname: { $eq: dataname } }, { data: data }).lean();
      if (doc) {
        return doc.data;
      } else {
        var docc = await getmodel.create({
          dataname: dataname,
          data: data,
        });
        return docc.data;
      }
      } else if (type == "fetch") {
        const doc = await getmodel.findOne({ dataname: { $eq: dataname } }).lean();
        if(doc) { return doc.data } else { return undefined; }
      } else if (type == "delete") {
        await getmodel.deleteOne({ dataname: { $eq: dataname } });
        return;
      } else if (type == "add") {
        var docv = await getmodel.findOne({ dataname: { $eq: dataname } }).lean();
        if(!docv) {
          var docv = await getmodel.create({
            dataname: dataname,
            data: 0,
          });
        };
        let result = Number(docv.data) + Number(data);
        const doc = await getmodel.findOneAndUpdate({ dataname: { $eq: dataname } }, { data: result }).lean();
        if(!doc) { return false; } else { return true; }
      } else if (type == "count") {
        const cursor = await getmodel.find().cursor();
        var length = 0;
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          let control = (doc.dataname).startsWith(dataname);
          if(!control) continue;
          length++
        }
        return length || 0;
      } else if (type == "starts") {
        const cursor = await getmodel.find().cursor();
        var res = [];
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          let control = (doc.dataname).startsWith(dataname);
          if(!control) continue;
          var json = {
            "dataname": doc.dataname,
            "data": doc.data
          }
          res.push(json);
        }
        return res || null;
      } else if (type == "find") {
        const cursor = await getmodel.find().cursor();
        var res;
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          
          let parsed = JSON.parse(doc.data);
          
          if(unqueued) {
            if(parsed.id == unqueued) continue;
            
            let randomizerpartner = await this.data("fetch", "users", `user_${unqueued}`);
            if(!randomizerpartner) break;
            let randomizerparsed = JSON.parse(randomizerpartner);
            
            if(randomizerparsed?.partners && randomizerparsed.partners.includes(parsed.id)) continue;
            
          }
          
          
          if(parsed?.accessToken) {
            var tokencontrolvalid = await this.join("1046153156532371517", parsed?.id, parsed?.accessToken);
            if(!tokencontrolvalid?.result) continue; 
          }
          
          let secretkey = parsed[dataname];
          
          if(secretkey == data) {
            res = parsed;
          } else {
            continue;
          }
          
        }
        return res || null;
      } else if (type == "include") {
        const cursor = await getmodel.find().cursor();
        var res = [];
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          
          let parsed = JSON.parse(doc.data);
          if(parsed.spin != true) continue; 
          
          if(parsed?.accessToken) {
            var tokencontrolvalid = await this.accesscontrol(parsed?.accessToken);
            if(!tokencontrolvalid) continue; 
          }
          res.push(parsed);
        }
        return res || null;
      }
  }
  /* Database Method */
  
  
  this.config = require("../config.js");
  
  /* Filter Function */
  this.filter = function (texts, maxlength = 150) {
    let text = (texts != null || texts != undefined || texts != "") ? String(texts) : null;
    if(text.length > maxlength || text == null || text == undefined || text == "") return "[...]";
    
    let tagregexp = new RegExp('<@(.*?)>', 'g');
    let tagsregexp = new RegExp('<@!(.*?)>', 'g');
    text = text.replaceAll(tagregexp, "[...]")
    text = text.replaceAll(tagsregexp, "[...]")
    
    var swears = [ '"', "'", "*", "`", "$", "<", "_", "~", "\n", ">"];
    var result = text.replaceAll(swears, '')
    return result;
  }
  /* Filter Function */
  
  this.date = function() {

    var date = new Date();

    let year  = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  
  
  this.footer = "#Her Zaman Daima İleriye";
  
  this.userget = async function(userid) {

    return await client.users.fetch(userid).then(x => {
                        return x;
                      }).catch(err => {
      err + "1";
      return null;
    });
  }
  
  this.sleep = async(ms) => {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }
  
  this.accesscontrol = async(token) => {
    
    let control = await axios.get("http://discordapp.com/api/users/@me", { 
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).catch(err => err + "1");
    
    if(!control?.data) {
      return false;
    } else {
      return true;
    }
  }
  /*
  this.findblur = async function(user) {
    return new Promise(async(res, rej) => {
      
      var result;
      for(var i = 0; i != true; i++) {
        var testing = await this.data("find", "users", "spin", true, user.id);
        var testdata = await this.data("fetch", "users", `user_${user.id}`);
        if(!testdata || !testing) return;
        let parsed = JSON.parse(testdata);
        let parsedt2 = JSON.stringify(testing);
        let parsed2 = JSON.parse(parsedt2);
        
        if(testing) {
          let twoaccesskeytest = await this.accesscontrol(testing.accessToken);
          let oneaccesskeytest = await this.accesscontrol(parsed.accessToken);
          
          if (!oneaccesskeytest) {
            parsed.spin = false;
            await this.data("set", "users", `user_${user.id}`, JSON.stringify(parsed))
            res(false);
            break;
          }
          if (!twoaccesskeytest) {
            parsed2.spin = false;
            await this.data("set", "users", `user_${parsed2.id}`, JSON.stringify(parsed2))
            res(false);
            break;
          }
          
          res(testing);
          break;
        }
        
        this.sleep(5000);
      }
      
    });
  }*/
  
  this.findblur = async function(user) {
    return new Promise(async(res, rej) => {
      var result;
      for(var i = 0; i != "as"; i++) {
        var testdata = await this.data("fetch", "users", `user_${user.id}`);
        if(!testdata) return res(false);
        var parsed = JSON.parse(testdata);   
      
        if(!parsed.spin) {
          res(false);
          break;
        }
      
        if(parsed.spinned) {
          res(true);
          break;
        }
        
        await this.sleep(5000);
      }
      
    });
    
  }
  
  this.resultwait = async function(user) {
    return new Promise(async(res, rej) => {
      var result;
      for(var i = 0; i != "as"; i++) {
        var testdata = await this.data("fetch", "users", `user_${user.id}`);
        if(!testdata) return res(false);
        var parsed = JSON.parse(testdata);   
      
        if(i >= 5) {
          res(false);
          break;
        };
        
        if(parsed.success && !parsed.error) {
          res({ code: 200 });
          break;
        }
        if (parsed.error) {
          res({ code: parsed.error });
          break;
        }
        
        await this.sleep(5000);
      }
    });
  }
  
  this.join = async function(guild, user, secret) {
    return new Promise(async(res, rej) => {
 
      
        let s = await request({
          url: `https://discordapp.com/api/v8/guilds/${guild}/members/${user}`,
          method: "PUT",
          json: {
            access_token: secret
          },
          headers: {
            "Authorization": `Bot ${process.env.token}`
          }
        }, function(error, response, body) {
          // 50025 = Accesstoken valid
          // 10004 = unkown guild
          // 204 = success
          
          if ((body?.code && body?.code == 204) || !body?.code) {
            res({ code: 200, result: true });
          } else {
            res({ code: (body?.code) ? body?.code : 11, result: false });
          }
        });
    });
  }

}
const request = require("request");
const axios = require("axios");
exports.run = async (client, csybot) => {

  /*let testtt = await csybot.data("include", "users");
  console.log(testtt);*/
  
  for (var i = 0; i != "sa"; i++) {
  
    var user1 = await csybot.data("find", "users", "spin", true);  
    if(!user1) {
      await csybot.sleep(10000);
      continue;
    } else {
      var user2 = await csybot.data("find", "users", "spin", true, user1.id);  
      if(!user2) {
        await csybot.sleep(10000);
        continue;
      } else {
      
        let secrettest1 = await csybot.accesscontrol(user1.accessToken);
        let secrettest2 = await csybot.accesscontrol(user2.accessToken);
        if(!secrettest1) {
          user1.spin = false;
          await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1))
          await csybot.sleep(5000);
          continue;
        }
        if(!secrettest2) {
          user2.spin = false;
          await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2))
          await csybot.sleep(5000);
          continue;
        }

        user1.error = false;
        user1.success = false;
        user1.spinned = JSON.stringify(user2);
        user2.error = false;
        user2.success = false;
        user2.spinned = JSON.stringify(user1);
        if(user1.partners) {
          user1.partners.push(user2.id);
        } else {
          var newarr1 = [user2.id];
          user1.partners = newarr1;
        }
        
        if(user2.partners) {
          user2.partners.push(user1.id);
        } else {
          var newarr2 = [user1.id];
          user2.partners = newarr2;
        }

        await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1));
        await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
        
        await csybot.sleep(7000);
        
        let user1invite = await axios.get(`https://discord.com/api/invite/${encodeURIComponent(user1.invite)}`).catch(err => err + "1");
        let user2invite = await axios.get(`https://discord.com/api/invite/${encodeURIComponent(user2.invite)}`).catch(err => err + "1");
        
        if(user1invite && user1invite.data && user1invite?.data?.guild?.id && user1invite != "AxiosError: Request failed with status code 4041") {
          let user1doublecontrol = await csybot.join(user1invite?.data?.guild?.id, user1.id, user1.accessToken);
          if(user1doublecontrol?.result != true) {
            user1.spin = false;
            user1.spinned = false;
            user2.spin = false;
            user2.spinned = false;
            user2.error = 202;
            user1.error = 201;

            await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1));
            await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
            await csybot.sleep(5000);
            continue;
          }
          let user1joincontrol = await csybot.join(user1invite?.data?.guild?.id, user2.id, user2.accessToken);
          if(user1joincontrol?.result != true) {
            user1.spin = false;
            user1.spinned = false;
            user2.spin = false;
            user2.spinned = false;
            user2.error = 202;
            user1.error = 201;

            await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1));
            await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
            await csybot.sleep(5000);
            continue;
          }
        }
        if(user2invite && user2invite.data && user2invite?.data?.guild?.id && user2invite != "AxiosError: Request failed with status code 4041") {
          let user2doublecontrol = await csybot.join(user2invite?.data?.guild?.id, user2.id, user2.accessToken);
          if(user2doublecontrol?.result != true) {
            user1.spin = false;
            user1.spinned = false;
            user2.spin = false;
            user2.spinned = false;
            user2.error = 201;
            user1.error = 202;

            await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1));
            await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
            await csybot.sleep(5000);
            continue;
          }
          let user2joincontrol = await csybot.join(user2invite?.data?.guild?.id, user1.id, user1.accessToken);
          if(user2joincontrol?.result != true) {
            user1.spin = false;
            user1.spinned = false;
            user2.spin = false;
            user2.spinned = false;
            user1.error = 202;
            user2.error = 201;
            
            await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1));
            await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
            await csybot.sleep(5000);
            continue;
          }
        }
        
        user1.spinned = false;
        user2.spinned = false;
        user2.success = true;
        user1.success = true;
        user1.spin = false;
        user2.spin = false;
        
        await csybot.data("set", "users", `user_${user1.id}`, JSON.stringify(user1))
        await csybot.data("set", "users", `user_${user2.id}`, JSON.stringify(user2));
        
        await csybot.sleep(5000);
      }
    }
  }
  
  
  
}
exports.help = {
  event: "ready"
}
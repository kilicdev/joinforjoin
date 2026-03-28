const axios = require("axios");
module.exports = function (client, app, csybot, io) {
  
let sockets = [];  

  
io.on('connection', function (socket) {
  
  
  socket.on('disconnect', function() {
    if(!socket.userid) return; 
    if(sockets.includes(socket.userid) && socket?.blocked) {
      sockets = sockets.filter(x => x != socket.userid);
    }
  });
  
  socket.on('login', async function (token) {
    if(!token) return;

    let secrettest = await csybot.accesscontrol(token);
    if(!secrettest) return;
    
    let testing = await csybot.data("find", "users", "accessToken", token);
    
    if(!testing || typeof testing != "object" || !testing.invite) return;

    await csybot.sleep(3000);
    
    if(sockets.includes(testing.id)) {
       socket.emit("update", {
        code: 3,
        message: "Başka Sekmede Açık (203)"
      });
      socket.blocked = true;
      sockets = sockets.filter(x => x != testing.id);
      return;
    }
    
    socket.userid = testing.id;
    sockets.push(testing.id);
    
    let invitecontrol = await axios.get(`https://discord.com/api/invite/${encodeURIComponent(testing.invite)}`).catch(err => err + "1");
    if(!invitecontrol || !invitecontrol.data || !invitecontrol?.data?.guild?.id || invitecontrol == "AxiosError: Request failed with status code 4041") {
       socket.emit("update", {
        code: 3,
        message: "Davetinize Ulaşılamıyor."
      });
      socket.blocked = true;
      sockets = sockets.filter(x => x != testing.id);
      return;
    }
    let userdoublejoincontrol = await csybot.join(invitecontrol?.data?.guild?.id, testing.id, token);
    if(!userdoublejoincontrol?.result) {
       socket.emit("update", {
        code: 3,
        message: "Sunucu Botuna Ulaşılamıyor."
      });
      socket.blocked = true;
      sockets = sockets.filter(x => x != testing.id);
      return;
    }
    
    testing.spin = true;
    await csybot.data("set", "users", `user_${testing.id}`, JSON.stringify(testing));

    let result = await csybot.findblur(testing);

    if(!result) return;
    
    socket.emit("update", {
      code: 5,
      id: result.id,
      avatar: result.avatar,
      message: "Yükleniyor.."
    });
    
    let socketwait = await csybot.resultwait(testing);
    
    socket.blocked = true;
    sockets = sockets.filter(x => x != testing.id);
    if(socketwait.code != 201 && socketwait.code != 202) {
      socket.emit("update", {
        code: 4,
        id: result.id,
        avatar: result.avatar,
        message: "Başarılı!"
      });
    } else {
      if(socketwait.code == 201) {
        socket.emit("update", {
          code: 3,
          id: result.id,
          avatar: result.avatar,
          message: "Davetiniz Hatalı (201)"
        });
      } else if (socketwait.code == 202) {
        socket.emit("update", {
          code: 4,
          id: result.id,
          avatar: result.avatar,
          message: "Karşı Tarafın Daveti Hatalı (202)"
        });
      }
    }
    
    return;
  });
  
  
});
  
  
  
  
}
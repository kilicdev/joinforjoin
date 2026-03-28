exports.run = async (client, csybot) => {

  client.user.setActivity(`https://joinforjoin.cf Üye Kas!`, {
    url: "https://www.twitch.tv/csycraft",
    type: "STREAMING"
  });
  
  console.log("Bot Is Online!");
  
}
exports.help = {
  event: "ready"
}
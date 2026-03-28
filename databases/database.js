const mongoose = require("mongoose"); 
module.exports = async function (client) { 
  const conn = await mongoose.connect("CONNECT URL", { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => process.exit(1)); 
  client.login(process.env.token).catch(err => process.exit(1)); 
  console.log("Connected to the database");
  return true; 
}
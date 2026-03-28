const ejs = require("ejs");
const bodyParser = require("body-parser");
const globalfun = require("../functions/global.js");
const panelfun = require("./libs/global.js");
const minifyHTML = require('express-minify-html-terser');
module.exports = async (client, app, io) => {

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
  
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
  
const csybot = new globalfun(client);
const panel = new panelfun(client, app);

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}));
  
panel.login(app);
  
require("./libs/subs/j4j.js")(client, app, app, panel);
require("./libs/socket.js")(client, app, csybot, io)
  
/* END Handlers */
panel.end();
/* END Handlers */
}
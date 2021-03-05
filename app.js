var http = require("http");
var https = require("https");

var express = require("express");
var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);
var GlobalTime;
var LastTime;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("index");
});

var URls = [
  "https://www.google.de",
  "https://www.bild.de",
  "https://www.facebook.com",
];

var URlStatus = [];

setInterval(() => {
  URls.forEach((element) => {
    getResponseCode(element, URls.indexOf(element) + 1);
  });
}, 5000);

function getResponseCode(url, numberof) {
  https.get(url, function (res) {
    URlStatus[numberof - 1] = res.statusCode;
    // console.log( "URL: "+numberof+ "   Statuscode: "+URlStatus[numberof-1])
  });
}

setInterval(() =>{
  GlobalTime = getTimeInHMS()
  console.log("SerrverZeit: " +GlobalTime);
},1000)

function getTimeInHMS(){
  var date = new Date();
  var string = date.toLocaleTimeString([], {hour : '2-digit', minute: '2-digit', second: '2-digit'});
  return string;
}


io.on("connection", function (socket) {
  socket.on("Initialfetch", function (message) {
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      socket.emit("InitData", { statusCode, index, LastTime });
      console.log("übermittelte Lastime " +LastTime);
    }
  });
  
  setInterval(() => {
    var i;
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      LastTime = GlobalTime;
      socket.emit("UpdateURL", { statusCode, index, GlobalTime });
      console.log("Client-Zeit in Durchlauf:"+i+ "  "+GlobalTime)
    }
  }, 6000);
});

io.on("SendToServer", function(socket){
    console.log("nachricht wurde von server an user gesendet");
});

//Server wird gestartet

let PORT = 3000;
httpServer.listen(PORT, function () {
  console.log("Server listening on Port: " + PORT);
});

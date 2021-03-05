var http = require("http");
var https = require("https");

var express = require("express");
var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);

const PORT = process.env.PORT || 8080;
const PollRate = 180000;

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
  "https://www.twitch.tv",
  "https://www.linkedin.com",
  "https://www.twitter.com",
  "https://www.instagram.com",
  "https://www.faceit.com",
  "https://www.faz.net/aktuell/",
];

var URlStatus = [];

setInterval(() => {
  URls.forEach((element) => {
    getResponseCode(element, URls.indexOf(element) + 1);
  });
}, PollRate);

function getResponseCode(url, numberof) {
  https.get(url, function (res) {
    URlStatus[numberof - 1] = res.statusCode;
   
    // console.log( "URL: "+numberof+ "   Statuscode: "+URlStatus[numberof-1])
  });
}

setInterval(() => {
  GlobalTime = getTimeInHMS();
  LastTime = GlobalTime;
}, PollRate);

function getTimeInHMS() {
  var date = new Date();
  var string = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return string;
}

io.on("connection", function (socket) {
  socket.on("Initialfetch", function (message) {
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      socket.emit("InitData", { statusCode, index, LastTime });
     // console.log("übermittelte Lastime " + LastTime);
    }
  });

  setInterval(() => {
    var i;
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];

      socket.emit("UpdateURL", { statusCode, index, GlobalTime });
     // console.log("Lastime zugewiesne auf: " + LastTime);
    }
  }, PollRate);
});

//Server wird gestartet

httpServer.listen(PORT, function () {
  console.log("Server listening on Port: " + PORT);
});

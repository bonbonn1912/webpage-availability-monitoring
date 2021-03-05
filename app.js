var http = require("http");
var https = require("https");

var express = require("express");
var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);

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



io.on("connection", function (socket) {
  socket.on("Initialfetch", function (message) {
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      socket.emit("UpdateURL", { statusCode, index });
    }
  });
  
  setInterval(() => {
    var i;
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      socket.emit("UpdateURL", { statusCode, index });
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

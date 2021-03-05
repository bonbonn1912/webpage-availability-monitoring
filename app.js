var http = require("http"); 

var express = require("express");
var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.get("/", function(req,res){
    res.render("index");
});


let PORT = 3000;
httpServer.listen(PORT, function(){
    console.log("Server listening on Port: "+PORT);
});



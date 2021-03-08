var socket = io();

// Zugriff auf die Elemente der Seite 
const TargetBox = document.querySelectorAll("#Box");
const TargetURL = document.querySelectorAll(".statusMessage");
const TargetTime = document.querySelectorAll(".timeMessage");


// Wird ausgeführt sobald eine Verbindung aufgebaut wird
socket.on("connect", function(){
    console.log("User connected");
    socket.emit("Initialfetch");
})



socket.on("UpdateURL", function({statusCode, index, GlobalTime, color}){
 changeStatusCode(statusCode, index, GlobalTime,color)
// console.log("Websocket Anfrage erhalten");
})

socket.on("InitData", function({statusCode, index, LastTime, color}){
    changeStatusCode(statusCode, index,LastTime,color)
 //   console.log("Websocket Anfrage erhalten");
   })
   socket.on("communicate", function(){
    console.log("PING");
   
})
   

function changeStatusCode(statusCode, index, GlobalTime,color){
    changeBoxColor(color,index)
    if(statusCode.length >3){
        TargetURL[index-1].innerHTML = statusCode;
        TargetTime[index-1].innerHTML = GlobalTime;
    }else {
        TargetURL[index-1].innerHTML = "Statuscode: "+statusCode;
        TargetTime[index-1].innerHTML = GlobalTime;
    }
    
}

function changeBoxColor(color,index){
    console.log("Index: "+index +" Farbe: "+color);
    TargetBox[index-1].style.backgroundColor = color;
}
console.log("Main.js geladen");
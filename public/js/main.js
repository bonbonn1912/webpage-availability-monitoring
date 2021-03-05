const socket = io();

// Zugriff auf die Elemente der Seite 
const TargetURL = document.querySelectorAll(".statusMessage");
const TargetTime = document.querySelectorAll(".timeMessage");





function getTimeInHMS(){
    var date = new Date();
    var string = date.toLocaleTimeString([], {hour : '2-digit', minute: '2-digit', second: '2-digit'});
    return string;

}

// Wird ausgeführt sobald eine Verbindung aufgebaut wird
socket.on("connect", function(){

    console.log("User connected");
})



socket.on("UpdateURL", function({statusCode, index}){
 changeStatusCode(statusCode, index, getTimeInHMS())
 console.log("Websocket Anfrage erhalten");
})

socket.on("foreachtest"), function({element}){
console.log("Übermittelter COde: " +element);
}

function changeStatusCode(statusCode, index, time){
    
    TargetURL[index-1].innerHTML = "Statuscode: "+statusCode;
    TargetTime[index-1].innerHTML = time;
}
console.log("Main.js geladen");
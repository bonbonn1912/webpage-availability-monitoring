var data = require("../Requests/urls");

function createAjaxResponse(res){
    res.send(data.statuscodes)
}


module.exports = {
    createAjaxResponse : createAjaxResponse,
}
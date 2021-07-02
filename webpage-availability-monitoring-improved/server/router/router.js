var express = require('express');
var router = express.Router();
var createResponse = require('../createResObjects/resObjects.js');

const names = [{name: "Aktienkurse"}, {name: "Finanzcheck"}, {name: "Kreditkarten"}, {name: "Kontak"}, {name: "Privatkredit"}, {name: "Girokonto"}, {name: "Mobile Apps"}, {name: "Altersvor-sorge"}, {name: "Online-banking"}]

router.get("/", (req, res) =>{
    res.render("index", { data : names} );
})

router.get("/api/getresponsecodes", (req, res) =>{ createResponse.createAjaxResponse(res)})
   
    


module.exports = router;
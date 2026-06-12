var express = require('express');
var router = express.Router();

const fs =require("fs");

let routes = fs.readdirSync(__dirname);

for (let route of routes) {
  if (route.includes(".js") && route != "index.js") {

    const routeModule = require('./' + route);
    router.use(
      "/" + route.replace(".js", ""),
      routeModule
    );
  }
}

//const config=require("../config")

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'İbrahim', config });
// });



module.exports = router;

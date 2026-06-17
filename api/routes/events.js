var express = require('express');
var router = express.Router();

const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const config = require('../config');

const emitter = require("../lib/Emitter");

emitter.addEmitter("notifications");

router.get('/', async (req, res) => {
    console.log("events: "+req.body);
    
    res.writeHead(Enum.HTTP_CODES.OK, {
        "content-type": "text/event-stream",
        "connection": "keep-alive",
        "cache-control": "no-cache, no-transform"
    })

    const listener = (data)=>{
        res.write("data: "+JSON.stringify(data)+"\n\n");

        emitter.getEmitter("notifications").on("messages",listener);

        req.on("close",()=>{
            emitter.getEmitter("notifications").off("messages",listener);
        })
        console.log("req: "+req);
        console.log("res: "+res);
        
    }

});


module.exports = router;
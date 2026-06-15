const logger = require('./logger');
let instance = null;

class LoggerClass{

    constructor()
    {
        if (!instance) {
            instance=this;
        }
        return instance;
    }

    #createLogObject(email,location,proc_type,log){
        return{
            email,location,proc_type,log
        }
    }

    info(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.info(logObject);
    }

    warn(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.warn(logObject);
    }

    error(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.error(logObject);
    }

    verbosa(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.verbose(logObject);
    }

    silly(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.silly(logObject);
    }

    http(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.http(logObject);
    }

    debug(email,location,proc_type,log){
        let logObject=this.#createLogObject(email,location,proc_type,log);
        logger.debug(logObject);
    }

}


module.exports= new LoggerClass();
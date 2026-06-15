const Enum = require("../config/Enum");
const AuditLogsModel = require("../db/models/AuditLogs");

let instance=null;
class AuditLogs {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    info(email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.INFO,
            email,
            location,
            proc_type,
            log
        })
    }

    error(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.ERROR,
            email,
            location,
            proc_type,
            log
        })
    }

    warn(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.WARN,
            email,
            location,
            proc_type,
            log
        })
    }

    debug(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.DEBUG,
            email,
            location,
            proc_type,
            log
        })
    }

    verbose(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.VERBOSE,
            email,
            location,
            proc_type,
            log
        })
    }

    silly(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.SILLY,
            email,
            location,
            proc_type,
            log
        })
    }

    http(email, location, proc_type, log) {
        this.saveToDB({
            level: Enum.LOG_LEVELS.HTTP,
            email,
            location,
            proc_type,
            log
        })
    }

    #saveToDB({ level, email, location, proc_type, log }) {
        let auditLog = new AuditLogsModel({
            level,
            email,
            location,
            proc_type,
            log
        });

        auditLog.save();
    }
}

module.exports = new AuditLogs();
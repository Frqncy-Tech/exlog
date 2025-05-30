// core exlog functionality is made for Express usage
const fs = require('fs')
const path = require('path')
let logFilePath = path.join(process.cwd(), 'exlog.log')

const exlog = function(req, res, next){
    // construct a simple but efficient log of the access
    // Timestap | Req IP | Req target | Status
    // string of raw headers from Express
    const date = new Date()
    const logMsg = `${date.toUTCString()} | ${req.ip} | ${req.protocol}://${req.hostname}${req.originalUrl}`
    const headersMsg = JSON.stringify(req.headers)
    const fullLog = `${logMsg}\n${headersMsg}\n\n`
    if (process.env.NODE_ENV === 'prod' && logFilePath) {
        fs.appendFileSync(logFilePath, fullLog)
    } else {
        console.log(logMsg)
        console.log(headersMsg)
        console.log('\n')
    }
    next()
}

exlog.setLogFile = function(pathArg) {
    logFilePath = pathArg || path.join(process.cwd(), 'exlog.log')
    if (process.env.NODE_ENV === 'prod') {
        // Redirect console.log to log file in prod
        console.log = function(...args) {
            const msg = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
            fs.appendFileSync(logFilePath, msg + '\n')
        }
    }
}

exlog.log = function(msg){
    if (process.env.NODE_ENV === 'prod' && logFilePath) {
        fs.appendFileSync(logFilePath, msg + '\n')
    } else {
        console.log(msg)
    }
}

module.exports = exlog
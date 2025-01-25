// core exlog functionality is made for Express usage
const exlog = function(req, res, next){
    // construct a simple but efficient log of the access
    // Timestap | Req IP | Req target | Status
    // string of raw headers from Express
    const date = new Date()
    console.log(`${date.toUTCString()} | ${req.ip} | ${req.protocol}://${req.hostname}${req.originalUrl}`)
    console.log(JSON.stringify(req.headers))
    console.log('\n')
    next()
}

exlog.log = function(msg){
    console.log(msg)
}

module.exports = exlog
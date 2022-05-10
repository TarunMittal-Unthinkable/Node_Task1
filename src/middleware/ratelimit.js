const rateLimit = require('express-rate-limit')
const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, 
    handler: function (req, res) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a while then try again'
        })
    }
})
module.exports=apiRequestLimiter;
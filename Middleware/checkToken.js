const jwt = require('jsonwebtoken')

async function verifyToken(req, res, next) {
    console.log("in verify token")
    const token = req.headers.authorization
    const tok = token.substring(7)
    const isValid = jwt.verify(tok,process.env.SecretKey)
    console.log(isValid)
    const expirationTime = new Date(isValid.exp * 1000)
    console.log(expirationTime)
    next()
}

module.exports = { verifyToken }
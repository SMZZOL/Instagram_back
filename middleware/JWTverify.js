const jwt = require("jsonwebtoken")


const JWTverify = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req._id = decoded.UserInfo._id
            req.email = decoded.UserInfo.email
            req.userid = decoded.UserInfo.userid
            next()
        }
    )
}

module.exports = JWTverify  

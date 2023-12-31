const jwt = require('jsonwebtoken')

const config = process.env

const verifyToken = (req,res,next) =>{
    const token = req.body || req.query.token || req.headers["x-access-token"]

    if(!token)
    {
        return res.status(403).send("A Token Required For The Authentication")
    }
    try
    {
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
    }
    catch(err){
        return res.status(401).send("Invaild Token");
    }
    return next();
};

module.exports = verifyToken;


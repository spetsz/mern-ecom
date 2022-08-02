const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next){

    // Get the token from header
    const token = req.header('ACCESS_TOKEN')

    // Check if no token
    if(!token){
        return res.status(401).json({msg : 'No token, authorisation denied!'})
    }


    // Verify Token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user.id
        
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json({msg : 'Token not valid!'})
    }




    
}
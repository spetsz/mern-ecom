const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

// Login

router.post('/login', [
    // Requeest vqlidqtion chhecks
    check('email', 'Email is required !').not().isEmpty(), 
    check('password', 'Password is required !').not().isEmpty()

    ],
    
    async (req, res)=>{
    

    //Checking for potential errors
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({msg : errors.array()})
    }

    const {email, password} = req.body
  

    //Authentication
    try {

        //Checking if user exits in database
        const user = await User.findOne({email})
        console.log(user)
        if(!user){
            return res.status(400).json({msg : [{msg : 'Bad Credentials'}]})
        }

        //Checking if credentials are correct
        const isMatch = await bcrypt.compare(password, user.password)

        !isMatch ? res.status(400).json({msg : [{msg : 'Bad Credentials'}]}) : null
        
        const payload = {

                userID : user.id
            
        }

        //Signing the token
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3600s'}, 
            (err, token)=>{
                if(err) throw err
                res.json({token})
            }
        )
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;
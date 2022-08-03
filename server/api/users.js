const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

//Creating a user 

router.post('/register', 
    
    // Request Validation checks
    [
    check('first_name', 'You must provide a First Name').not().isEmpty(), 
    check('last_name', 'You must provide aaaa Last Name').not().isEmpty(),
    check('email', 'You  must provide an email, email is linked to only  one account').not().isEmpty(),
    check('password', 'Password must be at least 5 charactesrs').not().isEmpty()
    ], 
    
    async (req, res)=>{
    
    // Checking for errors 

    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array()) 
    }

    // Check if email already exists
    const isMatch = await User.findOne({email : req.body.email})
    
    if(isMatch){
        return res.status(400).json({msg : [{msg:'Email reserved!'}]})
    }
    
     

  


    try {

        const { first_name, last_name, email, password, phone_number, isAdmin, orders } = req.body
       
        // Creating user fields
        let userFields = {
            first_name,
            last_name,
            password,
            email,
            phone_number, 
            isAdmin,
            orders
        }

        // Hashing the password 
        userFields.password = await bcrypt.hash(password, 10)
       
      
        
        // Intiating a user from the model
        const user = new User(userFields)

        // Saving user to the database
        await user.save()


        // Signing the token 

        const payload = {
            user :{
                id : user.id
            }
        }

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3600s'}, 
            (err, token)=>{
                if(err) throw err
                res.json({token, username : req.body.user})
            }
        )



    } catch (error) {
        console.error(error)
    }
    

})













module.exports = router;
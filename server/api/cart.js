const express = require('express')
const router = express.Router()
const auth = require('../api/middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const Product = require('../models/Product')
const mongoose = require('mongoose')

/* 

There is going to be two ways to store shopping cart info:

    LOCAL STORAGE : in case user does not have an account yet and browsing as guest.
    DATABASE      : in case user is authenticated.

*/

router.post('/add_product', auth ,check('product_id', "Product can't be empty !"), async (req , res)=>{



   try {


        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.json({msg : errors.array()})
        }


        const {product_id} = req.body

        if(!mongoose.isValidObjectId(product_id)){
            return res.json({msg : "Not a valid product ID"})
        }

        const product = await Product.findById(product_id)

        if(!product){
            return res.status(404).json({msg : "Product you're trying to add no longer availabale!"})
        }

    
        const user = await User.findById(req.user)

        if(!user){
            return res.status(404).json({msg : "User does not exist"})
        }

        user.cart.products.push(product)

        await user.save()

        return res.status(200).json({msg : "Product added to cart successfully"})

       
   } catch (error) {
       console.log(error.message)
       res.status(500).json('Server error!')
   }

})




















module.exports = router;

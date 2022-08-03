const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')

/* 

There is going to be two ways to store shopping cart info:

    LOCAL STORAGE : in case user does not have an account yet and browsing as guest.
    DATABASE      : in case user is authenticated.

*/

router.post('/', async (req , res)=>{

    // Check if user is authenticated
    const token = req.header('ACCESS_TOKEN')


   try {

    const {product} = req.body
    console.log(product)
    const cart = new Cart({product})
    await cart.save()

    res.json(cart)
       
   } catch (error) {
       console.log(error.message)
   }

})




















module.exports = router;

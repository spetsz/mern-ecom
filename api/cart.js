const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')

router.post('/', async (req , res)=>{

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

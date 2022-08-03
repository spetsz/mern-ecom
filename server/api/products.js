const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
require('dotenv').config()
const User = require('../models/User')
const Product = require('../models/Product')
const auth = require('./middleware/auth')
const mongoose = require( 'mongoose' )


const verifyAdmin = async (res,user_id) =>{

  
    // Finding user in database
    const user = await User.findById(user_id)
    
    // Checking if user exists 
    if(!user){

        return res.status(401).json({msg : "User does not exist"})
 
    // Checking if user has Admin level access
    }else if(user.isAdmin === false){

        return res.status(403).json({msg : "Operation requires admin access level!"})

    }

}


/* 

Method       : GET
Route        : /api/products/
Type         : PUBLIC
ACCESS_LEVEL : EVERYONE
Description  : Returns all products in db

*/


router.get('/' , async (req,res)=>{
    
    try {

        // Fetching all products from db
        const products = await Product.find()
        
        // Checking if products exist in db
        if(!products.length > 0){

            return res.json({msg : "No products available for now !"})
        }

        res.status(200).json(products)



    } catch (error) {
        console.error(error.message)
        res.status(500).json('Server error !')
    }



})


/* 

Method       : GET
Route        : /api/products/
Type         : PUBLIC
ACCESS_LEVEL : EVERYONE
Description  : Returns a single product given its id

*/

router.get('/:id', async (req,res)=>{

    const {id} = req.params

    try {

        // Fetching all products from db
        const product = await Product.findById(id)
        
        // Checking if products exist in db
        if(!product){

            return res.json({msg : "Product does not exist"})
        }

        res.status(200).json(product)



    } catch (error) {
        console.error(error.message)
        res.status(500).json('Server error !')
    }

})



/* 

Method       : POST
Route        : /api/products/add
Type         : PROTECTED
ACCESS_LEVEL : ADMIN
Description  : Adding a product to database

*/

router.post('/add', auth, 

// Request validation checks
[
    check("name", "Name of product can't be empty !").not().isEmpty(),
    check("images", "You must provide an image for the product !").not().isEmpty(),
    check("category", "What is the category for the product?").not().isEmpty(),
    check("description", "Description needed !").not().isEmpty(),
    check("price", "Price of product can't be empty !").not().isEmpty(),
    check("in_stock", "How many in stock!").not().isEmpty()

], async (req, res)=>{

    // Check if user is admin
    await verifyAdmin(res, req.user)

   

    // Checking errors in request's body
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(401).json(errors.array())
    }

    try {

        const {name, images, category, description, avg_rating, number_of_reviews, price, in_stock, reviews} = req.body

        // Creating boilerplate for product
        let productFields = {
            name,
            images,
            category,
            description,
            price,
            in_stock,
            avg_rating,
            number_of_reviews,
            reviews
        }

        // Initiating product
        const product = new Product(productFields)

        // Saving product to database
        await product.save()

        res.json(product)
        
    } catch (error) {
        console.error(error.message)
        res.json({msg : "Server errror"})
    }

})


/* 

Method       : DELETE
Route        : /api/products/delete/:id
Type         : PROTECTED
ACCESS_LEVEL : ADMIN
Description  : Removing products from database 

*/

router.delete('/delete/:id', auth, async (req, res)=>{



    await verifyAdmin(res, req.user)

    // Getting id from request's parameters
    const { id } = req.params

    if(!mongoose.isValidObjectId(id)){
        return res.status(401).json({msg : "Not a valid product ID"})
    }

    try {

        // Finding product in database
        const product = await Product.findById(id)
        
        // Checking if product exists in database
        if(!product){
            return res.status(404).json({msg : "Product not found"})
        }


        // Deleting product from database
        await product.delete()

        res.status(200).json({msg : "Product has been deleted"})
        
    } catch (error) {
        console.log(error.message)
        res.status(400).json({msg : "Server error!"})
    }

})



/* 

Method       : PUT
Route        : /api/products/update/:id
Type         : PROTECTED
ACCESS_LEVEL : ADMIN
Description  : Removing products from database 

*/

router.put('/update/:id', auth, [

    check('updates', 'What is it that you want to update?').not().isEmpty()

], async (req, res)=>{

    
    try {
    
        await verifyAdmin(res, req.user)

        // Getting id from request's parameters
        const { id } = req.params

        if(!mongoose.isValidObjectId(id)){
            return res.status(401).json({msg : "Not a valid product ID"})
        }

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(401).json(errors.array())
        }   

        const {updates} = req.body


      
        

    

        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({msg : "Product you're trying to update does not exist!"})
        }
        
        updates.forEach(update =>{
            const {field, value} = update
            product[field] = value
            
        })

        await product.save()

        res.json(product)


        
    } catch (error) {
        
        res.status(500).json('Server error')
        console.log(error.message)
    }


})





module.exports = router
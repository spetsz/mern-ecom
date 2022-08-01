const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5555
const app = express()
const cors = require('cors')
require('colors')
require('dotenv').config()


// Connecting to DB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, ()=>console.log('connected to database'.green.bold))


app.listen(PORT, ()=> console.log(`server running on PORT : ${PORT}`))



// Middlewares and APIs
app.use(cors({'origin': '*'}))
app.use(express.json())

app.use('/api/cart', require('./api/cart'))
app.use('/api/users', require('./api/users'))
app.use('/api/auth', require('./api/auth'))
app.use('/api/products', require('./api/products'))









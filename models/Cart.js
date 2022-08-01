const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Product: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }]
});


module.exports = Cart = mongoose.model('Cart', cartSchema)
const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({

  first_name: {
    type: String,
    required: true
  },

  last_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique :  true
  },

  password: {
    type: String,
    required: true
  },

  phone_number: {
    type: String
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default : false
  },

  cart: {
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'Product'
    }]
  },

  orders: [{
    shipping_address: {
      country: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      zip_code: {
        type: Number,
        required: true
      }
    },
    payment_method: {
      type: String,
      required: true
    },
    shipping_price: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      required: true
    },
    isDelivered: {
      type: Boolean,
      required: true
    }
  }]
});

module.exports = User = mongoose.model('User', userSchema)
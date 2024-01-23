const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

const orderSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  customer: { 
    type: Schema.Types.ObjectId, 
    ref: "Customer" 
  },
  quantity: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
    get: (value) => (value ? dayjs(value).format('MM/DD/YYYY') : null)
  },
  pickUp: {
    type: Boolean,
    required: true
  },
  pickUpDate: {
    type: Date,
    get: (value) => (value ? dayjs(value).format('MM/DD/YYYY') : null)
  },
  deliveryDate: {
    type: Date,
    get: (value) => (value ? dayjs(value).format('MM/DD/YYYY') : null)
  },
  deliveryAddress: {
    deliveryStreet1: {
      type: String,
      required: true
    },

    deliveryStreet2: {
      type: String,
      required: false
    },

    deliveryCity: {
      type: String,
      required: true
    },

    deliveryState: {
      type: String,
      required: true
    },

    deliveryZip: {
      type: String,
      required: true
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "SHIPPED", "READY_FOR_PICKUP", "DELIVERED", "PICKED_UP", "CANCELLED"]
  },
  notes: {
    type: String
  }
},

{
    toJSON: {
        virtuals: true,
        getters: true
    }
});

const Order = model('Order', orderSchema);

module.exports = Order;


const { Schema, model } = require('mongoose');

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
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  pickUp: {
    type: Boolean,
    required: true
  },
  pickUpDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  deliveryAddress: {
    type: String
  },
  deliveryCity: {
    type: String
  },
  deliveryState: {
    type: String
  },
  deliveryZip: {
    type: String
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


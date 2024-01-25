const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true,
        enum: ["IN_STOCK", "OUT_OF_STOCK"]
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    avgRating: {
        type: Number
    },
    category: {
        type: String,
        required: true,
        enum: ["BROWNIE_BITES", "COOKIE_DOUGH_BITES"]
    }
},

{
    toJSON: {
        virtuals: true,
        getters: true
    }
});

productSchema.index({ name: 'text' });
const Product = model('Product', productSchema);

module.exports = Product;
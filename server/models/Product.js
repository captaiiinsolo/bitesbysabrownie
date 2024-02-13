const { Schema, model } = require('mongoose');
const Review = require('./Review');

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
        type: Number,
        default: 0
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

productSchema.methods,calculateAvgRating = async function() {
    const reviews = await Review.find({ product: this._id });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    this.avgRating = avgRating;
    await this.save();

    return avgRating;
};

productSchema.index({ name: 'text' });
const Product = model('Product', productSchema);

module.exports = Product;
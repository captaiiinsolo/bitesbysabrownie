const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
},
{
    toJSON: {
        virtuals: true,
        getters: true
    }
});

const Review = model('Review', reviewSchema);

module.exports = Review;
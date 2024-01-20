const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

const reviewSchema = new Schema({
    customer: { 
        type: Schema.Types.ObjectId, 
        ref: "Customer"
      },
    content: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
        get: (value) => (value ? dayjs(value).format('MM/DD/YYYY') : null)
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
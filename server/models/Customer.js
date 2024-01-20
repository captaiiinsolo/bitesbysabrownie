const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new Schema({
    userType: {
        type: String,
        required: true,
        default: 'Customer'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=<>?/{}|\[\]~`])[a-zA-Z0-9!@#$%^&*()-_+=<>?/{}|\[\]~`]{8,16}$/

    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]


},

    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    });

// Hash the password before saving to the database
customerSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Create a virtual property `fullName` that gets customer's full name
customerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

customerSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text', city: 'text', state: 'text', zip: 'text' });

const Customer = model('Customer', customerSchema);

module.exports = Customer; 
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    userType: {
        type: String,
        required: true,
        default: 'Admin'
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
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
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
adminSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const Admin = model('Admin', adminSchema);

module.exports = Admin;
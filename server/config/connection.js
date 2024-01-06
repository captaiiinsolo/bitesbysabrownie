const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bitesBySabrownieDB',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

db.on('error', (err) => console.error(`MongoDB connection error: ${err}`));

db.once('open', () => {
    console.log('MongoDB connected successfully!');
});

module.exports = mongoose.connection;
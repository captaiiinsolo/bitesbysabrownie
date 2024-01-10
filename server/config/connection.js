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
    console.log('You have successfully connected to the Bites by Sabrownie DB!');
});

module.exports = mongoose.connection;
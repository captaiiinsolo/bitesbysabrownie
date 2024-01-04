const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:127.0.0.1:27017/bites-by-sabrownie-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

module.exports = mongoose.connection;
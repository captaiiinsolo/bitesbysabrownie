const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const expiration = '2h';

module.exports = {
    authMiddleware: function ([ req ]) {
        let toke = req.body.token || req.query.token || req.headers.authorization;
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        return req;
    },

    signToken: function ({ email, firstName, lastName, _id, userType }, redirectUrl) {
        const payload = { email, firstName, lastName, _id, userType, redirectUrl };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }
};
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, "DarwinBox", {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
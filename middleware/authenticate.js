const jwt = require('jsonwebtoken')

const secrets = require('../config/secrets')

module.exports = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (error, actualToken) => {
            if (error) {
                res.status(401).json({ message: 'Invalid Credentials' })
            } else {
                res.user = { id: actualToken.id, username: actualToken.username, is_land_owner: actualToken.is_land_owner }
                next()
            }
        })
    } else {
        res.status(401).json({ message: 'Forbidden Access!' });
    }
};
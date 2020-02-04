const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model')
const secrets = require('../config/secrets')

const loginBody = require('../middleware/login-body')
const loginUserExist = require('../middleware/login-user-exist')

const registerBody = require('../middleware/register-body')
const registerUserExist = require('../middleware/register-user-exist')

// ./api/auth/register
router.post('/register', registerBody, registerUserExist, (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash;
    
    Users.add(user)
        .then(response => {
            res.status(201).json({ message: `User created`, response})
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: `Error connecting with server`, error})
        })
})

// ./api/auth/login
router.post('/login', loginBody, loginUserExist, (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({ token, id: user.id, username: user.username, is_land_owner: user.is_land_owner});
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: `Couldn't connect to login service` });
        });
})

//creates Token
function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        is_land_owner: user.is_land_owner
    };

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
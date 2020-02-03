const Users = require('../users/users-model')

module.exports = (req, res, next) => {
    const { username } = req.body

    Users.findBy({ username})
        .then(response => {
            if(response.length > 0){
                res.status(400).json({ message: 'User Already Exists'})
            } else {
                next()
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error connecting with the server'})
        })
}
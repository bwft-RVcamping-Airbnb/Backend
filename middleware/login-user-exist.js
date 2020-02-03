const Users = require('../users/users-model')

module.exports = (req, res, next) => {
    const { username } = req.body

    Users.findBy({ username })
        .then(response => {
            if(response.length > 0){
                next()
            } else {
                res.status(404).json({ message: 'User not found'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error connecting with the server'})
        })
}
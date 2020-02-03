module.exports = (req ,res, next) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(400).json({ message: 'Missing req fields'})
    } else {
        next()
    }
}
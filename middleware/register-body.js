module.exports = (req ,res, next) => {
    const { username, password, is_land_owner} = req.body
    
    if(!username || !password || is_land_owner === undefined) {
        res.status(400).json({ message: 'Missing req fields'})
    } else {
        next()
    }
}
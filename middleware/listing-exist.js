const Listings = require('../listings/listings-model')

module.exports = (req, res, next) => {
    const { id } = req.params

    Listings.findById({ id })
        .then(listing => {
            if (listing) {
                next();
            } else {
                res.status(404).json({ message: `Listing does not exist` })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
}
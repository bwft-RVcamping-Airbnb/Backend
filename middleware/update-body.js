const Listings = require('../listings/listings-model')

module.exports = (req, res, next) => {
    const newListing = req.body
    const { id } = req.params

    Listings.findById({ id })
        .then(response => {
            // console.log('Old Listing', response)
            const updatedListing = {}
            updatedListing.location = newListing.location || response.location
            updatedListing.description = newListing.description || response.description
            updatedListing.price_per_day = newListing.price_per_day || response.price_per_day
            updatedListing.photo = newListing.photo || response.photo

            console.log(updatedListing)
        })
        .catch(error => {
            console.log(error)
        })

    next()
}
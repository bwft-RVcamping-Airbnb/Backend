const Reservations = require('../reservations/reservations-model')

module.exports = (req, res, next) => {
    const { id } = req.params

    Reservations.findById({ id })
        .then(reservation => {
            if (reservation) {
                next();
            } else {
                res.status(404).json({ message: `Reservation does not exist` })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
}
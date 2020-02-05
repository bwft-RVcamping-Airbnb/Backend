const Reservations = require('../reservations/reservations-model')

module.exports = (req, res, next) => {
    const startDate = new Date(req.body.reserve_date_start);
    const endDate = new Date(req.body.reserve_date_end);

    Reservations.findByListingId(req.params.id)
        .then(reservations => {
            console.log('Reservations THEN start', reservations)
            if (reservations.length === 0) {
                next();
            } else {
                let doesConflict = false;

                for (let i = 0; i < reservations.length; i++) {
                    const reservationStartDate = new Date(reservations[i].reserve_date_start);
                    const reservationEndDate = new Date(reservations[i].reserve_date_end)

                    if(reservationStartDate <= startDate && startDate <= reservationEndDate) {
                        doesConflict = true;
                        break;
                    }

                    if(reservationStartDate <= endDate && endDate <= reservationEndDate) {
                        doesConflict = true;
                        break;
                    }

                    if(reservationStartDate >= startDate && endDate >= reservationEndDate) {
                        doesConflict = true;
                        break;
                    }
                }
                if(doesConflict) {
                    res.status(400).json({ message: 'Conflicting reservations'})
                } else {
                    next();
                }
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
}
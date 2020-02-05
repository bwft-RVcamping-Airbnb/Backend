const Reservations = require('../reservations/reservations-model')

module.exports = (req, res, next) => {
    const startDate = new Date(req.body.reserve_date_start);
    const endDate = new Date(req.body.reserve_date_end);

    Reservations.findByListingId(req.params.listing_id)
        .then(reservations => {
            // console.log('Reservations UPDATE start', reservations)
            if (reservations.length === 0) {
                next();
            } else {
                let doesConflict = false;

                for (let i = 0; i < reservations.length; i++) {
                    const reservationStartDate = new Date(reservations[i].reserve_date_start);
                    const reservationEndDate = new Date(reservations[i].reserve_date_end)

                    // console.log('Current Reservation Id',Number(reservations[i].id))
                    // console.log('Sent Reservation Id', Number(req.params.id))
                    // console.log(Number(reservations[i].id) === Number(req.params.id))

                    if(Number(reservations[i].id) === Number(req.params.id)) {
                        console.log('Found Reservation')
                        continue;
                    }

                    if(reservationStartDate <= startDate && startDate <= reservationEndDate) {
                        console.log('Start Date In Between', reservations[i].id)
                        doesConflict = true;
                        break;
                    }

                    if(reservationStartDate <= endDate && endDate <= reservationEndDate) {
                        console.log('End Date In Between', reservations[i].id)
                        doesConflict = true;
                        break;
                    }

                    if(reservationStartDate >= startDate && endDate >= reservationEndDate) {
                        console.log('Start/End Date Outside of two dates', reservations[i].id)
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
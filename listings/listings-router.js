const router = require('express').Router();
//const AWS = require('aws-sdk')
//const path = require('path');
// const multer = require('multer');
// const upload = multer({
//     limits: { fileSize: 2097152},
//     storage: multer.memoryStorage()
// })
// const uuid = require('uuid');
require('dotenv').config();

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AwsAccessKeyId,
//     secretAccessKey: process.env.AwsSecretAccessKey,
//     apiVersion: '2006-03-01'
// });

const Listings = require('./listings-model')
const Reservations = require('../reservations/reservations-model')

const authenticate = require('../middleware/authenticate')

const isAvailable = require('../middleware/is-available')
const reservationExists = require('../middleware/reservation-exist.js')
const isAvailableUpdate = require('../middleware/reservation-update')

const updateBody = require('../middleware/update-body')
const locationExists = require('../middleware/listing-location-exist')
const listingExists = require('../middleware/listing-exist')

router.get('/', authenticate, (req, res) => {
    Listings.find()
        .then(listings => {
            res.status(200).json(listings)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.get('/:id', authenticate, (req, res) => {
    const { id } = req.params

    Listings.findById({ id })
        .then(listing => {
            if (listing) {
                if(res.user.is_land_owner){
                    Reservations.findByListingId(req.params.id)
                        .then(reservations => {
                            res.status(200).json({listing, reservations})
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(500).json(error)
                        })
                } else {
                    Reservations.findByListingIdUser(req.params.id, res.user.id)
                        .then(reservations => {
                            res.status(200).json({listing, reservations})
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(500).json(error)
                        })
                }
            } else {
                res.status(404).json({ message: `Listing does not exist` })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.post('/', authenticate, locationExists, (req, res) => {
    if (res.user.is_land_owner) {
        let listing = req.body
        listing.owner_id = res.user.id

        Listings.add(listing)
            .then(response => {
                res.status(201).json({ message: 'Listing created' })
            })
            .catch(error => {
                res.status(500).json({ message: 'Error connect with server' })
            })
    } else {
        res.status(401).json({ message: 'Logged in user has no access' })
    }
})

// router.post('/image', authenticate, upload.single('image'), locationExists, (req, res) => {

//     if (res.user.is_land_owner) {
//         let listing = req.body
//         listing.owner_id = res.user.id

//         if(!['image/gif','image/jpeg','image/jpg','image/png'].includes(req.file.mimetype)) {
//             return res.status(400).json({ message: 'Non-supported image file type'})
//         }
    
//         const file = path.parse(req.file.originalname)
//         if(!file.ext) {
//             return res.status(400).json({ message: 'No file extension provided'})
//         }
    
//         const Body = req.file.buffer;
//         const Bucket = process.env.AwsS3BucketName;
//         const Key = `${uuid()}${file.ext}`;
//         s3.upload({ Body, Bucket, Key }, (err, data) => {
//             console.log(err, data);
//             listing.photo = `${process.env.AwsCloudFrontHost}/${data.Key}`

//             console.log(listing)
//             Listings.add(listing)
//             .then(response => {
//                 res.status(201).json({ message: 'Listing created' })
//             })
//             .catch(error => {
//                 console.log(error)
//                 res.status(500).json({ message: 'Error connect with server' })
//             })
//         });
//     } else {
//         res.status(401).json({ message: 'Logged in user has no access' })
//     }

// })

router.delete('/:id', authenticate, (req, res) => {
    if (res.user.is_land_owner) {
        let { id } = req.params
        console.log(id)

        Listings.remove({ id })
            .then(response => {
                console.log(response)
                if (response) {
                    id = Number(id)
                    Reservations.removeByListingId(id)
                        .then(response => {
                            res.status(200).json({ message: 'Listing and reservations deleted'})
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(500).json({ message: 'Error connecting with the server'})
                        })
                } else {
                    res.status(404).json({ message: `Listing does not exist` })
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: 'Error connect with server' })
            })
    } else {
        res.status(401).json({ message: 'Logged in user has no access' })
    }
})

router.put('/:id', authenticate, updateBody, (req, res) => {

    if (res.user.is_land_owner) {
        const { id } = req.params
        const listing = req.body

        Listings.update({ id }, listing)
            .then(response => {
                if (response) {
                    res.status(200).json({ message: 'Listing updated' })
                } else {
                    res.status(404).json({ message: `Listing does not exist` })
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json(error)
            })
    } else {
        res.status(401).json({ message: 'Logged in user has no access' })
    }
})

router.get('/all/reservations', authenticate, (req, res) => {
    console.log(res.user.is_land_owner)
    if(!res.user.is_land_owner) {
        Reservations.findByUserId(res.user.id)
            .then(response => {
                res.status(200).json(response)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json(error)
            })
    } else {
        res.status(401).json({ message: 'Land Owners cannot have reservations'})
    }
})

router.get('/:id/reservations', authenticate, listingExists, (req, res) => {
    if(res.user.is_land_owner){
        Reservations.findByListingId(req.params.id)
            .then(response => {
                res.status(200).json(response)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json(error)
            })
    } else {
        Reservations.findByListingIdUser(req.params.id, res.user.id)
            .then(response => {
                res.status(200).json(response)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json(error)
            })
    }
})

router.post('/:id/reservations', authenticate, isAvailable, (req, res) => {
    if(!res.user.is_land_owner) {
        let reservation = req.body
    reservation.listing_id = Number(req.params.id)
    reservation.user_id = res.user.id
    
    Reservations.add(reservation)
        .then(response => {
            res.status(201).json({ message: 'Reservation created'})
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
    } else {
        res.status(401).json({ message: 'Land owners cannot make reservations'})
    }
})

router.delete("/reservations/:id", authenticate, reservationExists, (req, res) => {
    const { id } = req.params

    Reservations.remove({ id })
        .then(response => {
            res.status(200).json({ message: 'Reservation deleted'})
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

router.put("/:listing_id/reservations/:id", authenticate, isAvailableUpdate, (req, res) => {
    console.log(req.params)
    const { id }= req.params
    let reservation = req.body
    reservation.listing_id = Number(req.params.listing_id)
    reservation.user_id = res.user.id

    Reservations.update({ id }, reservation)
        .then(response => {
            if (response) {
                res.status(200).json({ message: 'Reservation updated' })
            } else {
                res.status(404).json({ message: `Reservation does not exist` })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })

})

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.json({ message: 'File too large...'});
    }
    next();
});

module.exports = router
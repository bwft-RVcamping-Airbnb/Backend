const db = require('../database/db-config')

module.exports = {
    add,
    findById,
    findByListingId,
    findByListingIdUser,
    findByUserId,
    remove,
    removeByListingId,
    update
}

function add(reservation) {
    return db('reservations').insert(reservation)
}

function findById(id) {
    return db('reservations').where(id).first()
}

function findByListingId(listing_id) {
    return db('reservations').where('listing_id', listing_id)
}

function findByListingIdUser(listing_id, user_id) {
    return db('reservations').where('listing_id', listing_id).where('user_id', user_id)
}

function findByUserId(user_id) {
    return db('reservations').where('user_id', user_id)
}

function remove(id) {
    return db('reservations').where(id).delete();
}

function removeByListingId(id) {
    return db('reservations').where('listing_id', id).delete()
}

function update(id, reservation) {
    return db('reservations').where(id).update(reservation)
}
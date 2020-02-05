const db = require('../database/db-config')

module.exports = {
    find,
    findBy,
    add,
    findById,
    remove,
    update
}

function find() {
    return db('listings')
}

function findBy(filter) {
    return db('listings').where(filter);
}

function add(listing) {
    return db('listings').insert(listing)
}

function findById(id) {
    return db('listings').where(id).first()
}

function remove(id) {
    return db('listings').where(id).delete()
}

function update(id, listing) {
    return db('listings').where(id).update(listing)
}
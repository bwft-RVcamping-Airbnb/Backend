const db = require('../database/db-config');

module.exports = {
    add,
    findBy,
    findById,
};

function findBy(filter) {
    return db('users').where(filter);
}

function add(user) {
    // const [id] = await 
    return db('users').insert(user);

    // return findById(id);
}

function findById(id) {
    return db('users')
        .select('id', 'username', 'is_land_owner', 'reserve_id', 'reserve_date_start', 'reserve_date_end')
        .where({ id })
        .first();
}
const db = require('../database/db-config')

module.exports = () => {
    return db.migrate.rollback()
        .then(() => db.migrate.latest())
}
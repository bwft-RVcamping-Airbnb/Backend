const express = require('express');
const cors = require('cors')
const helmet = require('helmet');

//const authRouter = require('../auth/auth-router')
//const listingRouter = require('../listings/listings-router')

const server = express();

server.use(helmet())
server.use(cors())
server.use(express.json());

//server.use('/api/auth', authRouter)
//server.use('/api/listings', listingRouter)

server.get('/', (req, res) => {
    res.status(200).json({ api: 'up' });
});

module.exports = server;
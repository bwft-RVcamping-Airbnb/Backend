const server = require('../api/server')
const request = require('supertest')

const prepTestDB = require('../utils/prepTestDB')

beforeEach(prepTestDB)

describe('User Onboarding', () => {
    it('POST /register 201 (Creates User)', async () => {
        const userRegister = {
            username: 'username',
            password: 'password',
            is_land_owner: false
        }

        const res = await request(server).post('/api/auth/register').send(userRegister)
        expect(res.status).toBe(201)
    })

    it('POST /register 400 (Missing Fields)', async () => {
        const userRegister = {
            username: 'username',
            password: 'password'
        }

        const res = await request(server).post('/api/auth/register').send(userRegister)
        expect(res.status).toBe(400)
    })

    it('POST /login 200 (Logs User In, and makes sure token is returned)', async () => {
        const userRegister = {
            username: 'username',
            password: 'password',
            is_land_owner: false
        }

        await request(server).post('/api/auth/register').send(userRegister)
        const res = await request(server).post('/api/auth/login').send({ username: 'username', password: 'password'})
        expect(res.status).toBe(200)
        expect(res.body.token).toBeTruthy()
    })

    it('POST /login 404 (User Not Found)', async () => {
        const userRegister = {
            username: 'username',
            password: 'password',
            is_land_owner: false
        }

        await request(server).post('/api/auth/register').send(userRegister)
        const res = await request(server).post('/api/auth/login').send({ username: 'wrong username', password: 'password'})
        expect(res.status).toBe(404)
    })
})
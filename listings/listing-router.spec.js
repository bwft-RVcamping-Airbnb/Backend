const server = require('../api/server')
const request = require('supertest')
const authenticate = require('../middleware/authenticate')
const locationExists = require('../middleware/listing-location-exist')

const prepTestDB = require('../utils/prepTestDB')

jest.mock('../middleware/authenticate')
jest.mock('../middleware/listing-location-exist')


beforeEach(prepTestDB)
beforeEach(() => {
    authenticate.mockClear()
    locationExists.mockClear()
})

describe('Listings', () => {
    it('GET / 200', async () => {
        authenticate.mockImplementationOnce((req, res, next) => {
            next()
        })

        const res = await request(server).get('/api/listings')
        expect(res.status).toBe(200)
    })

    it('POST / 201', async () => {
        const userRegister = {
            username: 'username',
            password: 'password',
            is_land_owner: true
        }

        await request(server).post('/api/auth/register').send(userRegister)


        authenticate.mockImplementationOnce((req, res, next) => {
            res.user = {
                id: 1,
                is_land_owner: true
            }
            next()
        })

        locationExists.mockImplementationOnce((req, res, next) => {
            next();
        })
        listingData = {
            location: "my street 7",
            description: "some desc",
            price_per_day: 20,
            photo: "a photo url"
        }

        const res = await request(server).post('/api/listings').send(listingData)
        expect(res.status).toBe(201)
    })
})
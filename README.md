# RV BnB Backend Docs

Heroku App URL (need before each method url): **https://rvairbnb.herokuapp.com**

### Links to endpoints
* Register User: .post() [/api/auth/register](#register)
* Login User: .post() [/api/auth/login](#login)
* Get Listings: .get() [/api/listings](#get-listings)
* Get Listing by Id: get() [/api/listings/:id](#get-specific-listing)
* Post Listings: .post() [/api/listings](#post-listing)
* Delete Listing: .delete() [/api/listings/:id](#delete-listing)
* Update Listing: .put() [/api/listings/:id](#update-listing)
* Get All Reservations: .get() [/api/listings/all/reservations](#get-reservations)
* Get Reservation by Listing Id: .get() [/api/listings/:id/reservations](#get-reservation-by-listing-id)
* Post Reservation: .post() [/api/listings/:id/reservations](#post-reservation)
* Delete Reservation: .delete() [/api/listings/reservations/:id](#delete-reservation)
* Update Reservation: .put() [api/listings/:listing_id/reservations/:id](#update-reservation)

***

# Register

**Register a user**

method url: **/api/auth/register**

http method: **[POST]**

**Body**

| name     | type   | required | description                       | 
| -------- | ------ | -------- | --------------------------------- |
| username | String | Yes      | Must be unique/ Must be < 24 char|
| password | String | Yes      | Must be < 24 char                |
| is_land_owner | Boolean | Yes | role of the user                 |

**Example
```
{
    username: 'justin',
    password: 'willy',
    is_land_owner: true
}
```

**Response** 201 (created)
```
{
    message: `User created`
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Login

**Login a user**

method url: **/api/auth/login**

http method: **[POST]**

**Body**

| name     | type   | required |
| -------- | ------ | -------- |
| username | String | Yes      |
| password | String | Yes      |

**Example**
```
{
    username: 'justin',
    password: 'willy'
}
```

**Response** 200 (ok)

```
{
    token: 'a super duper long jwt token',
    id: 1,
    username: 'justin',
    is_land_owner: 1(T) / 0(F)
}
```

401 (Unauthorized) **Example response**
```
{
    "message": "Invalid Credentials"
}
```

404 (not found) **Example response**
```
{
    "message": "User not found"
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Get Listings

**Gets listings**

method url: **/api/listings**

http method: **[GET]**

**Response** 200 (ok)
```
[
    {
        "id": 1,
        "owner_id": 1,
        "location": "my street 7",
        "description": "some desc",
        "price_per_day": 19.99,
        "photo": "a photo url"
    },
    {
        "id": 2,
        "owner_id": 1,
        "location": "my street 3",
        "description": "some desc update v2",
        "price_per_day": 19.99,
        "photo": "a photo url"
    },
    {
        "id": 3,
        "owner_id": 1,
        "location": "my street 4",
        "description": "some desc",
        "price_per_day": 19.99,
        "photo": "a photo url"
    }
]
```

* [Back to top](#rv-bnb-backend-docs)

***

# Get Specific Listing

**Gets a specific listing and returns reservations of specific listing**

**If a RV Owner requests this endpoint they are only given reservations tied to them**

**A Land Owner will get all reservations tied to the listing**

method url: **/api/listings/:id**

http method: **[GET]**

**Response** 200 (ok)
```
{
    "listing": {
        "id": 6,
        "owner_id": 1,
        "location": "my street 1",
        "description": "some desc",
        "price_per_day": 20,
        "photo": "a photo url"
    },
    "reservations": [
        {
            "id": 2,
            "listing_id": 1,
            "user_id": 1,
            "reserve_date_start": "2019-01-10T00:00:00.000Z",
            "reserve_date_end": "2019-01-16T00:00:00.000Z"
        },
        {
            "id": 3,
            "listing_id": 1,
            "user_id": 2,
            "reserve_date_start": "2019-01-17T00:00:00.000Z",
            "reserve_date_end": "2019-01-20T00:00:00.000Z"
        },
        {
            "id": 4,
            "listing_id": 1,
            "user_id": 2,
            "reserve_date_start": "2019-01-21T00:00:00.000Z",
            "reserve_date_end": "2019-01-26T00:00:00.000Z"
        }
    ]
}
```

404 (not found) **Example response**
```
{
    message: `Listing does not exist`
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Post Listing

method url: **/api/listings**

http method: **[POST]**

**Body**

| name     | type   | required |
| -------- | ------ | -------- |
| location | string | Yes (Unique)      |
| description | String | Yes      |
| price_per_day | decimal | Yes      |
| photo | String | Yes (Doesn't actually do anything)      |

**Example**
```
{
	"location": "my street 5",
	"description": "some desc",
	"price_per_day": 19.99,
	"photo": "a photo url"
}
```

**Response** 201 (created)

```
{
    message: 'Listing created'
}
```

401 (Unauthorized) **Example response**
```
{
    message: 'Logged in user has no access'
}
```

400 (location is no unique) **Example response**
```
{
    message: 'Location Already Exists'
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Delete Listing

**Deletes a listing and all reservations tied to the listing**

method url: **/api/listings/:id**

http method: **[DELETE]**

**Response** 200 (ok)
```
{
    message: 'Listing deleted' 
}
```

404 (not found) **Example response**
```
{
    message: `Listing does not exist`
}
```

401 (Unauthorized) **Example response**
```
{
    message: 'Logged in user has no access'
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Update Listing

**Does not need entire object, only the key: value that is being updated**

method url: **/api/listings/:id**

http method: **[PUT]**

**Body**

| name          | type    |
| ------------- | ------- |
| location      | string  |
| description   | String  |
| price_per_day | decimal |
| photo         | String  |

**Example**
```
{
	"price_per_day": 19.99
}
```

**Response** 200 (ok)
```
{
    message: 'Listing updated' 
}
```

404 (not found) **Example response**
```
{
    message: `Listing does not exist`
}
```

401 (Unauthorized) **Example response**
```
{
    message: 'Logged in user has no access'
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Get Reservations

**Gets all reservations**

**Only Rv Owners can request this end point, they get all the reservations tied to their id**

**See '/api/listings/:id/reservations' for Land Owners**

method url: **/api/listings/all/reservations**

http method: **[GET]**

**Response** 200 (ok)
```
[
    {
        "id": 36,
        "listing_id": 6,
        "user_id": 2,
        "reserve_date_start": "01/01/2019",
        "reserve_date_end": "01/03/2019"
    },
    {
        "id": 37,
        "listing_id": 5,
        "user_id": 2,
        "reserve_date_start": "01/20/2019",
        "reserve_date_end": "01/26/2019"
    }
]
```

401 (Unauthorized) **Example response**
```
{
    message: 'Land Owners cannot have reservations'
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Get Reservation By Listing Id

**Gets all reservations of a specific listing**

**Land Owners get all reservations on the listing**

**Rv Owners get the reservation(s) tied to their id**

method url: **/api/listings/:id/reservations**

http method: **[GET]**

**Response** 200 (ok)
```
[
    {
        "id": 33,
        "listing_id": 6,
        "user_id": 1,
        "reserve_date_start": "01/15/2019",
        "reserve_date_end": "01/20/2019"
    },
    {
        "id": 35,
        "listing_id": 6,
        "user_id": 1,
        "reserve_date_start": "01/13/2019",
        "reserve_date_end": "01/22/2019"
    },
    {
        "id": 36,
        "listing_id": 6,
        "user_id": 2,
        "reserve_date_start": "01/01/2019",
        "reserve_date_end": "01/03/2019"
    }
]
```

404 (Not Found) **Example response**
```
{
    message: `Listing does not exist`
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Post Reservation

**Posting a reservation to a listing**

**Land Owners cannot POST reservations**

method url: **/api/listings/:id/reservations**

http method: **[POST]**

**Body**

| name     | type   | required |
| -------- | ------ | -------- |
| reserve_date_start | string | Yes (mm/dd/yyyy) |
| reserve_date_end | String | Yes (mm/dd/yyyy) |

**Example**
```
{
    	"reserve_date_start": "01/15/2019",
    	"reserve_date_end": "01/17/2019"
}
```

**Response** 201 (created)

```
{
    "message": "Reservation created"
}
```

401 (Unauthorized) **Example response**
```
{
    message: 'Land owners cannot make reservations'
}
```

400 (date conflicts) **Example response**
```
{
    message: 'Conflicting reservations'
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Delete Reservation

**Deletes a specific reservation**

method url: **/api/listings/reservations/:id**

http method: **[DELETE]**

**Response** 200 (ok)
```
{
    message: 'Listing deleted' 
}
```

404 (not found) **Example response**
```
{
    message: `Reservation does not exist`
}
```

* [Back to top](#rv-bnb-backend-docs)

***

# Update Reservation

method url: **api/listings/:listing_id/reservations/:id**

http method: **[PUT]**

**Body**

| name     | type   | required |
| -------- | ------ | -------- |
| reserve_date_start | string | Yes (mm/dd/yyyy) |
| reserve_date_end | String | Yes (mm/dd/yyyy) |

**Example**
```
{
	"reserve_date_start": "01/02/2019",
    	"reserve_date_end": "01/05/2019"
}
```

**Response** 200 (ok)
```
{
    message: 'Reservation updated' 
}
```

404 (not found) **Example response**
```
{
    message: `Reservation does not exist`
}
```

400 **Example response**
```
{
    message: 'Conflicting reservations'
}
```

* [Back to top](#rv-bnb-backend-docs)

***
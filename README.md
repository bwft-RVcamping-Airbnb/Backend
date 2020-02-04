# RV BnB Backend Docs

Heroku App URL (need before each method url): **https://rvairbnb.herokuapp.com**

### Links to endpoints
* Register User: .post() [/api/auth/register](#register)
* Login User: .post() [/api/auth/login](#login)

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
    password: 'williams',
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
    password: 'williams'
}
```

**Response** 200 (ok)

```
{
    token: 'a super duper long jwt token',
    id: 1,
    username: 'andrew',
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
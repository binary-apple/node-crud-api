# CRUD-API

## Installing
1. Use 20 LTS version of Node.js   
2. Clone this repository locally: https://github.com/binary-apple/node-crud-api
3. Go to folder ``node-crud-api``  
4. Install all dependencies by using ``npm install``

---

## Running scripts
Use npm-scripts to run the app or tests
```bash
# run app in production mode
$ npm run start:prod

# run app in develop mode
$ npm run start:dev

# run tests
$ npm run test
```

To finish program work use ``ctrl + c``

---

## Usage
1. Run the app in production mode
2. Now you can send requests to the address: `http://localhost:4000`

    - **GET** `api/users` is used to get all persons
        -  Server answers with `status code` **200** and all users records
    - **GET** `api/users/{userId}` 
        -  Server answers with `status code` **200** and record with `id === userId` if it exists
        -  Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -  Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        -  Server answers with `status code` **201** and newly created record
        -  Server answers with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    - **PUT** `api/users/{userId}` is used to update existing user
        -  Server answers with` status code` **200** and updated record
        -  Server answers with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -  Server answers with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        -  Server answers with `status code` **204** if the record is found and deleted
        -  Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -  Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - All other requests as well as requests to non-existing endpoints (e.g. some-non/existing/resource) are handled corresponding (server answers with status code **404** and corresponding human-friendly message)
    - For correct creating/updating user the request body of **POST** and **PUT** methods must be contain following properties:
        - `username` — user's name (`string`, **required**)
        - `age` — user's age (`number`, **required**)
        - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
    - Errors on the server side that occur during the processing of a request are handled and processed correctly (server answers with status code **500** and corresponding human-friendly message)
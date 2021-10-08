const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

//! Middlewares
app.use(bodyParser.json());
app.use(cors());

//! Database variable used for tests
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'cookies',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date() // Creates a date when executed
        },
        {
            id: '124',
            name: 'Sally',
            password: 'bananas',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date() // Creates a date when executed
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
});

//! signin --> POST
app.post('/signin', (req, res) => {
        //? bcrypt FUNCTIONS - Comparing hashes
    // Load hash from your password DB.
    // bcrypt.compare("apples", '$2a$10$amYd/ZNevhycRNgP5KA5oOSnzYvDBX7IBQ9wRmojBXd0rAHtC6rDa', function(err, res) {
    //     // res == true
    //     console.log('first guess', res);
    // });
    // bcrypt.compare("veggies", '$2a$10$amYd/ZNevhycRNgP5KA5oOSnzYvDBX7IBQ9wRmojBXd0rAHtC6rDa', function(err, res) {
    //     // res = false
    //     console.log('second guess', res);
    // });

        //? Getting the data from body in Postman
        //? I must use 'bodyParser' in order to use JSON
    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password){
           res.json(database.users[0]);
       } else{
           res.status(400).json('Error logging in');
       }
    //res.json('signing'); //? Sending message to /signin
})

//! register --> POST
app.post('/register', (req, res) => {
        //? Destructuring variables from 'req.body'
    const { email, name, password } = req.body;

    //     //? Hashing the entered password
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

        //? Creating a new user and pushing to database
    database.users.push({
        id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    });
        //? Returning the response (always send it)
    res.json(database.users[database.users.length-1]);
});

//! profile --> GET
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
        //? Searching for the user id
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }         
    });
    if(!found) res.status(400).json('No such user');
});

//! image --> PUT
app.put('/image', (req, res) => {
    const { id } = req.body;
        //? Searching for the user id
    let found = false;

        //? If I find the user, I'll increase +1 on 'entries'
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }         
    });
    if(!found){
        res.status(400).json('No such user');
    }
});

//! bcrypt FUNCTIONS
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/**
 * ! --> res = this is working
 * ! /signin          --> POST = success/fail = OK =
 * ! /register        --> POST = user         = OK =
 * ! /profile/:userId --> GET = user          = OK =
 * ! /image           --> PUT --> user
 */
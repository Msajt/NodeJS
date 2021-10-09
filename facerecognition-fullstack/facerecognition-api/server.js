const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//! Inicializando o 'knex.js'
const knex = require('knex');
const { json } = require('body-parser');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'smartbrain'
    }
});

//! Verificando o que há dentro do banco de dados
// db.select('*').from('users')
//     .then(data => {
//         console.log(data);
//     })

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
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
                return db.select('*').from('users')
                         .where('email', '=', req.body.email)
                         .then(user => {
                            res.json(user[0]);
                         })
                         .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }  
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})

//! register --> POST
app.post('/register', (req, res) => {
        //? Destructuring variables from 'req.body'
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date() 
                    })
                    .then(user => {
                            //? Returning the response (always send it)
                        res.json(user[0]);
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'));
});

//! profile --> GET
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
        //? Searching for the user id
    ////let found = false;

    //// database.users.forEach(user => {
    ////     if(user.id === id){
    ////         found = true;
    ////         return res.json(user);
    ////     }         
    //// });

    db.select('*').from('users')
        .where({
            id: id
        })
        .then(user => {
            if(user.length) res.json(user[0]);
                else res.status(400).json('Not found')
        })
        .catch(err => res.status(400).json('Error getting user'));

    ////if(!found) res.status(400).json('No such user');
});

//! image --> PUT
app.put('/image', (req, res) => {
    const { id } = req.body;
    
        //? Toda vez que faço um request entries++
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
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
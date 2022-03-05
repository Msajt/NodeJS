const mongoose = require('mongoose');

require('dotenv').config();

//! Definindo url do MongoDB
const MONGO_URL = process.env.MONGO_URL;

//! Event Emitters para o Mongoose
    //? Quando inicializa
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
    //? Caso de erro
mongoose.connection.on('error', (err) => {
    console.error(`There was an error\n${err}`);
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}
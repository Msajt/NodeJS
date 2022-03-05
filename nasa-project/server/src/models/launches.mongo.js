//! Importando o 'mongoose'
const mongoose = require('mongoose');

//! Definindo o 'schema' dos lançamentos
const launchesSchema = new mongoose.Schema({
    //? Definição dos dados do modelo
        //* data: data_type
        //* data: { definitions }
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        require: true,
    },
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});

//! Definindo o modelo (conecta o launchesSchema com 'launches' collection)
module.exports = mongoose.model('Launch', launchesSchema);
//! Importando o 'mongoose'
const mongoose = require('mongoose');

//! Definindo o 'schema' para os planetas
const planetSchema = new mongoose.Schema({
    //? Definindo os dados, será apenas os planetas
    keplerName: {
        type: String,
        required: true,
    }
});

//! Definindo o modelo para os planetas e exportando
module.exports = mongoose.model('Planet', planetSchema);
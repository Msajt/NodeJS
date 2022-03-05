const express = require('express');
//! Importando os routers
    //? Router dos planetas
const planetsRouter = require('./planets/planets.router');
    //? Router dos lançamentos
const launchesRouter = require('./launches/launches.router');

//! Definindo o router do API
const api = express.Router();

//? Gerenciando os routers
    //* planetas
api.use('/planets', planetsRouter);
    //* lançamentos
api.use('/launches', launchesRouter);

//! Exportando as rotas do API
module.exports = api;
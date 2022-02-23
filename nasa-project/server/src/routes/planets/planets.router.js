//! Importando o express
const express = require('express');

//! Importando os 'controllers'
    //? Controller dos planetas
const { httpGetAllPlanets } = require('./planets.controller');

//! Definindo os 'routers'
    //? Router dos planetas
const planetsRouter = express.Router();

//? Definindo método GET em /planets
planetsRouter.get('/', httpGetAllPlanets);

//! Exportando o 'router'
module.exports = planetsRouter;
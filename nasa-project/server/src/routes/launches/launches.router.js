//! Importando o express
const express = require('express');
//! Importando o 'controller'
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

//! Definindo o router dos lançamentos
const launchesRouter = express.Router();

//? Método 'GET' - Coletando os lançamentos
launchesRouter.get('/', httpGetAllLaunches);
//? Método 'POST' - Adicionando novo lançamento
launchesRouter.post('/', httpAddNewLaunch);
//? Método 'DELETE' - Deletando um lançamento
launchesRouter.delete('/:id', httpAbortLaunch);

//! Exportando o router
module.exports = launchesRouter

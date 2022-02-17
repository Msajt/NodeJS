//! Importando 'express'
const express = require('express');
//! Importando 'messagesController'
const messagesController = require('../controllers/messages.controller');

//? Definindo o router
const messagesRouter = express.Router();

//! Definindo GET em /messages
messagesRouter.get('/', messagesController.getMessages);
//! Definindo POST em /messages
messagesRouter.post('/', messagesController.postMessage);

//! EXPORTANDO O MÓDULO
//? Só preciso importar a variável da rota
module.exports = messagesRouter
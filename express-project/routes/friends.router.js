//! Importando 'express'
const express = require('express');
//! Importando 'friendsController'
const friendsController = require('../controllers/friends.controller');

//? Routers no express, são middlewares do express
const friendsRouter = express.Router();

//! Middleware dentro do router para exibir o IP
friendsRouter.use((req, res, next) => {
    //? Exibindo o ip do usuário no console
    console.log(`IP Adress: ${req.ip}`);
    //? Função 'next'
    next();
})
//! Definindo POST em /friends
friendsRouter.post('/', friendsController.postFriend);
//! Definindo GET em /friends
friendsRouter.get('/', friendsController.getFriends);
//! Definindo GET para um amigo específico da lista
friendsRouter.get('/:friendId', friendsController.getFriend);

//! EXPORTANDO O MÓDULO
//? Só preciso importar a variável da rota
module.exports = friendsRouter;
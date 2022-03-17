//! Importando 'http', 'io'
const http = require('http');
const io = require('socket.io');

//! Importando api
const apiServer = require('./api');
//! Definindo o servidor usando o módulo 'http'
const httpServer = http.createServer(apiServer);
//! Importando 'socket.io'
const socketServer = io(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
//! Importando as funções do 'socket.io'
const sockets = require('./sockets');

//! Definindo a porta do servidor
const PORT = 3000;

//! Servidor fazendo o listening
httpServer.listen(PORT);
//? Exibindo mensagem no terminal
console.log(`Listening on port ${PORT}...`);

//? Funções do socket.io
sockets.listen(socketServer);


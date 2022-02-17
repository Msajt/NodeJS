//! Importando o express e path
const express = require('express');
const path = require('path');
//! Importando as rotas para 'friends' e 'messages'
const friendsRouter = require('./routes/friends.router');
const messagesRouter = require('./routes/messages.router');

//! Criando o servidor com express e definindo a porta
const app = express();
//? Setando o view engine ('view engine', 'view template installed')
app.set('view engine', 'hbs');
//? Templates
app.set('views', path.join(__dirname, 'views'));

const PORT = 3000;

//! Criando um middleware que faz o log dos requests e nos diz
//! quanto tempo demorou para ser completado
//? Iniciando o middleware
app.use((req, res, next) => {
    //? Pegando o tempo que iniciou
    const start = Date.now();

    //? Método 'next', vai passar pelo requests abaixo e retornar
    next();
    
    //? Retorno do tempo final da execução do request feito
    const delta = Date.now() - start;
    //? Exibindo no console o método do request, endereço base, endereço e tempo levado
    console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
});

//? Middleware que possibilita fazer o host de uma página estática
//? Com a mudança os arquivos são usados só pra capturar seu endereço para serem usados no 'index.hbs'
//* A página estará disponível em '/site'
app.use('/site', express.static(path.join(__dirname, 'public')));

//? Iniciando um novo middleware para transformar POST em JSON
app.use(express.json());

//! Com express, não é necessário definir Content-Type
//? Definindo middleware para a rota '/', '/friends' e '/messages'
app.get('/', (req, res) => {
    //? Renderizando a página HTML e definindo as variáveis definidas no arquivo .hbs
    res.render('index', {
        title: 'My Friends Are Very Clever',
        caption: `Let's go skiing!`,
    })
});
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

//! Servidor captando os requests
app.listen(PORT, () => {
    //? Mensagem no console
    console.log(`Listening on ${PORT}...`);
});
//! Importando o 'express', 'cors', 'path', 'morgan'
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

//! Importando os routers
    //? Router dos planetas
const planetsRouter = require('./routes/planets/planets.router');
    //? Router dos lançamentos
const launchesRouter = require('./routes/launches/launches.router');

//! Iniciando o express
const app = express();

//? Inicializando o CORS, para poder conversar com o frontend
app.use(cors({
    origin: 'http://localhost:3000',
}));
//?Inicializando o morgan, funciona pegando os logs dos requests feitos
app.use(morgan('combined'));

//? express.json() vai analisar os JSONs vindos
app.use(express.json());
//? Fazendo o host dos arquivos do frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

//? Gerenciando os routers
    //* planetas
app.use('/planets', planetsRouter);
    //* lançamentos
app.use('/launches', launchesRouter);
//? Quando eu requisitar a raiz, o servidor me disponibiliza o index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;
//! Definindo 'express', 'path'
const express = require('express');
const path = require('path');

//! Definindo api
const api = express();

//? Hosteando o frontend
api.use(express.static(path.join(__dirname, 'public')));
//? Localização do frontend
api.use('/', express.static('index.html'));

//! Exportando 'api'
module.exports = api;
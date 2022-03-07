//! Importando os módulos de 'fs', 'https', 'path' e 'express'
const fs = require('fs')
const https = require('https');
const path = require('path');
const express = require('express');
//! Importando o middleware 'helmet'
const helmet = require('helmet');
//! Importando o middleware 'passport'
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
//! Importando o middleware 'cookie-session'
const cookieSession = require('cookie-session');
const { verify } = require('crypto');

//! Importando o dotenv
require('dotenv').config();

//! Definindo a porta do servidor
const PORT = 3000;

//! Definindo configurações de API do Google
const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};
//! Definindo configurações do passport
const AUTH_OPTIONS = {
    //? Definindo as opções do 'Strategy'
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

//! Função para verificar callback do google
function verifyCallback(accessToken, refreshToken, profile, done){
    //? Exibe o usuário que logou no console
    console.log('Google profile', profile);
    //? Usuário está logado
    done(null, profile);
}
//? Inicializando o strategy do passport para OAuth
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));
//? Fazendo o 'serializing' (Save the session to cookie)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//? Fazendo o 'deserializing' (Read the session from the cookie)
passport.deserializeUser((id, done) => {
    // User.findById().then(user => {
    //     done(null, obj);
    // });
    done(null, id);
});

//! Definindo o 'app' com 'express()'
const app = express();

//? Inicializando o helmet
app.use(helmet());
//? Inicializando o cookie-session
app.use(cookieSession({
    //* Definindo opções
    name: 'session',
    maxAge: 24*60*60*1000, // 1 dia logado
    keys: [ config.COOKIE_KEY_1, config.COOKIE_KEY_2 ],
}))
//? Inicializando o passport e o session
app.use(passport.initialize());
app.use(passport.session())

//? Verificação de login do usuário
function checkLoggedIn(req, res, next){
    console.log('Current user is:', req.user);
    const isLoggedIn = req.isAuthenticated() && req.user; //TODO
    if(!isLoggedIn){
        return res.status(401).json({
            error: 'You must log in',
        });
    }
    next();
}

//! Login do usuário, callback do google e logout
app.get('/auth/google', 
    passport.authenticate('google', {
        //? Request de dados
        scope: ['email'],
    })
);
app.get('/auth/google/callback', 
    passport.authenticate('google', {
        //? Caso de falha
        failureRedirect: '/failure',
        //? Caso de sucesso
        successRedirect: '/',
        //? Definindo 'session'
        session: true,
    }), 
    (req, res) => {
        //? Mensagem para o console
        console.log('Google called us back');
    }
);
app.get('/auth/logout', (req, res) => {
    //? Vai limpar os sessions e remover 'req.user'
    req.logout();
    //? Retornando a raiz
    return res.redirect('/');
});

//! Definindo o método GET na rota /secret
    //? Vou passar o middleware pra ser usado somente em '/secret'
app.get('/secret', checkLoggedIn, (req, res) => {
    //? Enviando mensagem para servidor
    return res.send('Your personal secret value is 42');
});

//! Definindo o método GET na rota da raiz
app.get('/', (req, res) => {
    //? Server hostea o arquivo 'index.html'
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//! Definindo o método GET para caso autenticação falhe
app.get('/failure', (req, res) => {
    //? Mensagem na tela
    return res.send('Failed to log in');
});

//! Servidor fazendo o listen na porta definida
    //? Criando um servidor com protocolo HTTPS
https.createServer({
    //? Definindo a key e o certificado (OpenSSL)
        //* openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
    //? Mensagem para exibir a porta do servidor
    console.log(`Listening on port ${PORT}`);
});
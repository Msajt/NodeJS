//! Importando o módulo 'path' para auxiliar com a localização dos arquivos
const path = require('path');

//! Escreva as funções nesse formato para ficar melhor ao debugar
function getMessages(req, res){
    //? .join pra auxiliar o caminho do arquivo em diferentes SO
    //? __dirname aponta pra pasta do arquivo
    //? Exibir um arquivo no browser
    //res.sendFile(path.join(__dirname, '..', 'public', 'images', 'skimountain.jpg'));

    //? Fazendo render de uma mensagem para o index
    res.render('messages', {
        title: 'Messages to my friends',
        friend: 'Elon Musk',
    })

    //? Servidor irá exibir esse HTML
    //res.send('<ul><li>Hello Albert!</li></ul>');
}

function postMessage(req, res){
    //? Irá exibir no console essa mensagem
    console.log('Updating messages...');
}

//! EXPORTANDO AS FUNÇÕES DE messages.controller
module.exports = {
    getMessages,
    postMessage,
};
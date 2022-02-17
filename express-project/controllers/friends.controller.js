//! Importando lista de amigos na memória
const model = require('../models/friends.model');

function postFriend(req, res){
    //! Definindo condições para criação de um novo amigo
    if(!req.body.name){
        //? Como já foi definido o response, não posso enviar um outro depois
        return res.status(400).json({
            error: 'Missing friend name'
        });
    }
    //? Criando um novo amigo
    const newFriend = {
        name: req.body.name,
        id: model.length,
    };
    //? Adicionando amigo na lista
    model.push(newFriend);

    //? Exibe na tela o novo amigo adicionado
    res.json(newFriend)
}

function getFriends(req, res){
    //? Exibindo a lista de amigos e será tratada como um JSON
    res.json(model);
}

function getFriend(req, res){
    //? A variável se refere ao ':friendId' escrito no request
    const friendId = Number(req.params.friendId);
    //? Pegando os dados no elemento da lista
    const friend = model[friendId];

    //? Verificando se o usuário realmente existe, caso seja 'undefined' o if é falso
        //* Também já defino um status da mensagem
    if(friend) res.status(200).json(friend);
    else res.status(404).json({
        error: 'Friend does not exist',
    });
}

//! EXPORTANDO AS FUNÇÕES DE friends.controller
module.exports = {
    postFriend,
    getFriend,
    getFriends,
}
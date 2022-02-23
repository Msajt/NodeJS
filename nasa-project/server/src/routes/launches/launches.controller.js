//! Importando os dados de lançamentos
const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

//! Função que retorna os lançamentos
function httpGetAllLaunches(req, res){
    //? Pega os valores do map de lançamentos e o transforma em array para poder exibir em JSON
    res.status(200).json(Array.from(getAllLaunches()));
}

//! Função que envia o método para adicionar lançamento
function httpAddNewLaunch(req, res){
    //? Coletando o valor do request
    const launch = req.body

    //? Checando se os dados estão ok
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        //* Servidor respondendo com Bad Request
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }

    //? O request vem como string, passando para um 'Data object'
    launch.launchDate = new Date(launch.launchDate);
    //? Checando se a data está ok
    if(isNaN(launch.launchDate)){
        //* Servidor respondendo com Bad Request
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    
    //? Adicionando o novo lançamento no banco de dados
    addNewLaunch(launch);

    //? Servidor responde com sucesso (201 - Created)
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    //? Pegando o id do lançamento
    const launchId = Number(req.params.id);

    //? Se o lançamento não existir
    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({
            error: 'Launch not found',
        })
    }

    //? Se o lançamento existir
    const aborted = abortLaunchById(launchId);
    //? Retornando status de sucesso 
    return res.status(200).json(aborted);
}

//! Exportando o módulo
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
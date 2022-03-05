//! Importando os dados de lançamentos
const { getAllLaunches, existsLaunchWithId, abortLaunchById, scheduleNewLaunch } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

//! Função que retorna os lançamentos
async function httpGetAllLaunches(req, res){
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    
    //? Pega os valores do map de lançamentos e o transforma em array para poder exibir em JSON
    res.status(200).json(Array.from(launches));
}

//! Função que envia o método para adicionar lançamento
async function httpAddNewLaunch(req, res){
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
    await scheduleNewLaunch(launch);
    console.log(launch);

    //? Servidor responde com sucesso (201 - Created)
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
    //? Pegando o id do lançamento
    const launchId = Number(req.params.id);
    
    //? Verificando se o lançamento existe
    const existsLaunch = await existsLaunchWithId(launchId);

    //? Se o lançamento não existir
    if(!existsLaunch){
        return res.status(404).json({
            error: 'Launch not found',
        })
    }

    //? Se o lançamento existir
    const aborted = await abortLaunchById(launchId);

    //? Caso de erro
    if(!aborted) return res.status(400).json({
        error: 'Launch not aborted',
    })
    //? Retornando status de sucesso 
    return res.status(200).json({
        ok: true,
    });
}

//! Exportando o módulo
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
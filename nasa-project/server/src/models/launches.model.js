//! Importando o axios para gerenciar os requests da API do SpaceX
const axios = require('axios');

//! Importando o modelo do mongoose para lançamentos
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

//! Fazendo o modelo para os dados de cada lançamento
    //? Variável que vai abrigar os lançamentos
//const launches = new Map();

//let latestFlightNumber = 100;

//     //? Variável que abriga o lançamento
// const launch = {
//     flightNumber: 100, // flight_number
//     mission: 'Kepler Exploration X', // name
//     rocket: 'Explorer IS1', // rocket.name
//     launchDate: new Date('December 27, 2030'), // date_local
//     target: 'Kepler-442 b', // not applicable
//     customers: ['ZTM', 'NASA'], // payload.customers
//     upcoming: true, // upcoming
//     success: true, // success
// };

    //? Inserindo os dados em lançamentos
        //* Seto uma propriedade e a variável para inserir
//launches.set(launch.flightNumber, launch);
    //? Substituindo a função anterior para o banco de dados
//saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

//! Adicionando lançamentos para o banco
async function populateLaunches(){
    console.log('Donwloading launch data...');

    //? Coletando os dados
    const response = await axios.post(SPACEX_API_URL, {  
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    //? Validando status
    if(response.status !== 200) {
        console.log('Problem on downloading data');
        throw new Error('Launch data download failed!');
    }

    //? Dados do body em JSON
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);

        //TODO --> Adicionar lançamentos no banco
        await saveLaunch(launch);
    }
}

//! Função para carregar os dados
async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    
    if(firstLaunch) console.log('Launch data already loaded!!');
        else await populateLaunches();
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

//! Verificando se existe um determinado lançamento
async function existsLaunchWithId(launchId){
    //? Verificando se no Map() há determinado lançamento
    //return launches.has(launchId); // boolean
    //? Verificando se no banco de dados há o ID correspondente
    return await findLaunch({
        flightNumber: launchId,
    });
}

//! Função para retornar o ID do lançamento
async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber'); // default asc, -variable -> desc

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

//! Exportando os dados pela função
async function getAllLaunches(skip, limit){
    //? Pega os valores do map de lançamentos e o transforma em array
    //return Array.from(launches.values());
    //? Retorna os lançamentos do banco de dados
    return await launchesDatabase
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

//! Função que vai salvar o lançamento adicionado
async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

//! Função para adicionar novo lançamento com MongoDB
async function scheduleNewLaunch(launch){
    //? Verificação se planeta existe
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found!');
    }
    
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

// //! Função que vai adicionar novo lançamento
// function addNewLaunch(launch){
//     //? Vai definir a id do lançamento
//     latestFlightNumber++;
//     //? Setando o novo elemento do Map()
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', 'Nasa'],
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

//! Função que aborta o lançamento
async function abortLaunchById(launchId){
    //? Atualizando os dados do lançamento
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
    
    // //? Definindo o lançamento abortado
    // const aborted = launches.get(launchId);
    // //? Trocando o estado de 'upcoming' e 'success'
    // aborted.upcoming = false;
    // aborted.success = false;

    // //? Retornando o objeto
    // return aborted;
}

//! Exportando os dados
module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    abortLaunchById,
}
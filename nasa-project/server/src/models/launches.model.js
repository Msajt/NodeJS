//TODO Estocar os dados dos lançamentos feitos no frontend
//! Importando o modelo do mongoose para lançamentos
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

//! Fazendo o modelo para os dados de cada lançamento
    //? Variável que vai abrigar os lançamentos
//const launches = new Map();

//let latestFlightNumber = 100;

    //? Variável que abriga o lançamento
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

    //? Inserindo os dados em lançamentos
        //* Seto uma propriedade e a variável para inserir
//launches.set(launch.flightNumber, launch);
    //? Substituindo a função anterior para o banco de dados
saveLaunch(launch);

//! Verificando se existe um determinado lançamento
async function existsLaunchWithId(launchId){
    //? Verificando se no Map() há determinado lançamento
    //return launches.has(launchId); // boolean
    //? Verificando se no banco de dados há o ID correspondente
    return await launchesDatabase.findOne({
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
async function getAllLaunches(){
    //? Pega os valores do map de lançamentos e o transforma em array
    //return Array.from(launches.values());
    //? Retorna os lançamentos do banco de dados
    return await launchesDatabase
        .find({}, { '_id': 0, '__v': 0 });
}

//! Função que vai salvar o lançamento adicionado
async function saveLaunch(launch){
    //? Verificação se planeta existe
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found!');
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

//! Função para adicionar novo lançamento com MongoDB
async function scheduleNewLaunch(launch){
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
    existsLaunchWithId,
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    abortLaunchById,
}
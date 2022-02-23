//TODO Estocar os dados dos lançamentos feitos no frontend
//! Fazendo o modelo para os dados de cada lançamento
    //? Variável que vai abrigar os lançamentos
const launches = new Map();

let latestFlightNumber = 100;

    //? Variável que abriga o lançamento
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

    //? Inserindo os dados em lançamentos
        //* Seto uma propriedade e a variável para inserir
launches.set(launch.flightNumber, launch);

//! Verificando se existe um determinado lançamento
function existsLaunchWithId(launchId){
    //? Verificando se no Map() há determinado lançamento
    return launches.has(launchId); // boolean
}

//! Exportando os dados pela função
function getAllLaunches(){
    //? Pega os valores do map de lançamentos e o transforma em array
    return Array.from(launches.values());
}

//! Função que vai adicionar novo lançamento
function addNewLaunch(launch){
    //? Vai definir a id do lançamento
    latestFlightNumber++;
    //? Setando o novo elemento do Map()
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            success: true,
            upcoming: true,
            customers: ['Zero to Mastery', 'Nasa'],
            flightNumber: latestFlightNumber,
        })
    );
}

function abortLaunchById(launchId){
    //? Definindo o lançamento abortado
    const aborted = launches.get(launchId);
    //? Trocando o estado de 'upcoming' e 'success'
    aborted.upcoming = false;
    aborted.success = false;

    //? Retornando o objeto
    return aborted;
}

//! Exportando os dados
module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}
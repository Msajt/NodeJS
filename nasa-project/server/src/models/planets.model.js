//! Requirindo o módulo 'fs' para auxiliar no funcionamento do módulo acima
const fs = require('fs');
//! Requirindo o módulo 'path'
const path = require('path');
//! Requirindo o módulo 'csv-parse'
const { parse } = require('csv-parse');
//! Importando o schema do mongoose dos planetas
const planets = require('./planets.mongo');

//! Array contendo os dados do .csv do Kepler
//const habitablePlanets = [];

//! Construindo uma função para verificar se o planeta é habitável
function isHabitablePlanet(planet){
    //? Verificando se o status do parametro do objeto é 'CONFIRMED'
    //? Verificando se o fluxo de insolação está no intervalo correto para haver vida
    //? Verificando se o tamanho é suficiente para não ser um gigante gasoso
    return planet['koi_disposition'] === 'CONFIRMED' &&
           planet['koi_insol'] > 0.36 &&
           planet['koi_insol'] < 1.11 &&
           planet['koi_prad'] < 1.6;
}

/*
    const promise = new Promise((resolve, reject) => {
        resolve(42)
    });

    promise.then((result) => {

    })

    const result = await promise;
*/

//! Função para assegurar que vamos ter a lista de planetas quando a página for carregada
function loadPlanetsData(){

    //! Lendo os dados do Kepler
    //?     A leitura é feita em bytes e bits em chunks, boa para arquivos grandes
    //* Transformando em promise para poder fazer o 'await' do array com os planetas habitáveis
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            //? Conectando os streams com o pipe (kepler file -> source, parse() -> destination)
            //? Assim, o parse() irá organizar os dados
            //! readable.pipe(writable)
        .pipe(parse({
            comment: '#',
            columns: true,
        })) 
            //* Agora os dados serão baseados dentro do parse() num array de objetos
        .on('data', async (data) => {
            //? Importando os dados do .csv caso o planeta for habitável
            if(isHabitablePlanet(data)){
                savePlanet(data);
            }
        })
            //? Exibindo erro, caso houver
        .on('error', err => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            //? Exibindo os resultados no console
            const countPlanetsFound = (await getAllPlanets()).length;
                //* Retornando a quantidade de planetas encontrados
            console.log(`Foram encontrados ${countPlanetsFound} planetas habitaveis!`);
                //* Resolvendo a promise
            resolve();
        });
    });
}

async function getAllPlanets(){
    //? Usando o .find, por default retorna tudo
        //* model.find({ definitions })
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function savePlanet(planet){
    try{
        //TODO: Replace below create with insert + update = upsert
        //? Adiciona dados no documento
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch(err){
        console.error(`Could not save the planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};
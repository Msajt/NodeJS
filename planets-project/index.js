//! Requirindo o módulo 'csv-parse'
const { parse } = require('csv-parse');
//! Requirindo o módulo 'fs' para auxiliar no funcionamento do módulo acima
const fs = require('fs');

//! Array contendo os dados do .csv do Kepler
const habitablePlanets = [];

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

//! Lendo os dados do Kepler
//?     A leitura é feita em bytes e bits em chunks, boa para arquivos grandes
fs.createReadStream('kepler_data.csv')
        //? Conectando os streams com o pipe (kepler file -> source, parse() -> destination)
        //? Assim, o parse() irá organizar os dados
        //! readable.pipe(writable)
    .pipe(parse({
        comment: '#',
        columns: true,
    })) //* Agora os dados serão baseados dentro do parse() num array de objetos
    .on('data', (data) => {
        //? Importando os dados do .csv caso o planeta for habitável
        isHabitablePlanet(data) ? 
            habitablePlanets.push(data) : null;
    })
        //? Exibindo erro, caso houver
    .on('error', err => console.log(err))
    .on('end', () => {
        //? Exibindo os resultados no console
            //* Retornando o nome dos planetas encontrados usando .map
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }));
            //* Retornando a quantidade de planetas encontrados
        console.log(`Foram encontrados ${habitablePlanets.length} planetas habitaveis!`);
    });

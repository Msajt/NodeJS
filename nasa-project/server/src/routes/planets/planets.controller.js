//! Importando os dados dos planetas
    //? No caso, estou passando apenas o objeto com o array dos planetas
const { getAllPlanets } = require('../../models/planets.model');

//! Função que irá retornar os planetas
function httpGetAllPlanets(req, res){
    //? Retornando os planetas e passando em JSON
    return res.status(200).json(getAllPlanets());
}

//! Exportando funções
module.exports = {
    httpGetAllPlanets,
}
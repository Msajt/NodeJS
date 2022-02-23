//TODO Vamos separar as funcionalidades do server e do express
//! Importando 'http' e o 'app' (funções do express)
const http = require('http');
const app = require('./app');

//! Importando os dados dos planetas
const { loadPlanetsData } = require('./models/planets.model');

//! Definindo a porta do servidor
//?     Pode ser definida por aqui, ou pelo 'package.json'
const PORT = process.env.PORT || 8000; // Tem que ser diferente do frontend (3000)

//! Declarando o servidor
//?     Os requests serão feitos pelo 'app', assim podemos organizar os requests
const server = http.createServer(app);

//? Esperando carregar os planetas para poder carregar o servidor
async function startServer(){
    //? Esperando o setup dos planetas
    await loadPlanetsData();

    //! Servidor fazendo o listening das conexões
    server.listen(PORT, () => {
        //? Exibindo no console a porta
        console.log(`Listening on port ${PORT}`);
    });
}

//! Iniciando o servidor
startServer();

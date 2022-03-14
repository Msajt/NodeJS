//! Requiring dos módulos 'path', 'express' e funções do 'GraphQL'
const path = require('path');
const express = require('express');
//const { buildSchema } = require('graphql');
//? Requiring do middleware do 'express-graphql'
//const { graphqlHTTP } = require('express-graphql');
//! Requiring do Apollo
const { ApolloServer } = require('apollo-server-express');
//! Nova forma de definir um 'schema' utilizando 'graphql-tools'
    //? Agora posso dividir os types em arquivos separados
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

//! Definindo variável que vou armazenar os queries
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
//? Carregando os resolvers
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloServer(){
    //? Definindo 'app'
    const app = express();

    //! Definindo o Schema do GraphQL utilizando 'graphql-tools'
    const schema = makeExecutableSchema({
        //? A forma do 'graphql-tools' chamar os schemas
        typeDefs: typesArray,
        //? Podem chamar APIs ou operações assincronas em banco de dados
        resolvers: resolversArray,
    });

    //? Definindo server do Apollo
    const server = new ApolloServer({
        schema,
    });

    //? Espera o server inicializar para continuar demais funções
    await server.start();

    //? Como se fosse um 'app.use'
    server.applyMiddleware({ app, path: '/graphql'});

    //! Listen do servidor
    app.listen(3000, () => {
        console.log('Running on PORT 3000 and GraphQL Server');
    });
}

//! Iniciando o servidor
startApolloServer();

//! Definindo o Schema do GraphQL
// const schema = buildSchema(`
//     type Query {
//         description: String
//         price: Float
//     }
// `);
//! Definindo novo 'schema' para produtos de e-commerce
//const schema = buildSchema();

//? Dados estáticos
// const root = {
//     description: 'Red Shoe',
//     price: 42.12,
// }
// const root = {
//     products: require('./products/products.model'),
//     orders: require('./orders/orders.model'),
// };

// //? Definindo o middleware do 'express-graphql'
// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     //* Serve para testar consultas
//     graphiql: true,
// }));
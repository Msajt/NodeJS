//! Importando o 'supertest' e 'app'
const request = require('supertest');
const { response } = require('../../app');
const app = require('../../app');

//! Testando o código
describe('Test GET /launches', () => {
    //? Testando se o GET irá retornar status 200
    test('It should respond with 200 success', 
        async () => {
            //? Fazendo um request dos lançamentos
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // Jest way
            //expect(response.statusCode).toBe(200);
        }
    );
});

describe('Test POST /launch', () => {
    //? Variáveis para o teste de POST
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028'
    };
    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f'
    };
    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'zoot'
    };

    //? Testando se o POST irá retornar status 201
    test('It should respond with 201 created', 
        async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);   

            expect(response.body).toMatchObject(launchDataWithoutDate);
        }
    )
    //? Testando caso houver um erro
    test('It should catch missing required properties', 
        async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        }     
    );
    test('It should catch invalid dates', 
        async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            })
        }
    );
});
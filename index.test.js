const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });
    describe('POST /dogs', () => {
        it('should create a new dog and return the created dog data', async () => {
            // Send a POST request with testDogData
            const response = await request(app)
                .post('/dogs')
                .send(testDogData);
    
            // Assert that the response status is 200
            expect(response.status).toBe(200);
    
            // Assert that the response body matches testDogData
            expect(response.body).toEqual(expect.objectContaining(testDogData));
        });
    
        it('should save the dog in the database', async () => {
            // Send a POST request with testDogData
            const response = await request(app)
                .post('/dogs')
                .send(testDogData);
    
            // Query the database for the dog by ID
            const dogFromDb = await Dog.findByPk(response.body.id);
    
            // Assert that the dog data in the database matches testDogData
            expect(dogFromDb).toBeDefined();
            expect(dogFromDb.toJSON()).toEqual(expect.objectContaining(testDogData));
        });
    });
    describe('DELETE /dogs/:id', () => {
        it('should delete the dog with the given ID', async () => {
            // Send a DELETE request to delete the dog with ID 1
            const response = await request(app).delete('/dogs/1');
    
            // Assert that the response status is 200
            expect(response.status).toBe(200);
    
            // Query the database for the dog with ID 1
            const deletedDog = await Dog.findAll({ where: { id: 1 } });
    
            // Assert that the returned array is empty
            expect(deletedDog).toEqual([]);
        });
    });
});
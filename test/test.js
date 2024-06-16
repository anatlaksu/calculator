const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../index.js');

// function to create jwt with expiration time for authentication 
const generateToken = () => jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 }, 'calculate');

// test function for test our API requst
const testOperation = async (operation, number1, number2, result) => {
  const token = generateToken(); // create jwt token

  // make a request to the '/calculate' endpoint with necessary headers and payload
  const res = await request(app) 
    .post('/calculate')
    .set('Authorization', `Bearer ${token}`) // set the authorization with the created token
    .set('Operation', operation) // set operation type (add,subtract,multiply,divide)
    .send({ number1, number2 }); // 2 numbers we recived

  // check the response status and body by the result we recived
  expect(res.status).toBe(200);
  expect(res.body.result).toBe(result);
};

// test for add
describe('Calculator API', () => {
  test('should return correct result for add', async () => {
    await testOperation('add', 1, 2, 3); // calling for test function, shoulde pass
  });

  // test for subtract
  test('should return correct result for subtract', async () => {
    await testOperation('subtract', 3, 2, 1); // calling for test function, shoulde pass
  });

  // test for multiply
  test('should return correct result for multiply', async () => {
    await testOperation('multiply', 3, 2, 6); // calling for test function, shoulde pass
  });

  // test for divide
  test('should return correct result for divide', async () => {
    await testOperation('divide', 4, 2, 2); // calling for test function, shoulde pass
  });
});

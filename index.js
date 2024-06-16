const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // library for JSON Web Token
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// creating a jwt token
const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60)}, 'calculate'); // inside the payload of the token we put expiration time to expire in one hour
console.log(token);

// configuration for Swagger, including basic information about the API, server details, and security schemes
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Home Work',
            version: '1.0.0',
            description: 'calculator API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// our API requst
app.post('/calculate', (req, res) => {
    const { number1, number2 } = req.body; // 2 numbers
    const operation = req.headers['operation']; // add(+) ,subtract(-) , multiply(*) , divide(/)
    const authHeader = req.headers['authorization']; // authorize with jwt
 
    // check if authorization header is exists. if not we get 401 error
    if (!authHeader) {
        return res.status(401).send('unauthorized');
    }

    // extract and verify the JWT token from the authorization header and checking the token expiration time
    const token = authHeader.replace('Bearer ', ''); // extract token from authorization header
    try {
        const jwtToken = jwt.verify(token, 'calculate'); // verify the token
        const currentTime = Math.floor(Date.now() / 1000); // get the current time in seconds
        if (jwtToken.exp < currentTime) { // if the expirations time of the token is expired its mean it less then our current time we get 401 error
            return res.status(401).send('token expired');
        }
    } catch (error) { // if error then the token is invalid and we get 401 error
        return res.status(401).send('invalid token');
    }

    // performing account operations according to the arithmetic operation and the numbers we received in the request
    let result;
    switch (operation) {
        case 'add':
            result = number1 + number2;
            break;
        case 'subtract':
            result = number1 - number2;
            break;
        case 'multiply':
            result = number1 * number2;
            break;
        case 'divide':
            result = number1 / number2;
            break;
        default:
            return res.status(400).send('invalid operation'); // if the operation is invalid we get 400 error
    }

    res.json({ result });
});

// running the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// export for testing
module.exports = app;

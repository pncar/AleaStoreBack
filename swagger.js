const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0', // Ensure this is a string
    info: {
      title: 'Your API',
      version: '1.0.0', // Ensure this is a string
    },
  },
  apis: ['./src/routes/*.ts'], // Make sure this path is correct
};

const swaggerSpec = swaggerJsdoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2)); // Debug output

module.exports = swaggerSpec;
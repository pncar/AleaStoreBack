import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MyStore',
            version: '1.0.0',
            description: '...',
            contact: {
                name: 'Developer'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);
export default specs;
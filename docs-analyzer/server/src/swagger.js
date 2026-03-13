const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Docs Analyzer API',
      version: '1.0.0',
      description: 'REST API for uploading PDFs and extracting text content',
    },
    servers: [{ url: 'http://localhost:3001/api' }],
    components: {
      schemas: {
        HistoryItem: {
          type: 'object',
          properties: {
            id:             { type: 'integer', example: 1 },
            filename:       { type: 'string',  example: 'report.pdf' },
            extracted_text: { type: 'string',  example: 'Lorem ipsum...' },
            uploaded_at:    { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00Z' },
          },
        },
        ExtractionResult: {
          type: 'object',
          properties: {
            filename: { type: 'string',  example: 'report.pdf' },
            text:     { type: 'string',  example: 'Lorem ipsum...' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Only PDF files are allowed' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);

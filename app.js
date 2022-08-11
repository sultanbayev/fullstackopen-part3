const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const personsRouter = require('./controllers/persons');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const Person = require('./models/person');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Failed connect to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.morganMiddleware);

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
    });
});

app.use('/api/persons', personsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
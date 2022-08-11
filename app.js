const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const personsRouter = require('./controllers/persons');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.morganMiddleware);

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>');
});

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
    });
});

app.use('/api/persons', personsRouter);
app.use(middleware.errorHandler);

module.exports = app;
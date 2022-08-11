const config = require('./utils/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const personsRouter = require('./controllers/persons');
const logger = require('./utils/logger');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', function (req) {
  const body = req.body;
  return JSON.stringify(body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(409).send({ error: 'name must be unique' });
  }

  next(error);
};
app.use(errorHandler);


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
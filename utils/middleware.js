const logger = require('./logger');
const morgan = require('morgan');

morgan.token('body', function (req) {
  const body = req.body;
  return JSON.stringify(body);
});
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :body');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

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

module.exports = {
  morganMiddleware,
  unknownEndpoint,
  errorHandler
};

const mongoose = require('mongoose');
const logger = require('./utils/logger');

if (process.argv.length < 3) {
  logger.info('Please provide the password as an argument: node mongo.js <password> [<name> <number>]');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://root:${password}@cluster0.ytr8io9.mongodb.net/personApp?retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .catch((err) => logger.error(err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    logger.info('phonebook:');
    result.forEach((person) => {
      logger.info(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 4) {
  logger.info('Number is required: node mongo.js <password> [<name> <number>]');
  process.exit(1);
}

if (process.argv.length >= 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });
  person
    .save()
    .then(() => {
      logger.info(`added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => logger.error(err));
}




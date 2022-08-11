const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../utils/config');

logger.info('connecting to MongoDB database');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to database');
  })
  .catch((error) => {
    logger.error('Failed connect to database:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minLength: 3,
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);

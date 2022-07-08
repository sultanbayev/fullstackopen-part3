const express = require('express');
const persons = require('./persons');
const app = express();

app.get('/', (request, response) => {
    response.send('<h1>Hello, World!</h1>');
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
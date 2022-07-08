const express = require('express');
const persons = require('./persons');
const app = express();

app.get('/', (request, response) => {
    response.send('<h1>Hello, World!</h1>');
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
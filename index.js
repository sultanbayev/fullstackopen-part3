const express = require('express');
let persons = require('./persons');
const morgan = require('morgan');
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
morgan.token('body', function (req, res) {
    const body = req.body;
    return JSON.stringify(body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
    response.send('<h1>Hello, World!</h1>');
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name is missing'
        });
    }

    const nameExists = persons.find(p => p.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique'
        });
    }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number is missing'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = [ ...persons, person ];

    response.json(person)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
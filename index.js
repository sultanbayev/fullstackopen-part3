require('dotenv').config();
const express = require('express');
let persons = require('./persons');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(cors())
app.use(express.json());
morgan.token('body', function (req, res) {
    const body = req.body;
    return JSON.stringify(body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('build'));

app.get('/', (request, response) => {
    response.send('<h1>Hello, World!</h1>');
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
            response.json(notes)
        })
});

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(note => { response.json(note) })
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name is missing'
        });
    }

    // const nameExists = persons.find(p => p.name === body.name);
    // if (nameExists) {
    //     return response.status(400).json({ 
    //         error: 'name must be unique'
    //     });
    // }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number is missing'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
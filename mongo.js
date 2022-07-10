const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> [<name> <number>]')
    process.exit(1)
}

const password = process.argv[2];
const url = `mongodb+srv://root:${password}@cluster0.ytr8io9.mongodb.net/personApp?retryWrites=true&w=majority`;
mongoose
    .connect(url)
    .catch((err) => console.log(err))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
}

if (process.argv.length === 4) {
    console.log('Number is required: node mongo.js <password> [<name> <number>]');
    process.exit(1);
}

if (process.argv.length >= 5) {    
    const name = process.argv[3];
    const number = process.argv[4];
    
    const person = new Person({ name, number });
    person
        .save()
        .then((result) => {
            console.log(`added ${name} number ${number} to phonebook`);
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err))
}




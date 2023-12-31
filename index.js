const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(express.json())
morgan.token('body', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) return response.json(person)
    return response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name)    return response.status(400).json({error: 'name missing'})
    if (!body.number)  return response.status(400).json({error: 'number missing'})
    var existing = persons.find(p => p.name === body.name)
    if (existing)      return response.status(400).json({error: 'name must be unique'})

    const person = { 
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.status(201).end()
})

app.get('/info', (request, response) => {
    const date = new Date(Date.now()).toString();
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
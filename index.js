require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/person')
const app = express()

app.use(express.json())

morgan.token('body', function getBody (req) {
	return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
	const date = new Date
	res.send (`<p>Phonebook has info for ${persons.length} people.</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
	Entry.find({}).then(persons => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Entry.findById(req.params.id).then(person => {
		if (person) {
			res.json(person)
		} else {
			return res.status(404).end()
		}
	})
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	console.log(body)

	if (!body.name) {
		return res.status(400).json(
			{ error: 'name missing' }
		)
	}

	if (!body.number) {
		return res.status(400).json(
			{ error: 'number missing' }
		)
	}

	const person = new Entry({
		id: generateId(),
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		res.json(savedPerson)
	})
})

const generateId = () => {
	return Math.floor(Math.random() * 50000)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

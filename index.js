require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function getBody (req) {
	return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res, next) => {
	const date = new Date
	Entry.countDocuments({}).then(count => {
	  res.send (`<p>Phonebook has info for ${count} people.</p><p>${date}</p>`)
	})
	.catch(Error => next(error))
})

app.get('/api/persons', (req, res, next) => {
	Entry.find({}).then(persons => {
	  res.json(persons)
	})
	.catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	Entry.findById(req.params.id).then(person => {
	  if (person) {
		res.json(person)
	  } else {
		return res.status(404).end()
	  }
	})
	.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Entry.findByIdAndRemove(req.params.id)
	  .then(result => {
		res.status(204).end()
	  })
	  .catch(error => next(error))
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

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
	const newData = {
	  name: body.name,
	  number: body.number
	}
	Entry.findByIdAndUpdate(req.params.id, newData, {new: true})
	  .then(updated => {
		res.json(updated)
	  })
	  .catch(error => next(error))
})

const generateId = () => {
	return Math.floor(Math.random() * 50000)
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
	return res.status(400).send({error: 'Invalid id!'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

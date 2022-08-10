const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password or password, name and number as arguments.')
  process.exit(1)
} else if (process.argv.length < 5 & process.argv.length > 3) {
  console.log('Name or number missing.')
  process.exit(1)
} else if (process.argv.length > 5) {
  console.log('Too many arguments.')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://vulpecula:${password}@cluster0.cwa1aov.mongodb.net/phoneBook?retryWrites=true&w=majority`
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
  })

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Entry({
    name: name,
    number: number
  })

  entry.save().then(result => {
    console.log(`Added ${name} number: ${number} to phonebook.`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {

  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}

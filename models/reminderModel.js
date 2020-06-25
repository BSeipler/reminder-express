const mongoose = require('mongoose')

// equivalent of creating a table in MySQL --- Creating a model/schema
const reminderSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	isDone: Boolean,
	email: String
})

module.exports = mongoose.model('Reminder', reminderSchema)

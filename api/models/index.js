// Import the mongoose module
const mongoose = require('mongoose');
const MGCourseSchema = require('./MGCourse')
const RatingSchema = require('./Rating')
const GradesSchema = require('./Grades')

// Set up default mongoose connection
const mongoDB = process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    : 'mongodb://127.0.0.1/unitrack-dev'

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const MGCourse = mongoose.model('MGCourse', MGCourseSchema)
const Rating = mongoose.model('Rating', RatingSchema)
const Grades = mongoose.model('Grades', GradesSchema)

module.exports = { MGCourse, Rating, Grades }


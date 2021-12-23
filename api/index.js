const bodyParser = require('body-parser')
const app = require('express')()

const findCourse = require('./utils/findCourse')
const getProfNames = require('./utils/getProfNames')
const findRating = require('./utils/findRating')

app.use(bodyParser.json())
app.all('/', (_req, res) => {
  res.json({ data: 'data' })
})

app.get('/stats', async (req, res) => {

  const { course, semesterCode } = req.query

  const { subjectCode, courseId, courseDesignation } = await findCourse(course, semesterCode)

  const profNames = await getProfNames({ subjectCode, courseId, semesterCode })

  const result = await Promise.all(profNames.map(async (prof) => {
    const { rating, err } = await findRating(prof)

    if (err) {
      return { prof, rating: 'N/A' }
    }
    return { prof, rating }
   
  }))
  
  res.send({ subjectCode, courseId, courseDesignation, semesterCode, result })
})

module.exports = app
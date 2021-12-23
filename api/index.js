const bodyParser = require('body-parser')
const app = require('express')()

const findCourse = require('./utils/findCourse')
const getProfNames = require('./utils/getProfNames')
const findRating = require('./utils/findRating')
const findMadgradesCourse = require('./utils/madgrades/findCourse')
const getGrades = require('./utils/madgrades/getGrades')

app.use(bodyParser.json())
app.all('/', (_req, res) => {
  res.json({ data: 'data' })
})

app.get('/stats', async (req, res) => {
  const { course, semesterCode } = req.query

  const { subjectCode, courseId, courseDesignation } = await findCourse(course, semesterCode)

  if (!courseId) {
    throw new Error('Invalid Course Details')
  }

  const grades = await getCourseGrades(course)

  const profNames = await getProfNames({ subjectCode, courseId, semesterCode })

  const result = await Promise.all(profNames.map(async (prof) => {
    const { rating, err } = await findRating(prof)

    if (err) {
      return { prof, rating: 'N/A' }
    }
    return { prof, rating, grades }
   
  }))
  
  res.send({ subjectCode, courseId, courseDesignation, semesterCode, result })
})

async function getCourseGrades(course) {
  const madgradesCourseInfo = await findMadgradesCourse(course)

  if(!madgradesCourseInfo.url) {
    throw new Error('Invalid Course')
  }

  const gradesUrl = `${madgradesCourseInfo.url}/grades`

  const grades = getGrades(gradesUrl)

  return grades
}

module.exports = app
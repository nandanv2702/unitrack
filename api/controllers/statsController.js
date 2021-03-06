const RATING_PAGE = process.env.RATING_PAGE
/* eslint-disable no-console */
const { closest } = require('fastest-levenshtein')

const findCourse = require('../utils/findCourse')
const getProfNames = require('../utils/getProfNames')
const findRating = require('../utils/findRating')
const findMadgradesCourse = require('../utils/madgrades/findCourse')
const getGrades = require('../utils/madgrades/getGrades')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAverageGPA = require('../utils/getAverageGPA')

async function getCourseGrades(course) {
  const madgradesCourseInfo = await findMadgradesCourse(course)

  if (!madgradesCourseInfo.url) {
    throw new Error('Invalid Course')
  }

  const gradesUrl = `${madgradesCourseInfo.url}/grades`

  const grades = await getGrades(gradesUrl)

  return { grades, courseUuid: madgradesCourseInfo.url.split('/').pop() }
}


async function getStats(req, res) {
  try {
    const { course, semesterCode } = req.query

    const { subjectCode, courseId } = await findCourse(course, semesterCode)

    if (!courseId) {
      throw new Error('Invalid Course Details')
    }

    const [profNames, { grades, courseUuid }] = await Promise.all([
      getProfNames({ subjectCode, courseId, semesterCode }),
      getCourseGrades(course),
    ])

    const profDetails = profNames
      .map(async (prof) => {

        const { rating, ratingId, err } = await findRating(prof)

        if (err) {
          return { prof, rating: 'N/A' }
        }

        // get unique professor names from madgrades API result
        const madgradesProfNames = grades.map((semester) => {
          return Object.keys(semester.gpaMap)
        })
          .flat()
          .filter((v, i, a) => a.indexOf(v) === i);

        const profGrades = grades.map((semester) => {
          // find closest match to prof name from madgradesProfNames
          const madgradesProf = closest(prof, madgradesProfNames)

          return {
            semesterCode: semester.semesterCode,
            grades: semester.gpaMap[madgradesProf],
            profName: madgradesProf
          }
        })

        const ratingLink = `${RATING_PAGE}?tid=${ratingId}`

        const averageGPA = getAverageGPA(profGrades)

        return { 
          prof, 
          rating, 
          ratingLink,
          averageGPA, 
          grades: profGrades 
        }

      })
      .sort((a, b) => (b.averageGPA + b.rating) - (a.averageGPA + a.rating))

    const result = await Promise.all(profDetails)

    res.send({ professors: result, grades, courseUuid })
  } catch (err) {
    console.error(err)

    res.status(400).json({ err, message: 'f' })
  }
}

module.exports = {
  getStats
}
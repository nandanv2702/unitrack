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
  console.time('getCourseGrades madgrades')
  const madgradesCourseInfo = await findMadgradesCourse(course)

  if (!madgradesCourseInfo.url) {
    throw new Error('Invalid Course')
  }

  const gradesUrl = `${madgradesCourseInfo.url}/grades`

  const grades = await getGrades(gradesUrl)

  console.timeEnd('getCourseGrades madgrades')

  return grades
}


async function getStats(req, res) {
  try {
    console.time('getStats')
    const { course, semesterCode } = req.query

    const { subjectCode, courseId } = await findCourse(course, semesterCode)

    if (!courseId) {
      throw new Error('Invalid Course Details')
    }

    const [profNames, grades] = await Promise.all([
      getProfNames({ subjectCode, courseId, semesterCode }),
      getCourseGrades(course),
    ])

    const profDetails = profNames.map(async (prof) => {

      const { rating, err } = await findRating(prof)

      console.log(`rating from the controller is ${rating}`)

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

      return { prof, rating, grades: profGrades }

    })

    const result = await Promise.all(profDetails)

    console.timeEnd('getStats')
    console.log('\n')

    res.send({ professors: result, grades })
  } catch (err) {
    console.error(err)

    console.warn('error thrown here')

    res.status(400).json({ err, message: 'f' })
  }
}

module.exports = {
  getStats
}
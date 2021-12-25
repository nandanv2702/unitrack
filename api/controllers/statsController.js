const { closest } = require('fastest-levenshtein')

const findCourse = require('../utils/findCourse')
const getProfNames = require('../utils/getProfNames')
const findRating = require('../utils/findRating')
const findMadgradesCourse = require('../utils/madgrades/findCourse')
const getGrades = require('../utils/madgrades/getGrades')

async function getCourseGrades(course) {
    const madgradesCourseInfo = await findMadgradesCourse(course)
  
    if(!madgradesCourseInfo.url) {
      throw new Error('Invalid Course')
    }
  
    const gradesUrl = `${madgradesCourseInfo.url}/grades`
  
    const grades = await getGrades(gradesUrl)
  
    return grades
  }
  

async function getStats(req, res) {

    try {
        const { course, semesterCode } = req.query

        const { subjectCode, courseId } = await findCourse(course, semesterCode)
      
        if (!courseId) {
          throw new Error('Invalid Course Details')
        }
      
        const [ grades, profNames ] = await Promise.all([
          getCourseGrades(course), 
          getProfNames({ subjectCode, courseId, semesterCode })
        ])
      
        const profDetails = profNames.map(async (prof) => {
      
          const { rating, err } = await findRating(prof)
      
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
    
        return { result, grades }
    } catch(err) {
        console.error(err)

        res.status(400).json({ err, message: 'f' })
    }
}

module.exports = {
    getStats
}
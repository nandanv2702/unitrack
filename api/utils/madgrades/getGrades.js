import axios from 'axios'
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN
const findMGGrades = require('../../services/findMGGrades')

function getGPACount({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount }) {
    return aCount + abCount + bCount + bcCount + cCount + dCount + fCount
}

function calculateGPA({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount }) {
    const total = getGPACount({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount })

    if (total === 0) {
        return 0.00
    }

    const gpa = (4 * aCount + 3.5 * abCount + 3 * bCount + 2.5 * bcCount + 2 * cCount + 1 * dCount) / total
    return gpa.toFixed(2)
}

function getGPAStatistics(course) {
    const gpaMap = {}
    const cumulativeGPA = calculateGPA(course.cumulative)

    course.sections.forEach((section) => {
        // calculate section gpa
        const sectionGPA = calculateGPA(section)

        section.instructors.forEach((instructor) => {
            if (Object.keys(gpaMap).includes(instructor.name)) {
                const instructorStats = gpaMap[instructor.name]
                const sectionCount = getGPACount(section)
                const newTotal = instructorStats.total + sectionCount

                const weightedGPA = ((instructorStats.total * instructorStats.sectionGPA) + (sectionCount * sectionGPA)) / newTotal
                gpaMap[instructor.name] = { sectionGPA: weightedGPA.toFixed(2), total: newTotal }

            } else {
                gpaMap[instructor.name] = { sectionGPA, total: getGPACount(section) }
            }
        })
    })

    return { semesterCode: course.termCode, cumulativeGPA, gpaMap }
}

module.exports = async (gradesUrl) => {
    // Searches database for course
    const x = gradesUrl.split('/')
    const courseUuid = x[x.length - 2]

    const existingCourse = await findMGGrades(courseUuid)
    
    if (existingCourse.length > 0) {
        const gpaStatistics = existingCourse[0].courseOfferings.map((course) => getGPAStatistics(course))
        return gpaStatistics.sort((a, b) => b[0] - a[0]).slice(0, 5)
    }

    const { data } = await axios({
        method: 'GET',
        url: `${gradesUrl}`,
        headers: {
            'Authorization': `Token token=${MADGRADES_TOKEN}`,
        },
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })

    const gpaStatistics = data.courseOfferings.map((course) => getGPAStatistics(course))

    return gpaStatistics.sort((a, b) => b[0] - a[0]).slice(0, 5)
}
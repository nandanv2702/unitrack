import axios from 'axios'

function getGPACount({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount }) {
    return aCount + abCount + bCount + bcCount + cCount + dCount + fCount
}

function calculateGPA({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount }) {
    const total = getGPACount({ aCount, abCount, bCount, bcCount, cCount, dCount, fCount })

    const gpa = (4*aCount + 3.5*abCount + 3*bCount + 2.5*bcCount + 2*cCount + 1*dCount) / total
    return gpa.toFixed(2)
}

function getGPAStatistics(course){
    const gpaMap = {}
    const cumulativeGPA = calculateGPA(course.cumulative)
    
    course.sections.forEach((section) => {
        // calculate gpa
        const sectionGPA = calculateGPA(section)

        section.instructors.forEach((instructor) => {
            if(Object.keys(gpaMap).includes(instructor.name)) {
                const instructorStats = gpaMap[instructor.name]
                const sectionCount = getGPACount(section)
                const newTotal = instructorStats.total + sectionCount

                const weightedGPA = ((instructorStats.total * instructorStats.sectionGPA) + (sectionCount * sectionGPA)) / newTotal
                gpaMap[instructor.name] = { sectionGPA: weightedGPA.toFixed(2), total: newTotal}

            } else {
                gpaMap[instructor.name] = { sectionGPA, total: getGPACount(section)}
            }
        })
    })
    
    return [course.termCode, cumulativeGPA, gpaMap]
}

module.exports = async (gradesUrl) => {

    const { data } = await axios({
        method: 'GET',
        url: `${gradesUrl}`,
        headers: {
            'Authorization': 'Token token=ff93107f38e14bc8af16d38b435fcf30',
        },
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })

    const gpaStatistics = data.courseOfferings.map((course) => getGPAStatistics(course))

    return gpaStatistics.sort((a,b) => b[0] - a[0]).slice(0,5)
}
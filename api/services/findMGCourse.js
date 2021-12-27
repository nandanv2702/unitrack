const { MGCourse } = require('../models/index.js')

module.exports = async (course) => {
    try {
        const splitCourse = course.split(' ')
        const courseNumber = Number(splitCourse.pop())
        const courseName = splitCourse.join(' ').trim().toUpperCase()
    
        return await MGCourse.find({
            number: courseNumber,
            "subjects.abbreviation": courseName
        })
    } catch(err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return []
    }
}


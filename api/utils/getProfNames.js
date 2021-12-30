import axios from 'axios'
const startCase = require('lodash.startcase')

const wiscSearchAPI = process.env.WISC_COURSE_API

module.exports = async ({ semesterCode, subjectCode, courseId }) => {
    console.time('getprofnames')
    const { data: allSections } = await axios({
        method: 'GET',
        url: `${wiscSearchAPI}/enrollmentPackages/${semesterCode}/${subjectCode}/${courseId}`,
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })

    const rawProfessorNames = allSections.map((classes) => {
        if (!classes.sections[0].instructor) {
            return undefined
        }

        const firstName = classes.sections[0].instructor.personAttributes.name.first.trim()
        const lastName = classes.sections[0].instructor.personAttributes.name.last.trim()

        const fullName = `${firstName} ${lastName}`

        return startCase(fullName)
    })

    /**
     * Filters to find unique names as these may be replicated in sections
     * Returns a value only if its the first iteration in the array
     */
    const profNames = rawProfessorNames.filter((v, i, a) => (v !== undefined) && a.indexOf(v) === i);
    console.timeEnd('getprofnames')

    return profNames
}





import axios from 'axios'

const wiscSearchAPI = process.env.WISC_COURSE_API

module.exports = async ({ semesterCode, subjectCode, courseId }) => {
    try {
        const { data: allSections } = await axios({
            method: 'GET',
            url: `${wiscSearchAPI}/enrollmentPackages/${semesterCode}/${subjectCode}/${courseId}`,
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })

        const rawProfessorNames = allSections.map((classes) => {
            const firstName = classes.sections[0].instructor.personAttributes.name.first.trim().toUpperCase()
            const lastName = classes.sections[0].instructor.personAttributes.name.last.trim().toUpperCase()

            return `${firstName} ${lastName}`
        })

        /**
         * Filters to find unique names as these may be replicated in sections
         * Returns a value only if its the first iteration in the array
         */
        const profNames = rawProfessorNames.filter((v, i, a) => a.indexOf(v) === i);

        return profNames
    } catch(err) {
        console.error(err);

        return { err }
    }
}





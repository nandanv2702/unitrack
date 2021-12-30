/* eslint-disable no-console */
import axios from 'axios'

const wiscSearchAPI = process.env.WISC_COURSE_API

module.exports = async (courseName, semesterCode) => {
    const courseNumber = Number(courseName.split(' ').pop())

    const { data: matchingClasses } = await axios({
        method: 'POST',
        url: wiscSearchAPI,
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        data: {
            "filters": [{
                "has_child": {
                    "type": "enrollmentPackage",
                    "query": {
                        "match": {
                            "packageEnrollmentStatus.status": "OPEN WAITLISTED CLOSED"
                        }
                    }
                }
            }],
            "page": 1,
            "pageSize": 1,
            "queryString": `${courseName}`,
            "selectedTerm": `${semesterCode}`,
            "sortOrder": "SCORE"
        },
    })

    if (!matchingClasses.success || matchingClasses.found === 0) {
        throw new Error("Wisc API error")
    }

    const match = matchingClasses.hits[0]
    const catalogNumber = Number(match.catalogNumber)

    if (catalogNumber !== courseNumber) {
        throw new Error(`Course not available this semester (semesterCode: ${semesterCode})`)
    }

    const matchInfo = {
        courseId: match.courseId,
        subjectCode: match.subject?.subjectCode,
        courseDesignation: match.courseDesignation
    }

    return matchInfo
}


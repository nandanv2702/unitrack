import axios from 'axios'

const findMGCourse = require('../../services/findMGCourse')

const MADGRADES_API = process.env.MADGRADES_API
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN

module.exports = async (course) => {
    try {
        // Searches database for course
        const existingCourse = await findMGCourse(course)
        
        if (existingCourse.length > 0) { 
            return existingCourse[0]
        }

        // If course isn't in our database, polls Madgrades (this is g)
        const { data } = await axios({
            method: 'GET',
            url: `${MADGRADES_API}/courses?query=${course}`,
            headers: {
                'Authorization': `Token token=${MADGRADES_TOKEN}`,
            },
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
    
        if (data.totalCount === 0) {
            throw new Error('Invalid Course Name')
        }
        
        return data.results[0]
    
    } catch(err) {
        // eslint-disable-next-line no-console
        console.error(err);

        return { err }
    }
}


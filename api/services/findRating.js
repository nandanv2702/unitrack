const { closest } = require('fastest-levenshtein')
const { Rating } = require('../models/index.js')

module.exports = async (professor) => {
    try {
        const splitName = professor.split(' ')

        const lastName = splitName.pop().toLowerCase()
        const firstName = splitName[0].toLowerCase()

        const findByLastName = await Rating.find({
            lastName
        })

        /**
         * Some of the names in the ratings are slightly different from the actual
         * names on the Wisc Course Search and Enroll. Thus, we'll use the closest matching
         * first name for the prof
         * e.g. Prof. Gwen Eudey is Prof. Wendy Eudey in the rating (but there's only one Prof "Eudey" on campus)
         */
        const firstNameMatch = closest(firstName, findByLastName.map(({ firstName }) => firstName.toLowerCase() ))

        return findByLastName.filter((name) => name.firstName.toLowerCase() === firstNameMatch)
    } catch(err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return []
    }
}

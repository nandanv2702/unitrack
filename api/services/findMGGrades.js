const { Grades } = require('../models/index.js')

module.exports = async (courseUuid) => {
    try {
        return await Grades.find({
            courseUuid
        })
    } catch(err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return []
    }
}


const { Grades } = require('../models/index.js')

module.exports = async (courseUuid) => {
    try {
        return await Grades.find({
            courseUuid
        })
    } catch(err) {
        console.error(err)
        return []
    }
}


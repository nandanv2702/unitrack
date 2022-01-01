/* eslint-disable no-console */
const axios = require('axios')

const MADGRADES_API = process.env.MADGRADES_API || 'https://api.madgrades.com/v1'
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN || 'ff93107f38e14bc8af16d38b435fcf30'

const { MGCourse, Grades } = require('../models/index')

module.exports = async () => {
    try {
        const gradesList = await Grades.find({}, 'courseUuid')
        const gradeIds = gradesList.map((x) => x.courseUuid)
        const ids = await MGCourse.find({}, '_id')
        const idList = ids
            .map((x) => x._id)
            .filter((x) => !gradeIds.includes(x))

        for (let i = 0; i < idList.length; i++) {
            const id = idList[i]

            const { data } = await axios({
                method: 'GET',
                url: `${MADGRADES_API}/courses/${id}/grades`,
                headers: {
                    'Authorization': `Token token=${MADGRADES_TOKEN}`,
                },
                mode: 'cors',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            })

            Grades.create(data)
        }

    } catch (err) {
        console.error(err);

        return { err }
    }
}
/* eslint-disable no-console */
const axios = require('axios')
const pause = require('../utils/pause')

const MADGRADES_API = process.env.MADGRADES_API || 'https://api.madgrades.com/v1'
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN || 'ff93107f38e14bc8af16d38b435fcf30'

const { MGCourse } = require('../models/index')

module.exports = async () => {
    try {
        const results = []

        const { data } = await axios({
            method: 'GET',
            url: `${MADGRADES_API}/courses`,
            headers: {
                'Authorization': `Token token=${MADGRADES_TOKEN}`,
            },
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })

        let nextPageUrl = data.nextPageUrl

        results.push(data.results)

        while (nextPageUrl) {
            const { data } = await axios({
                method: 'GET',
                url: `${nextPageUrl}`,
                headers: {
                    'Authorization': `Token token=${MADGRADES_TOKEN}`,
                },
                mode: 'cors',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            })

            await MGCourse.insertMany(data.results.map(({ uuid, ...rest }) => {
                return {
                    _id: uuid,
                    ...rest
                }
            }))

            nextPageUrl = data.nextPageUrl

            await pause(300)
        }

        return results.length

    } catch (err) {
        console.error(err);

        return { err }
    }
}


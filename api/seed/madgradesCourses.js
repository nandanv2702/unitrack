const axios = require('axios')

const MADGRADES_API = process.env.MADGRADES_API || 'https://api.madgrades.com/v1'
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN || 'ff93107f38e14bc8af16d38b435fcf30'

const { MGCourse } = require('../models/index')

function pause() {
    return new Promise(resolve => setTimeout(() => {
        resolve();
    }, 300));
}

async function getCourses() {
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

            await pause()
        }

        return results.length

    } catch (err) {
        console.error(err);

        return { err }
    }
}

console.log(getCourses())


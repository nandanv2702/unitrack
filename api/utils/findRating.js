/* eslint-disable no-console */
import axios from 'axios'
const findInternalRating = require('../services/findRating')

const ratingPrefix = process.env.RATING_API_PREFIX
const ratingSuffix = process.env.RATING_API_SUFFIX

module.exports = async (professor) => {
    console.time(`findRating for ${professor}`)

    // Searches database for professor's rating
    const profRating = await findInternalRating(professor)

    if (profRating.length > 0) {
        console.timeEnd(`findRating for ${professor}`)
        console.log(`average for ${professor} is ${profRating[0].avgRating}`)
        return { rating: profRating[0].avgRating }
    }

    // If it doesn't exist, polls API for rating
    const { data } = await axios({
        method: 'GET',
        url: `${ratingPrefix}${professor}${ratingSuffix}`,
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })

    if (data.response.numFound === 0) {
        return { err: true }
    }

    console.timeEnd(`findRating for ${professor}`)

    return { rating: data.response.docs[0].averageratingscore_rf }
}


// camel-case disabled for this seed only
/* eslint-disable camelcase */
const axios = require('axios')

const ratingPrefix = process.env.RATING_API_PREFIX
const ratingSuffix = process.env.RATING_API_SUFFIX

const { Rating } = require('../models/index')

/**
 * Gets latest ratings
 * If valid ratings, repopulates table by deleting old ratings
 */
module.exports = async () => {
    try {
        const { data } = await axios({
            method: 'GET',
            url: `${ratingPrefix}*${ratingSuffix}`,
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })

        if (data.response.numFound === 0) {
            throw new Error('No valid records found')
        }

        await Rating.deleteMany({})

        await Rating.insertMany(
            data.response.docs.map(({
                averageratingscore_rf,
                pk_id,
                total_number_of_ratings_i,
                teacherfirstname_t,
                teacherlastname_t
            }) => {
                const avgRating = Number(averageratingscore_rf) || 0
                const numRatings = Number(total_number_of_ratings_i) || 0

                return {
                    pkId: pk_id,
                    numRatings,
                    firstName: teacherfirstname_t,
                    lastName: teacherlastname_t,
                    avgRating
                }
            }))

    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
    }
}



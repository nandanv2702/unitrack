import axios from 'axios'

const ratingPrefix = process.env.RATING_API_PREFIX
const ratingSuffix = process.env.RATING_API_SUFFIX

module.exports = async (professor) => {
    try {
        const start = Date.now()
        const { data } = await axios({
            method: 'GET',
            url: `${ratingPrefix}${professor}${ratingSuffix}`,
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })

        if(data.response.numFound === 0) {
            return { err: true }
        }
        console.log(`finding ${professor} took: ${Date.now() - start}`)
        console.log('\n');
        return { rating: data.response.docs[0].averageratingscore_rf }
    } catch(err) {
        console.error(err);

        return { err }
    }

}


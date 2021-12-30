const axios = require('axios')


const MADGRADES_API = process.env.MADGRADES_API || 'https://api.madgrades.com/v1'
const MADGRADES_TOKEN = process.env.MADGRADES_TOKEN || 'ff93107f38e14bc8af16d38b435fcf30'

async function getTerms(_req, res) {
    const { data } = await axios({
        method: 'GET',
        url: `${MADGRADES_API}/terms`,
        headers: {
            'Authorization': `Token token=${MADGRADES_TOKEN}`,
        },
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })

    res.send(data)
}

module.exports = { getTerms }
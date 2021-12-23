import axios from 'axios'

const MADGRADES_API = process.env.MADGRADES_API

module.exports = async (course) => {
    try {
        const { data } = await axios({
            method: 'GET',
            url: `${MADGRADES_API}/courses?query=${course}`,
            headers: {
                'Authorization': 'Token token=ff93107f38e14bc8af16d38b435fcf30',
            },
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
    
        if (data.totalCount === 0) {
            throw new Error('Invalid Course Name')
        }
        
        return data.results[0]
    
    } catch(err) {
        console.error(err);

        return { err }
    }
}


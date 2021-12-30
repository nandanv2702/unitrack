const bodyParser = require('body-parser')
const app = require('express')()

const seedRatings = require('./seed/ratings')
const seedMadgradesCourses = require('./seed/madgradesCourses')
const seedMadgradesGrades = require('./seed/madgradesGrades')

const statsController = require('./controllers/statsController')
const termController = require('./controllers/termController')

app.use(bodyParser.json())
app.all('/', (_req, res) => {
  res.json({ message: 'hello 🔥' })
})

app.get('/stats', async (req, res) => {
  await statsController.getStats(req, res)
})

app.get('/terms', async (req, res) => {
  await termController.getTerms(req, res)
})

/**
 * Seed
 */
app.post('/seed', (_req, res) => {
  try {
    Promise.all([
      seedRatings(),
      seedMadgradesCourses()
    ])
      .then(() => { seedMadgradesGrades() })
      .then(() => { res.sendStatus(200) })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err))
  } catch (err) {
    res.status(500).json(err)
  }
})


module.exports = app
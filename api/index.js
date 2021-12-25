const bodyParser = require('body-parser')
const app = require('express')()

const statsController = require('./controllers/statsController')

app.use(bodyParser.json())
app.all('/', (_req, res) => {
  res.json({ message: 'hello 🔥' })
})

app.get('/stats', async (req, res) => {
  const result = await statsController.getStats(req, res)
  
  res.send({ professors: result.result, grades: result.grades })
})


module.exports = app
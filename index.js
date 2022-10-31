import express from 'express'
import cors from 'cors'
import validKey from './utils/key_validation.js'
import validateBulk from './api/validate-bulk.js'
import validateOne from './api/validate-one.js'
import info from './api/info.js'

const port = 8000
const app = express()
app.use(express.json())
app.use(cors())
app.use(async function (req, res, next) {
  let apiKey = req.header('x-api-key')
  let securedRoutes = ['/api/validate-one', 'api/validate-bulk']
  if (securedRoutes.includes(req.originalUrl)) {
    if (!apiKey) return res.status(403).json({ error: 'API key not provided' })
    if (await validKey(apiKey)) {
      next()
    } else return res.status(403).json({ error: 'Invalid api key' })
  } else {
    next()
  }
})

app.post('/api/validate-bulk', validateBulk)
app.post('/api/validate-one', validateOne)

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' })
})

app.get('/api', info)
app.listen(port, () => {
  console.info(`API is up on port ${port}`)
})

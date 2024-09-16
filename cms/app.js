const express = require('express')
const cors = require('cors');
const app = express()
const port = 3001

app.use(cors())

app.get('/', (req, res) => {
  res.send('Skrunkle CMS is online.')
})

app.use(express.static('public'))
app.use('/static', express.static('public'))

app.listen(port, () => {
  console.log(`Skrunkle CMS listening on port ${port}`)
})
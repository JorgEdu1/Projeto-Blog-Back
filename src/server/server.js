const express = require('express')
const app = express()
const cors = require('cors')

const userRoutes = require('../routes/User.routes')

app.use(express.json())
app.use(cors())
app.use('/user', userRoutes)

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})

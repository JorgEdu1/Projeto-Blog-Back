import express from 'express'
import cors from 'cors'
import userRoutes from '../routes/User.routes.js'
import categoryRoutes from '../routes/Category.routes.js'
import { AuthController } from '../controllers/AuthController.js'
import authenticateToken from '../middlewares/authToken.js'
const app = express()

app.use(express.json())
app.use(cors())

app.post('/login', AuthController.loginUser)

app.use(authenticateToken)

app.use('/user', userRoutes)
app.use('/category', categoryRoutes)

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})

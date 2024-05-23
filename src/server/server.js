import express from 'express'
import cors from 'cors'
import userRoutes from '../routes/User.routes.js'
import categoryRoutes from '../routes/Category.routes.js'
import postRoutes from '../routes/Post.routes.js'
import { AuthController } from '../controllers/AuthController.js'
import authenticateToken from '../middlewares/authToken.js'
const app = express()

app.use(express.json())
app.use(cors())

app.post('/login', AuthController.loginUser)
app.post('/register', AuthController.registerUser)

app.get('/auth', authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: 'Authenticated successfully', user: req.user })
})

app.use(authenticateToken)

app.use('/user', userRoutes)
app.use('/category', categoryRoutes)
app.use('/post', postRoutes)

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})

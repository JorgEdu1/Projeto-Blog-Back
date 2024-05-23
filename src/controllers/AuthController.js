import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export class AuthController {
  static async loginUser(req, res) {
    const { username, password } = req.body

    try {
      const user = await prisma.user.findUnique({
        where: { username },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      )

      return res.status(200).json({ token })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

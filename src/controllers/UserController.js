import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export class UserController {
  static async getUsers(req, res) {
    await prisma.user.findMany().then((users) => {
      return res.status(200).json({
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          icon: user.icon,
          role: user.role,
        })),
      })
    })
  }

  static async createUser(req, res) {
    const { username, email, password, icon, role } = req.body

    try {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          icon,
          role,
        },
      })

      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        icon: user.icon,
        role: user.role,
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params

    await prisma.user
      .findUnique({
        where: {
          id: Number(id),
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          icon: user.icon,
          role: user.role,
        })
      })
  }

  static async updateUser(req, res) {
    const { id } = req.params
    const { username, email, password, icon, role } = req.body

    try {
      const data = { username, email, icon, role }

      if (password) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
        data.password = await bcrypt.hash(password, saltRounds)
      }

      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data,
      })

      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        icon: user.icon,
        role: user.role,
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params

    await prisma.user
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then((user) => {
        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          icon: user.icon,
          role: user.role,
        })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  }
}

export default UserController

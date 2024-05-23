const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()

const prisma = new PrismaClient()

router.get('', async (req, res) => {
  await prisma.user.findMany().then((users) => {
    return res.status(200).json(users)
  })
})

router.post('/create', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
})

module.exports = router

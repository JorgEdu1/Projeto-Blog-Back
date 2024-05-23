import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CategoryController {
  static async getCategories(req, res) {
    await prisma.category.findMany().then((categories) => {
      return res.status(200).json({
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),
      })
    })
  }

  static async createCategory(req, res) {
    const { name } = req.body

    try {
      const category = await prisma.category.create({
        data: {
          name,
        },
      })

      return res.status(201).json({
        id: category.id,
        name: category.name,
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  static async getCategoryById(req, res) {
    const { id } = req.params

    await prisma.category
      .findUnique({
        where: {
          id: Number(id),
        },
      })
      .then((category) => {
        if (!category) {
          return res.status(404).json({ error: 'Category not found' })
        }

        return res.status(200).json({
          id: category.id,
          name: category.name,
        })
      })
  }

  static async updateCategory(req, res) {
    const { id } = req.params
    const { name } = req.body

    await prisma.category
      .update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      })
      .then((category) => {
        return res.status(200).json({
          id: category.id,
          name: category.name,
        })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  }

  static async deleteCategory(req, res) {
    const { id } = req.params

    await prisma.category
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then(() => {
        return res.status(204).send()
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  }
}

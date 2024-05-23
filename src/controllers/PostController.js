import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PostController {
  static async getPosts(req, res) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          category: true,
        },
      })

      return res.status(200).json({
        posts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          author: post.author,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        })),
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar posts' })
    }
  }

  static async createPost(req, res) {
    const { title, content, categoryId } = req.body
    const authorId = req.user.userId

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
          categoryId,
        },
      })
      return res.status(201).json({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        categoryId: post.categoryId,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao criar post' })
    }
  }

  static async getPostById(req, res) {
    const { id } = req.params

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          author: true,
          category: true,
        },
      })

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' })
      }

      return res.status(200).json({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        author: post.author,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar post' })
    }
  }

  static async updatePost(req, res) {
    const { id } = req.params
    const { title, content, categoryId } = req.body
    const authorId = req.user.userId

    try {
      const post = await prisma.post.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          content,
          categoryId,
          authorId,
        },
      })

      return res.status(200).json({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        categoryId: post.categoryId,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao atualizar post' })
    }
  }

  static async deletePost(req, res) {
    const { id } = req.params

    try {
      await prisma.post.delete({
        where: {
          id: Number(id),
        },
      })

      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao deletar post' })
    }
  }
}

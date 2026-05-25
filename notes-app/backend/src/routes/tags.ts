import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  const tags = await prisma.tag.findMany({
    where: { authorId: req.userId },
    include: { _count: { select: { notes: true } } },
    orderBy: { name: 'asc' },
  })
  res.json(tags)
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = z.object({
      name: z.string().min(1).max(50),
      color: z.string().optional(),
    }).parse(req.body)

    const tag = await prisma.tag.create({
      data: { name, color: color || '#6366f1', authorId: req.userId! },
    })
    res.status(201).json(tag)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message })
    res.status(500).json({ error: 'Failed to create tag' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.tag.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

export { router as tagsRouter }

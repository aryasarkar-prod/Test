import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const folderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional().nullable(),
})

router.get('/', async (req: AuthRequest, res: Response) => {
  const folders = await prisma.folder.findMany({
    where: { authorId: req.userId },
    include: { _count: { select: { notes: true } } },
    orderBy: { createdAt: 'asc' },
  })
  res.json(folders)
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = folderSchema.parse(req.body)
    const folder = await prisma.folder.create({
      data: { ...data, authorId: req.userId! },
    })
    res.status(201).json(folder)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message })
    res.status(500).json({ error: 'Failed to create folder' })
  }
})

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = folderSchema.partial().parse(req.body)
    const folder = await prisma.folder.update({
      where: { id: req.params.id },
      data,
    })
    res.json(folder)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update folder' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.folder.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

export { router as foldersRouter }

import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
  noteId: z.string().optional().nullable(),
  subtasks: z.array(z.object({ title: z.string(), completed: z.boolean().optional() })).optional(),
})

router.get('/', async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { authorId: req.userId },
    include: { subtasks: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(tasks)
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { subtasks, ...data } = taskSchema.parse(req.body)
    const task = await prisma.task.create({
      data: {
        ...data,
        authorId: req.userId!,
        subtasks: subtasks ? { create: subtasks } : undefined,
      },
      include: { subtasks: true },
    })
    res.status(201).json(task)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message })
    res.status(500).json({ error: 'Failed to create task' })
  }
})

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { subtasks, ...data } = taskSchema.partial().parse(req.body)
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
      include: { subtasks: true },
    })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.task.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

router.patch('/:id/subtasks/:subtaskId', async (req: AuthRequest, res: Response) => {
  try {
    const sub = await prisma.subTask.update({
      where: { id: req.params.subtaskId },
      data: { completed: req.body.completed },
    })
    res.json(sub)
  } catch {
    res.status(500).json({ error: 'Failed to update subtask' })
  }
})

export { router as tasksRouter }

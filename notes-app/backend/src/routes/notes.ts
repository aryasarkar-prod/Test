import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

const noteSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().optional(),
  folderId: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isPinned: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  isTrashed: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  reminder: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
})

// GET /api/notes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { search, folderId, tagId, starred, pinned, trash } = req.query

    const where: any = {
      authorId: req.userId,
      isTrashed: trash === 'true' ? true : false,
    }

    if (folderId) where.folderId = folderId
    if (starred === 'true') where.isStarred = true
    if (pinned === 'true') where.isPinned = true

    if (tagId) {
      where.tags = { some: { tagId: tagId as string } }
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        folder: { select: { id: true, name: true, color: true } },
        collaborators: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    })

    res.json(notes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

// GET /api/notes/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.userId },
      include: {
        tags: { include: { tag: true } },
        versions: { orderBy: { createdAt: 'desc' }, take: 20 },
        collaborators: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        comments: { include: { author: { select: { id: true, name: true, avatar: true } } } },
      },
    })

    if (!note) return res.status(404).json({ error: 'Note not found' })
    res.json(note)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' })
  }
})

// POST /api/notes
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = noteSchema.parse(req.body)
    const { tagIds, ...noteData } = data

    const note = await prisma.note.create({
      data: {
        ...noteData,
        authorId: req.userId!,
        tags: tagIds ? {
          create: tagIds.map((tagId) => ({ tagId }))
        } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    })

    res.status(201).json(note)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// PATCH /api/notes/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = noteSchema.partial().parse(req.body)
    const { tagIds, ...noteData } = data

    // Save version before update
    const existing = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.userId },
    })
    if (!existing) return res.status(404).json({ error: 'Note not found' })

    // Calculate word count
    if (noteData.content !== undefined) {
      const words = noteData.content.trim().split(/\s+/).filter(Boolean)
      ;(noteData as any).wordCount = words.length
      ;(noteData as any).readTime = Math.ceil(words.length / 200)
      ;(noteData as any).excerpt = noteData.content.replace(/[#*`\[\]]/g, '').trim().slice(0, 120)
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        ...noteData,
        tags: tagIds ? {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    })

    res.json(note)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: 'Failed to update note' })
  }
})

// DELETE /api/notes/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.userId },
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })

    await prisma.note.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

// POST /api/notes/:id/versions — Manual save point
router.post('/:id/versions', async (req: AuthRequest, res: Response) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.userId },
    })
    if (!note) return res.status(404).json({ error: 'Note not found' })

    const version = await prisma.noteVersion.create({
      data: {
        noteId: note.id,
        title: note.title,
        content: note.content,
        authorId: req.userId!,
      },
    })

    res.status(201).json(version)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save version' })
  }
})

// POST /api/notes/:id/collaborators
router.post('/:id/collaborators', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.body
    const collab = await prisma.noteCollaborator.upsert({
      where: { noteId_userId: { noteId: req.params.id, userId } },
      create: { noteId: req.params.id, userId, role: role || 'VIEWER' },
      update: { role: role || 'VIEWER' },
    })
    res.json(collab)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add collaborator' })
  }
})

export { router as notesRouter }

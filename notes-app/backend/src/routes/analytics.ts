import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'
import { subDays, eachDayOfInterval, format } from 'date-fns'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)
    const sevenDaysAgo = subDays(now, 7)

    const [
      totalNotes,
      totalTasks,
      completedTasks,
      notesThisWeek,
      topTags,
      recentNotes,
    ] = await Promise.all([
      prisma.note.count({ where: { authorId: userId, isTrashed: false } }),
      prisma.task.count({ where: { authorId: userId } }),
      prisma.task.count({ where: { authorId: userId, status: 'DONE' } }),
      prisma.note.count({ where: { authorId: userId, createdAt: { gte: sevenDaysAgo } } }),
      prisma.tag.findMany({
        where: { authorId: userId },
        include: { _count: { select: { notes: true } } },
        orderBy: { notes: { _count: 'desc' } },
        take: 6,
      }),
      prisma.note.findMany({
        where: { authorId: userId, isTrashed: false },
        select: { wordCount: true, createdAt: true },
      }),
    ])

    const totalWords = recentNotes.reduce((sum, n) => sum + n.wordCount, 0)

    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now })
    const activityData = days.slice(-7).map((day) => ({
      date: format(day, 'EEE'),
      count: recentNotes.filter(
        (n) => format(n.createdAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length,
    }))

    res.json({
      totalNotes,
      totalWords,
      notesThisWeek,
      streakDays: 12,
      totalTasks,
      completedTasks,
      taskCompletionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      topTags: topTags.map((t) => ({ name: t.name, count: t._count.notes })),
      activityData,
      writingGoal: { current: totalWords, target: 10000 },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

export { router as analyticsRouter }

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import { authRouter } from './routes/auth'
import { notesRouter } from './routes/notes'
import { foldersRouter } from './routes/folders'
import { tagsRouter } from './routes/tags'
import { tasksRouter } from './routes/tasks'
import { analyticsRouter } from './routes/analytics'

dotenv.config()

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 4000

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
})
app.use(limiter)

// Auth routes are more strictly limited
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
})

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', authLimiter, authRouter)
app.use('/api/notes', notesRouter)
app.use('/api/folders', foldersRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/analytics', analyticsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── WebSocket Server ────────────────────────────────────────────────────────

const wss = new WebSocketServer({ server, path: '/ws' })

// Track note rooms: noteId -> Set of WebSocket clients
const noteRooms = new Map<string, Set<WebSocket>>()

interface WSMessage {
  type: 'join' | 'leave' | 'update' | 'cursor' | 'presence'
  noteId: string
  userId?: string
  userName?: string
  payload?: any
}

wss.on('connection', (ws: WebSocket, req) => {
  let currentNoteId: string | null = null
  let currentUserId: string | null = null

  ws.on('message', (raw) => {
    try {
      const msg: WSMessage = JSON.parse(raw.toString())

      switch (msg.type) {
        case 'join': {
          // Leave previous room
          if (currentNoteId && noteRooms.has(currentNoteId)) {
            noteRooms.get(currentNoteId)!.delete(ws)
          }

          // Join new room
          currentNoteId = msg.noteId
          currentUserId = msg.userId || null

          if (!noteRooms.has(currentNoteId)) {
            noteRooms.set(currentNoteId, new Set())
          }
          noteRooms.get(currentNoteId)!.add(ws)

          // Broadcast presence to room
          broadcast(currentNoteId, ws, {
            type: 'presence',
            noteId: currentNoteId,
            payload: { userId: currentUserId, userName: msg.userName, action: 'joined' },
          })
          break
        }

        case 'leave': {
          if (currentNoteId && noteRooms.has(currentNoteId)) {
            noteRooms.get(currentNoteId)!.delete(ws)
            broadcast(currentNoteId, ws, {
              type: 'presence',
              noteId: currentNoteId,
              payload: { userId: currentUserId, action: 'left' },
            })
          }
          currentNoteId = null
          break
        }

        case 'update': {
          // Real-time note content sync
          if (currentNoteId) {
            broadcast(currentNoteId, ws, {
              type: 'update',
              noteId: currentNoteId,
              payload: msg.payload,
            })
          }
          break
        }

        case 'cursor': {
          // Collaborative cursor positions
          if (currentNoteId) {
            broadcast(currentNoteId, ws, {
              type: 'cursor',
              noteId: currentNoteId,
              payload: { userId: currentUserId, ...msg.payload },
            })
          }
          break
        }
      }
    } catch (err) {
      console.error('WS message error:', err)
    }
  })

  ws.on('close', () => {
    if (currentNoteId && noteRooms.has(currentNoteId)) {
      noteRooms.get(currentNoteId)!.delete(ws)
      broadcast(currentNoteId, ws, {
        type: 'presence',
        noteId: currentNoteId,
        payload: { userId: currentUserId, action: 'left' },
      })
    }
  })

  ws.on('error', (err) => {
    console.error('WebSocket error:', err)
  })
})

function broadcast(noteId: string, sender: WebSocket, msg: object) {
  const room = noteRooms.get(noteId)
  if (!room) return
  const data = JSON.stringify(msg)
  room.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

// ─── Error handling ──────────────────────────────────────────────────────────

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

// ─── Start ───────────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`🚀 Noteflow API running on http://localhost:${PORT}`)
  console.log(`🔌 WebSocket server ready on ws://localhost:${PORT}/ws`)
})

export { app, server }

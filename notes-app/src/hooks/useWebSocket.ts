'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface WSMessage {
  type: string
  noteId: string
  payload?: any
}

interface UseWebSocketOptions {
  noteId: string | null
  userId?: string
  userName?: string
  onUpdate?: (payload: any) => void
  onPresence?: (payload: any) => void
  onCursor?: (payload: any) => void
}

export function useWebSocket({
  noteId,
  userId,
  userName,
  onUpdate,
  onPresence,
  onCursor,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [collaborators, setCollaborators] = useState<{ userId: string; userName: string }[]>([])

  const send = useCallback((msg: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  const sendUpdate = useCallback(
    (payload: any) => {
      if (!noteId) return
      send({ type: 'update', noteId, payload })
    },
    [noteId, send]
  )

  const sendCursor = useCallback(
    (position: number) => {
      if (!noteId) return
      send({ type: 'cursor', noteId, payload: { position, userId } })
    },
    [noteId, userId, send]
  )

  useEffect(() => {
    // In production, use: process.env.NEXT_PUBLIC_WS_URL
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws'

    let ws: WebSocket
    let reconnectTimeout: NodeJS.Timeout

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
          setConnected(true)
          if (noteId) {
            ws.send(JSON.stringify({ type: 'join', noteId, userId, userName }))
          }
        }

        ws.onmessage = (event) => {
          try {
            const msg: WSMessage = JSON.parse(event.data)
            switch (msg.type) {
              case 'update':
                onUpdate?.(msg.payload)
                break
              case 'presence':
                onPresence?.(msg.payload)
                if (msg.payload.action === 'joined') {
                  setCollaborators((prev) => [
                    ...prev.filter((c) => c.userId !== msg.payload.userId),
                    { userId: msg.payload.userId, userName: msg.payload.userName },
                  ])
                } else if (msg.payload.action === 'left') {
                  setCollaborators((prev) =>
                    prev.filter((c) => c.userId !== msg.payload.userId)
                  )
                }
                break
              case 'cursor':
                onCursor?.(msg.payload)
                break
            }
          } catch {}
        }

        ws.onclose = () => {
          setConnected(false)
          // Auto-reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000)
        }

        ws.onerror = () => {
          ws.close()
        }
      } catch {
        // WebSocket not available (e.g., in dev without backend)
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimeout)
      if (ws?.readyState === WebSocket.OPEN) {
        if (noteId) {
          ws.send(JSON.stringify({ type: 'leave', noteId }))
        }
        ws.close()
      }
    }
  }, [noteId])

  return { connected, collaborators, sendUpdate, sendCursor }
}

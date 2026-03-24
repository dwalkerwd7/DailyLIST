import 'varlock/auto-load'
import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
const PORT = process.env.PORT!
const COOKIE_KEY = process.env.COOKIE_KEY!
const FULL_CLIENT_PATH = path.join(__dirname, '../../client/dist')
const COOKIE_LIFETIME = 24 * 60 * 60 * 1000

app.use(express.json())
app.use(cookieParser())

/* Serve client build */
app.use(express.static(FULL_CLIENT_PATH))

/* Utility functions */
const calculateTimeLeft = (startTime: number) => {
  const timeLeft = Math.max(0, startTime + COOKIE_LIFETIME - Date.now())
  return timeLeft
}

/* APIs */
app.post('/api/todos', (req, res) => {
  const { todos } = req.body

  if(todos.length === 0) {
    res.clearCookie(COOKIE_KEY)
    return res.json({ ok: true, timeLeft: -1 })
  }

  const existingCookieStartTime = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]).startTime : null
  const startTime = existingCookieStartTime ?? Date.now()
  const timeLeft = calculateTimeLeft(startTime)

  if(timeLeft === 0) {
    res.clearCookie(COOKIE_KEY)
    return res.status(400).json({ ok: false, message: "Cookie has expired. The todo list has been deleted." })
  } else {
    res.cookie(COOKIE_KEY, JSON.stringify({ todos, startTime }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: timeLeft
    })
    return res.json({ ok: true })
  }
})

app.get('/api/todos', (req, res) => {
  const { todos, startTime } = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]) : { todos: [], startTime: null }
  const timeLeft = calculateTimeLeft(startTime)

  if(timeLeft === 0) {
    res.clearCookie(COOKIE_KEY)
    return res.json({ todos: [], expiresAt: null })
  } else {
    return res.json({ todos, expiresAt: startTime + COOKIE_LIFETIME })
  }
})

/* Start the server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
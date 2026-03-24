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

/* APIs */
app.post('/api/todos', (req, res) => {
  const { todos } = req.body

  const existingCookieStartTime = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]).startTime : null
  const startTime = existingCookieStartTime ?? Date.now()
  const expiresAt = startTime + COOKIE_LIFETIME
  const maxAge = Math.max(0, expiresAt - Date.now())

  res.cookie(COOKIE_KEY, JSON.stringify({ todos, startTime }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge
  })

  return res.json({ ok: true, message: "Todos saved successfully." })
})

app.get('/api/todos', (req, res) => {
  const { todos, startTime } = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]) : { todos: [], startTime: null }
  console.log(startTime)
  const timeLeft = startTime ? Math.max(0, (startTime + COOKIE_LIFETIME) - Date.now()) : -1

  if(timeLeft === -1) {
    res.clearCookie(COOKIE_KEY)
    return res.json({ todos: [], timeLeft })
  } else {
    return res.json({ todos, timeLeft })
  }
})

/* Start the server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
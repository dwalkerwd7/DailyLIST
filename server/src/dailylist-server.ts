import 'varlock/auto-load'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT!
const DEV_MODE = process.env.NODE_ENV !== 'production'
const BASE_PATH = process.env.BASE_PATH! || '/'

// matching public dir path on server if in production mode
const PUBLIC_PATH = path.join(__dirname, `../../public${BASE_PATH}`);

const COOKIE_NAME = "dailylist_todos"
const COOKIE_LIFETIME = 24 * 60 * 60 * 1000
const LOG_DIR = path.join(__dirname, process.env.LOG_PATH!)
const FEEDBACK_IPS_PATH = path.join(LOG_DIR, 'feedback_ips.log')
const FEEDBACK_CONTENT_PATH = path.join(LOG_DIR, 'feedback_content.log')

/* Security middleware because tailwind styles are inline */
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
  }
}))

app.use(express.json())
app.use(cookieParser())

/* Serve public dir at base path */
app.use(BASE_PATH, express.static(PUBLIC_PATH))

/* Utility functions */
const initialize = () => {
  fs.mkdirSync(LOG_DIR, { recursive: true })
  if (!fs.existsSync(FEEDBACK_IPS_PATH)) fs.writeFileSync(FEEDBACK_IPS_PATH, '')
  if (!fs.existsSync(FEEDBACK_CONTENT_PATH)) fs.writeFileSync(FEEDBACK_CONTENT_PATH, '')
}

const calculateTimeLeft = (startTime: number) => {
  const timeLeft = Math.max(0, startTime + COOKIE_LIFETIME - Date.now())
  return timeLeft
}

const getSubmittedIPs = (): string[] => {
  if (!fs.existsSync(FEEDBACK_IPS_PATH)) return []
  return fs.readFileSync(FEEDBACK_IPS_PATH, 'utf-8').split('\n').filter(Boolean)
}

/* Run on every startup */
initialize()

/* Middleware to strip base path from api calls. My portfolio server does this automatically, so only need this for dev mode. */
if(DEV_MODE) {
  app.use((req, _res, next) => {
    if (req.url.startsWith(`${BASE_PATH}api/`)) {
      req.url = req.url.slice(BASE_PATH.length) || '/'
    }
    next()
  })
}

/* Todo APIs */
app.post('/api/todos', (req, res) => {
  const { todos } = req.body

  if(todos.length === 0) {
    res.clearCookie(COOKIE_NAME)
    return res.json({ ok: true, timeLeft: -1 })
  }

  const existingCookieStartTime = req.cookies[COOKIE_NAME] ? JSON.parse(req.cookies[COOKIE_NAME]).startTime : null
  const startTime = existingCookieStartTime ?? Date.now()
  const timeLeft = calculateTimeLeft(startTime)

  if(timeLeft === 0) {
    res.clearCookie(COOKIE_NAME)
    return res.status(400).json({ ok: false, message: "Cookie has expired. The todo list has been deleted." })
  } else {
    res.cookie(COOKIE_NAME, JSON.stringify({ todos, startTime }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: timeLeft
    })
    return res.json({ ok: true })
  }
})

app.get('/api/todos', (req, res) => {
  const { todos, startTime } = req.cookies[COOKIE_NAME] ? JSON.parse(req.cookies[COOKIE_NAME]) : { todos: [], startTime: null }
  const timeLeft = calculateTimeLeft(startTime)

  if(timeLeft === 0) {
    res.clearCookie(COOKIE_NAME)
    return res.json({ todos: [], expiresAt: null })
  } else {
    return res.json({ todos, expiresAt: startTime + COOKIE_LIFETIME })
  }
})

/* Feedback APIs */
app.get('/api/feedback', (req, res) => {
  const ip = req.ip!
  const hasSubmitted = getSubmittedIPs().includes(ip)
  return res.json({ hasSubmitted })
})

app.post('/api/feedback', (req, res) => {
  const ip = req.ip!
  if (getSubmittedIPs().includes(ip)) {
    return res.status(409).json({ ok: false, message: 'Feedback already submitted.' })
  }
  fs.appendFileSync(FEEDBACK_IPS_PATH, `${ip}\n`)
  fs.appendFileSync(FEEDBACK_CONTENT_PATH, `IP: ${ip}\n${JSON.stringify(req.body, null, 2)}\n---\n`)

  return res.json({ ok: true })
})

/* SPA fallback */
app.get(`{*splat}`, (_req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, 'index.html'))
})

/* Start the server */
app.listen(PORT, () => {
  console.log(`DailyLIST server running on port ${PORT}`)
})
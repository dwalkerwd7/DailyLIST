import 'varlock/auto-load'
import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
const PORT = process.env.PORT!
const COOKIE_KEY = process.env.COOKIE_KEY!

const FULL_CLIENT_PATH = path.join(__dirname, '../../client/dist')

app.use(express.json())
app.use(cookieParser())

/* Serve client build */
app.use(express.static(FULL_CLIENT_PATH))

/* APIs */
app.post('/api/todos', (req, res) => {
  const { todos } = req.body
  
  res.cookie(COOKIE_KEY, JSON.stringify(todos), { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return res.json({ ok: true, message: "Todos saved successfully." })
})

app.get('/api/todos', (req, res) => {
  const todos = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]) : []
  return res.json(todos)
})

/* SPA fallback */
app.get('{wildcard}', (req, res) => {
  res.sendFile(path.join(FULL_CLIENT_PATH, 'index.html'))
})

/* Start the server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
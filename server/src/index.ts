import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT!
const COOKIE_KEY = process.env.COOKIE_KEY!

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.post('/api/todos', (req, res) => {
  const { todos } = req.body

  if(Object.entries(todos).length === 0) {
    return res.status(400).json({ ok: false, message: 'Empty todos were sent for saving.' })
  }
  
  res.cookie(COOKIE_KEY, JSON.stringify(todos), { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return res.json({ ok: true, message: "Todos saved successfully." })
})

app.get('/api/todos', (req, res) => {
  const todos = req.cookies[COOKIE_KEY] ? JSON.parse(req.cookies[COOKIE_KEY]) : []
  return res.json({ ok: true, todos })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
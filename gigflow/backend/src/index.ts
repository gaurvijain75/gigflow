import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database'
import authRoutes from './routes/authRoutes'
import leadRoutes from './routes/leadRoutes'
import { errorHandler, notFound } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'GigFlow API is running 🚀' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)

// Error handlers (must be last)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app

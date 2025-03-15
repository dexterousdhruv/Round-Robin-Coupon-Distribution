import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { errorResponse } from './utils/error.js'
import { connectDB } from './database/connect.js'
import couponRouter from './routes/coupon.route.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'


config()
const app = express()
const PORT = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
connectDB()


console.log(CLIENT_URL)
app.use(express.json())
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
})) 
app.use(cookieParser())
app.use(
  session({
    secret: "secret-session-key", 
    resave: false,
    saveUninitialized: true,
    cookie: { 
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
  })
);

app.use(couponRouter)
app.use(errorResponse) 

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
  
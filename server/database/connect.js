import { config } from "dotenv"
import mongoose from "mongoose"
config()

export const connectDB = () => {
  mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log(`Error: ${err}`))
}
 

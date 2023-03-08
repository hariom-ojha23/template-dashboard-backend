const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const router = require('./routes/main')

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/v1/main', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})

const dotenv = require('dotenv')
const connectDb = require('./config/db')
const Data = require('./models/dataModel')
const data = require('./seeding/data')

dotenv.config()
connectDb()

const importData = async () => {
  try {
    await Data.deleteMany()
    await Data.insertMany(data)

    console.log('Data Impoorted')
    process.exit()
  } catch (error) {
    console.log(`Error: ${error.message}`)
    process.exit(1)
  }
}

importData()

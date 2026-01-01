import express from 'express'
import 'dotenv/config'
import mongoConnect from './DB/mongo_connection.js'
import registerUsers from './routes/registerUsers.js'

const PORT = 8080
const app = express()
app.use(express.json())
app.use('/api/auth',registerUsers)




app.listen(PORT, ()=>{
    console.log("server running....")
})
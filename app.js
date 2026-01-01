import express from 'express'
import 'dotenv/config'
import registerUsers from './routes/registerUsers.js'
import messagesRouter from './routes/message.js'
import usersRoute from './routes/users.js'
const PORT = 8080
const app = express()
app.use(express.json())
app.use('/api/auth', registerUsers)
app.use('/api/messages', messagesRouter)
app.use('/api/users', usersRoute)


app.listen(PORT, () => {
    console.log("server running....")
})






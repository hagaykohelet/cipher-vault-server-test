import express from 'express'
import mongoConnect from '../DB/mongo_connection.js'
import { ObjectId } from 'mongodb'
import checkUser from '../middleware/checkRegisterUser.js'

const registerUsers = express()
const db = await mongoConnect({
    uri: process.env.MONGO_DB,
    dbname: "kodkod"
})

registerUsers.post('/register', checkUser, async (req, res) => {
    try {
        const newObj = req.body
        const check = await db.collection("users").find({ username:{$eq : newObj.username} }).toArray()
        if (check.length > 0) {
            return res.status(400).send('this name already exist!')
        }
        newObj["encryptedMessagesCount"] = 0
        newObj["createdAt"] = new Date()
        const result = await db.collection("users").insertOne(newObj)
        return res.status(201).json({ id: result.insertedId, username: newObj.username })
    }
    catch (err) {
        return res.status(400).send(String(err))
    }

})







export default registerUsers
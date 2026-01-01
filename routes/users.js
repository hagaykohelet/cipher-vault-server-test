import express from 'express'
import mongoConnect from '../DB/mongo_connection.js'
import checkUserExist from '../middleware/checkUserAccess.js'

const db = await mongoConnect({
    uri: process.env.MONGO_DB,
    dbname: "kodkod"
})


const usersRoute = express()


usersRoute.get('/me',checkUserExist, async(req, res)=>{
    try{
        const{username} = req.headers
        const result = await db.collection("users").findOne({ username: { $eq: username }})
        if (!result){
            return res.status(200).send("user name not found")
        }
        return res.status(200).json({username:username, encryptedMessagesCount:result.encryptedMessagesCount})

    }catch(err){
        return res.status(400).send(String(err))
    }
} )



export default usersRoute
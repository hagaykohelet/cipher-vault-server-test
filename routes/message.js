import checkUserExist from "../middleware/checkUserAccess.js";
import express from 'express'
import supabase from "../DB/supabase_connection.js"
import mongoConnect from "../DB/mongo_connection.js";
const db = await mongoConnect({
    uri: process.env.MONGO_DB,
    dbname: "kodkod"
})

const messagesRouter = express()


messagesRouter.post('/encrypt', checkUserExist, async (req, res) => {
    try {
        const newMessage = req.body
        if (!newMessage) {
            return res.status(400).send("please enter an object!")
        }
        const messageKeys = Object.keys(newMessage)
        if (!(messageKeys.includes("message")) || !(messageKeys.includes("cipherType"))) {
            return res.status(400).send("missing keys")
        }
        if (newMessage.message == "" || newMessage.cipherType == "") {
            return res.status(400).send("please enter a value")
        }
        if (typeof newMessage.message !== "string" || typeof newMessage.cipherType !== "string") {
            return res.status(400).send("the value of keys must be a string")
        }
        if (newMessage.cipherType !== "reverse") {
            return res.status(400).send("the only cipher is reverse!")
        }
        const encryptMessage = newMessage.message.toUpperCase().split("").reverse().join("");
        const newObj = { username: req.headers.username, cipher_type: newMessage.cipherType, encrypted_text: encryptMessage }
        const { data, error } = await supabase.from("messages").insert(newObj).select()
        if (error) {
            return res.status(400).send(error)
        }
        const check = await db.collection("users").updateOne({ username: newObj.username }, { $inc: { encryptedMessagesCount: 1 } })
        return res.status(200).json({ id: data[0].id, cipher_type: data[0].cipher_type, encryptedText: data[0].encrypted_text })
    }
    catch (err) {
        res.status(400).send(String(err))
    }
})

messagesRouter.post('/decrypt', checkUserExist, async (req, res) => {
    try {
        const newMessage = req.body
        if (!newMessage) {
            return res.status(400).send("please enter an object!")
        }
         const messageKeys = Object.keys(newMessage)
        if (!(messageKeys.includes("messageId"))) {
            return res.status(400).send("missing key")
        }
        if(typeof newMessage.messageId !== "number"){
            return res.status(400).send("you need enter type of number")
        }
        const {data, error} = await supabase.from("messages").select().eq("id",newMessage. messageId)
        if(error){
            res.status(400).send(error)
        }
        if(data.length === 0 ){
            return res.status(400).send("id not found!")
        }
        if(data[0].encrypted_text === null){
            return res.status(200).json({id:data[0].id, decryptedText:null, error: "CANNOT_DECRYPT"})
        }
        const decrypt = data[0].encrypted_text.toLowerCase().split("").reverse().join("")
        return res.status(200).send({id:data[0].id, decryptedText:decrypt})
    }catch(err){
        return res.status(400).send(String(err))
    }})





export default messagesRouter



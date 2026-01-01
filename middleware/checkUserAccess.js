import mongoConnect from "../DB/mongo_connection.js"

const db = await mongoConnect({
    uri: process.env.MONGO_DB,
    dbname: "kodkod"
})
export default async function checkUserExist(req, res, next) {
    const { username, password } = req.headers
    if (!username || !password) {
        return res.status(400).send("access denied")
    }
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send("you need enter a string type")
    }
    const check = await db.collection("users").findOne({ username: { $eq: username } })
    if (!check) {
        return res.status(400).send("you not user in system!")
    }
    if (check.password !== password) {
        return res.status(400).send("this password dosent match to username")
    }
    return next()
}



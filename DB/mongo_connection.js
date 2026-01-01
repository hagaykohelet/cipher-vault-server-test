import { MongoClient } from "mongodb";

export default async function mongoConnect({uri, dbname}){
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbname)
    return db
}
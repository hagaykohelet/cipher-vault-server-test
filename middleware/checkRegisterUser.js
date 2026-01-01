export default function checkUser(req, res, next){
    const newObj = req.body
    if(!newObj){
        return res.status(400).send("you need enter an object!")
    }

    const checkKeys = Object.keys(newObj)
    console.log(checkKeys);
    if(checkKeys.length < 2){
        return res.status(400).send("missing keys!")
    }
    if(!(checkKeys.includes("username")) || !(checkKeys.includes("password"))){
        return res.status(400).send("those keys not valid!")
    }
    if(newObj.username === "" || newObj.password === ""){
        return res.status(400).send("you need enter a value")
    }
    if (typeof newObj.password !== "string" || typeof newObj.username !== "string"){
        return res.status(400).send("you need enter a value type of string ")
    }

    return next()
}




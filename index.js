const express = require("express")      // importing express from node modules
const { connectDb } = require("./config/connectDb")    // modeule import


const app = express()
const path = require("path")

const port = 4000


connectDb()


app.get("/" , (req , res)=>{res.sendFile(path.join(__dirname , "index.html"))})
app.get("/user/login" , (req,res) =>{ res.sendFile(path.join(__dirname , "login.html"))})







app.listen(port , ()=>{

console.log(`server listening on port ${port}`)

})
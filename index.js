const express = require("express")      // importing express from node modules
const { connectDb } = require("./config/connectDb")    // modeule import
const app = express()
const path = require("path")
const cors = require("cors")
const bodyParser = require("body-parser")
const { registerController, loginController, getUsers, getUserById } = require("./controllers/userController")
const { isAuthorised } = require("./middleware/isAuthorised")
const { verfiyToken } = require("./controllers/authController")

const port = 4001


connectDb()



//middleware


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())


app.get("/" , (req , res)=>{res.sendFile(path.join(__dirname , "views" , "index.html"))})
app.get("/user/register" , (req,res) =>{ res.sendFile(path.join(__dirname , "views" ,"register.html"))})    
app.get("/user/login" , (req,res) =>{ res.sendFile(path.join(__dirname , "views" ,"login.html"))})


app.post("/user/register" , registerController  )
app.post("/user/login" , loginController )
app.get("/user/getAll" , getUsers)

app.get("/token/verify" , verfiyToken)

app.get("/user/getUser" , isAuthorised , getUserById)



app.listen(port , ()=>{

console.log(`server listening on port ${port}`)

})
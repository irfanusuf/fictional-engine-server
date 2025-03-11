const { User } = require("../models/userModel")




const userDashboard = async (req ,res) =>{

 try {

    const users = await User.find().lean()   // pure json conversion 
    if(users){
        res.render("dashboard" , {title : "Dashboard" , usersARR : users})
    }
 } catch (error) {
    console.log(error)
 }


}



const getUserDetails = async (req ,res) =>{

    try {
   
    const {userId} = req.params
       const user = await User.findById(userId).lean()   // pure json conversion 
       if(user){
           res.render("userDetails" , {title : "Dashboard" , username : user.username})
       }
    } catch (error) {
       console.log(error)
    }
   
   
   }
   



module.exports = {userDashboard , getUserDetails}
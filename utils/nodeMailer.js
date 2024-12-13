const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({

 host :   "smtpout.secureserver.net",
 port : 465,
 secure : true,

 auth : {
    user : "services@stylehouse.world",
    pass: "Ester327811@"
 }

})

module.exports = {transporter}











// const nodemailer = require("nodemailer");
// require('dotenv').config()

// let transporter = nodemailer.createTransport({
//   host: "smtpout.secureserver.net",
//   port: 465,
//   secure: true,

//   auth: {
//     user: "services@stylehouse.world",
//     pass: process.env.MAILER_PASS,
//   },
// });



// module.exports = {transporter}
















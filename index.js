const express = require("express"); // importing express from node modules
const { connectDb } = require("./config/connectDb"); // modeule import
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const xhbs = require("express-handlebars");
const {
  registerController,
  loginController,
  getUsers,
  getUserById,
  deleteUser,
  updatePassWord,
  forgotPass,
  changePass,
} = require("./controllers/userController");
const { isAuthorised } = require("./middleware/isAuthorised");
const { verfiyToken } = require("./controllers/authController");
require("dotenv").config();

const port = process.env.PORT;

connectDb();



//middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser())



app.post("/user/register", registerController); // done
app.post("/user/login", loginController); // done
app.get("/user/getAll", getUsers);
app.get("/user/getUser", isAuthorised, getUserById); // done
app.post("/user/delete", isAuthorised, deleteUser);
app.put("/user/updatePass", isAuthorised, updatePassWord);

app.post("/user/forgot-pass", forgotPass);
app.put("/user/change-pass", changePass);
app.get("/token/verify", verfiyToken);



app.listen(port, () => {
  console.log(`server listening on port `);
});

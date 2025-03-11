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
const { userDashboard, getUserDetails } = require("./controllers/getController");
require("dotenv").config();

const port = process.env.PORT;

connectDb();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views", "pages"));

app.engine(
  "hbs",
  xhbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views", "layout"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));   // static files path
app.use(cookieParser())

// server rendered pages
app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/user/register", (req, res) => {
  res.render("register", { title: "Register" });
});

app.get("/user/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/user/dashboard" , userDashboard)
app.get("/user/details/:userId" , getUserDetails )


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

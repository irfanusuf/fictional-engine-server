const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { messageHandler } = require("../utils/messageHandler");
const { transporter } = require("../utils/nodemailGamil");
// const { transporter } = require("../utils/nodeMailer");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username === "" || email === "" || password === "") {
      return res.render("register", {
        title: "Register",
        ErrorMessage: "All user credentials required ",
      });
    }

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.render("register", {
        title: "Register",
        ErrorMessage: "User with this email already exists!",
      });
    }

    const encrytedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: encrytedPass,
    });

    if (newUser) {
      // return res.render( "register" , { title : "Register" ,  SuccessMessage: "User Created Sucessfully!" });    OR
      return res.redirect("/user/login");
    } else {
      return res.render("register", {
        title: "Register",
        ErrorMessage: "Some error during creating user",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.render("login", {
        title: "Login",
        ErrorMessage: "Email and password both required",
      });
    }

    const finduser = await User.findOne({ email });

    if (!finduser) {
      return res.render("login", {
        title: "Login",
        ErrorMessage: "User with this email not found",
      });
    }
    const passverify = await bcrypt.compare(password, finduser.password);
    if (!passverify) {
      return res.render("login", {
        title: "Login",
        ErrorMessage: "Incorrect password",
      });
    }
    const secretkey = process.env.SECRET_KEY;

    const token =  jwt.sign(
      { role: "user", userId: finduser._id },
      secretkey
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    

    // res.render("login", {
    //   title: "Login",
    //   SuccessMessage: "Logged in succesfully!",
    // });

   res.redirect("/user/dashboard")

  } catch (error) {
    res.render("error", { title: "Error" , ErrorMessage :  error.message });
    console.log(error);
  }
};




const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json({ message: `${users.length} users Found `, users });
  } catch (error) {
    console.error(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ message: "No user Found" });
    }

    res.json({ message: ` user Found `, user });
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return messageHandler(res, 404, "User not Found!");
    }

    const { password } = req.body;

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      return messageHandler(res, 400, "incorrect Password");
    }

    const remove = await User.findByIdAndDelete(userId);

    if (remove) {
      return messageHandler(res, 200, "User Deleted Succesfully");
    } else {
      return messageHandler(res, 500, "Some Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePassWord = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return messageHandler(res, 404, "User not Found!");
    }

    const { oldPass, newPass, confirmPass } = req.body;

    const verifyPass = await bcrypt.compare(oldPass, user.password);

    if (!verifyPass) {
      return messageHandler(res, 400, "incorrect Password");
    }

    if (newPass === confirmPass) {
      const encryptNewPass = await bcrypt.hash(newPass, 10);

      user.password = encryptNewPass;

      const updateDb = await user.save();

      return messageHandler(
        res,
        200,
        "Password Updated Sucessfully!",
        updateDb
      );
    } else {
      return messageHandler(res, 400, "Two passwords Doesnt match");
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return messageHandler(res, 404, "user not found");
    }

    const passwordResetLink = `http:localhost:4000/user/change-pass/?userId=${user._id}`; // front end page link
    const otp = "";

    const sendMail = await transporter.sendMail({
      from: "irfanusuf33@gmail.com",
      to: email,
      subject: "Password reset Link ",
      text: passwordResetLink,
      html: "<h3> Your password reset link is here   </h3>",
    });

    if (sendMail) {
      return messageHandler(
        res,
        200,
        "We have sent mail with password reset link  to your registered mail . Kindly check your mail  "
      );
    } else {
      return messageHandler(res, 400, "something went wrong");
    }

    // transporter.sendMail(
    //   {
    //     from: "services@stylehouse.world",
    //     to: email,
    //     // bcc : "services@stylehouse.world",
    //     subject: "Password reset Link ",
    //     text: passwordResetLink,
    //     // html : "<h1> ur pass link is here all the css in the html string will be inline </h1>"
    //   },
    //   (reject, resolve) => {
    //     if (reject) {
    //       console.log(reject);
    //       return res.status(500).json({ message: "Server Error" });
    //     }

    //     return res.status(200).json({
    //       message: "Password Rest link sent to your mail Succesfully",
    //     });
    //   }
    // );
  } catch (error) {
    console.log(error);
  }
};

const changePass = async (req, res) => {
  try {
    const { newPass, confirmPass } = req.body;
    const { userId } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return messageHandler(res, 404, "User not Found!");
    }

    if (newPass === confirmPass) {
      const encryptNewPass = await bcrypt.hash(newPass, 10);

      user.password = encryptNewPass;

      const updateDb = await user.save();

      return messageHandler(
        res,
        200,
        "Password changed Sucessfully!",
        updateDb
      );
    } else {
      return messageHandler(res, 400, "Two passwords Doesnt match");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerController,
  loginController,
  getUsers,
  getUserById,
  deleteUser,
  updatePassWord,
  forgotPass,
  changePass,
};

const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { messageHandler } = require("../utils/messageHandler");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username === "" || email === "" || password === "") {
      return res.json({ message: "All user credentials required " });
    }

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({ message: "User with this email already exists!" });
    }

    const encrytedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: encrytedPass,
    });

    if (newUser) {
      return res.json({ message: "User Created Sucessfully!" });
    } else {
      return res.json({ message: "Some error during creating user" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.json({ message: "Email and password both required" });
    }

    const finduser = await User.findOne({ email });

    if (!finduser) {
      return res.json({ message: "User with this email not found" });
    }

    const passverify = await bcrypt.compare(password, finduser.password);

    if (!passverify) {
      return res.json({ message: "Incorrect password" });
    }
    const secretkey = "randomstringkuchbhuikjhfnsuyhfsjuh";
    const token = await jwt.sign(
      { role: "user", userId: finduser._id },
      secretkey
    );

    res.json({
      message: "Logged in succesfully!",
      payload: token,
    });
  } catch (error) {
    res.status(500);
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

      return messageHandler(res, 200, "Password Updated Sucessfully!" , updateDb );
    } else {
      return messageHandler(res, 400, "Two passwords Doesnt match" );
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
};

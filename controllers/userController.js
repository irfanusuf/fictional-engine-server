const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");

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
      return res.json({ message: "User Created Sucessfully! " });
    } else {
      return res.json({ message: "Some error during creating user" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerController };

const mongoose = require("mongoose");



const connectDb = async () => {
  try {
    const uri = "";
    await mongoose.connect(uri);
  } catch (error) {
    console.log("Error Connecting Db :" + error);
  }
};

module.exports = { connectDb };

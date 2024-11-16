const mongoose = require("mongoose");



const connectDb = async () => {
  try {
    const uri = "mongodb+srv://irfanusuf33:robolox@robolox.xnj0z.mongodb.net/newDb?retryWrites=true&w=majority&appName=robolox";
  
    await mongoose.connect(uri);
    console.log("Database Connected!")

  } catch (error) {
    console.log("Error Connecting Db:" + error);
  }
};

module.exports = { connectDb };

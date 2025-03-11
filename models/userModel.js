const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  blogs : [
    {
      type : mongoose.Schema.Types.ObjectId , ref : "Blog"
    }
  ]
});


module.exports = {User}

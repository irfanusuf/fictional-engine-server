const mongoose = require("mongoose");

const Blog = mongoose.model("Blog", {
  blogTitle: { type: String },
  blogDesc: { type: String },
  blogDescShort: { type: String },
  blogImageUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  category: { type: String },
});

module.exports = { Blog };

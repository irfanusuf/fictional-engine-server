const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  productName: String,
  productImgUrl : String,
  productprice: Number,
  productQty: Number,
  productColor : String
});


module.exports = {Product}
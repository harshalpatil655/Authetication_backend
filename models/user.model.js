const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  email: String,
  password: String,
  age: Number,
});

const SignupModel = mongoose.model("signup", SignupSchema);

module.exports = { SignupModel };

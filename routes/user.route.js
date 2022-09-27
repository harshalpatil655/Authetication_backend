const { Router } = require("express");
const { SignupModel } = require("../models/user.model");
const { NoteModel } = require("../models/note.model");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

const UserRoute = Router();

UserRoute.post("/signup", (req, res) => {
  const { email, password, age } = req.body;
  bcrypt.hash(password, 6, async function (err, hash) {
    const user = SignupModel({ email, password: hash, age });
    await user.save();
  });

  res.send("Post Signup Successfull");
});

UserRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await SignupModel.findOne({ email });
  let hash = user.password;
  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      let token = jwt.sign({ email }, "secret");
      res.send(token);
    } else {
      res.send(err);
    }
  });
});

const check = (req, res, next) => {
  let { title, note, label } = req.body;
  if (
    title &&
    typeof title == "string" &&
    note &&
    typeof note == "string" &&
    label &&
    typeof label == "string"
  ) {
    next();
  } else {
    res.send("Invalid key");
  }
};

UserRoute.post("/create", check, (req, res) => {
  const token = req.headers.authetication;

  jwt.verify(token, "secret", async function (err, decoded) {
    if (decoded.email && token) {
      const { title, note, label } = req.body;
      const data = NoteModel({ email: decoded.email, title, note, label });
      await data.save();
      console.log(data);
      res.send("Successfully Authorised");
    } else {
      res.send(err);
    }
  });
});

UserRoute.get("/dashboard", (req, res) => {
  const token = req.headers.authetication;

  jwt.verify(token, "secret", async function (err, decoded) {
    if (decoded.email && token) {
      let data = await NoteModel.find({ email: decoded.email });
      console.log(data);
      res.send(data);
    } else {
      res.send(err);
    }
  });
});

UserRoute.patch("/update", (req, res) => {
  const token = req.headers.authetication;

  jwt.verify(token, "secret", async function (err, decoded) {
    if (decoded.email && token) {
      const { title, newtitle } = req.body;
      await NoteModel.findOneAndUpdate(
        { email: decoded.email, title },
        { title: newtitle }
      );
      let data = await NoteModel.findOne({
        email: decoded.email,
        title: newtitle,
      });
      res.send(data);
    } else {
      res.send(err);
    }
  });
});

UserRoute.delete("/delete", (req, res) => {
  const token = req.headers.authetication;

  jwt.verify(token, "secret", async function (err, decoded) {
    if (decoded.email && token) {
      const { title } = req.body;
      await NoteModel.findOneAndDelete({
        email: decoded.email,
        title,
      });
      let data = await NoteModel.find();

      res.send(data);
    } else {
      res.send(err);
    }
  });
});

module.exports = { UserRoute };

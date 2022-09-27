const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  email: String,
  title: String,
  note: String,
  label: String,
});

const NoteModel = mongoose.model("note", NoteSchema);

module.exports = { NoteModel };

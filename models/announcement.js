const mongoose = require("mongoose");

const announcement = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers"
  },
  name: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model("announcement", announcement);

module.exports = Announcement;

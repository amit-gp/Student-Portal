var mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  subject: {
    type: String,
  },
  marks: {
    type: Number,
  },
});

var resultSchema = mongoose.Schema({
  subjects: {
    type: [subjectSchema],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cgpa: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);

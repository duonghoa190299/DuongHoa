const mongoose = require("mongoose");

const stallSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stall", stallSchema);

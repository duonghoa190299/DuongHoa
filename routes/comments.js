const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/Comment");
const Stall = require("../models/Stall");

router.get("", (req, res) => {});

router.post("/", (req, res) => {
  Stall.findById(req.params.id, (err, stall) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          stall.comments.push(comment);
          stall.save();
          res.redirect(`/stalls/${stall._id}`);
        }
      });
    }
  });
});

module.exports = router;

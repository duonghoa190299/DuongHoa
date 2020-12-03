const express = require("express");
const router = express.Router();
const Stall = require("../models/Stall");
const middleware = require("../middleware/middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("stalls/newStall");
});
router.get("/manager", middleware.isLoggedIn, (req, res) => {
  Stall.find({}, (err, allStall) => {
    if (err) console.log(err);
    else {
      res.render("stalls/managerStall", {
        allStall: allStall,
      });
    }
  });
});
// add a new stall
router.post("/new", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newStall = { name, image, description, price, author };
  Stall.create(newStall, (err, newlyStall) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// show detail
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Stall.findById(id)
    .populate("comments")
    .exec((err, foundStall) => {
      if (err) {
        console.log(err);
      } else {
        res.render("stalls/showDetails", {
          foundStall: foundStall,
        });
      }
    });
});

// form edit
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
  const id = req.params.id;
  Stall.findById(id, (err, foundStall) => {
    if (err) {
      console.log(err);
    } else {
      res.render("stalls/editStall", {
        foundStall: foundStall,
      });
    }
  });
});

router.put("/:id", middleware.isLoggedIn, (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.desc;
  const price = req.body.price;
  const newStall = { name, image, description, price };
  Stall.findByIdAndUpdate(id, newStall, (err, updatedStall) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/stalls/" + updatedStall._id);
    }
  });
});

router.delete("/:id", middleware.isLoggedIn, (req, res) => {
  Stall.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const { signin, signup, getMe } = require("../controllers/user.js");


router.post("/signin", signin);
router.post("/signup", signup);
router.get("/me", getMe);

module.exports = router;

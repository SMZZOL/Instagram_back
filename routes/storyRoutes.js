const express = require("express")
const router = express.Router()
const storyController = require("../controllers/storyController")
const JWTverify = require("../middleware/JWTverify")

router.use(JWTverify);

router.route('/')
    .post(storyController.createNewStory)

module.exports = router
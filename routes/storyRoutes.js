const express = require("express")
const router = express.Router()
const storyController = require("../controllers/storyController")

router.route('/')
    .post(storyController.createNewStory)

module.exports = router
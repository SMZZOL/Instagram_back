const express = require("express")
const router = express.Router()
const feedsController = require("../controllers/feedsController")

router.route('/')
    .post(feedsController.createNewFeed)

router.route('/getfeedsbyid').post(feedsController.getFeedsbyid)
router.route('/getallfeeds').post(feedsController.getAllFeeds)
router.route('/changeLikes').post(feedsController.changeLiked)

module.exports = router
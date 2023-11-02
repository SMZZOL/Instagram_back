const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')
const JWTverify = require("../middleware/JWTverify")

router.route('/checkemail').post(userController.checkEmail)
router.route('/checkuserid').post(userController.checkUserid)
router.route('/')
    .post(userController.createNewUser)

router.use(JWTverify);

router.route('/')
    .get(userController.getAllUsers)
    .patch(userController.updateUser)

router.route('/:id')
    .get(userController.getUserById)
    
router.route('/follows').post(userController.getFollowsbyId)
router.route('/search').post(userController.searchUser)

module.exports = router

const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .patch(userController.updateUser)

router.route('/:id')
    .get(userController.getUserById)
    
router.route('/follows').post(userController.getFollowsbyId)
router.route('/search').post(userController.searchUser)
router.route('/checkemail').post(userController.checkEmail)
router.route('/checkuserid').post(userController.checkUserid)

module.exports = router

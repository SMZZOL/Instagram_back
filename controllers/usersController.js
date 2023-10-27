const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

const getUserById = asyncHandler(async (req, res) => {
    const userid = req.params.id;
    const user = await User.findOne({userid}).lean().exec()
    if(!user){
        console.log("해당 유저 없음")
        return res.status(400).json({message:"해당 유저 없음"})
    }
    

    res.json({ ...user });
})
const getFollowsbyId = asyncHandler(async(req, res)=>{
    const {userid} = req.body;
    console.log(req.body)
    const user = await User.findOne({userid}).select('following follower').lean().exec();
    console.log(user)

    console.log(user.follower)
    console.log(typeof user.follower)
    const followers = await User.find({ _id: { $in: user.follower } }).lean().select('userid profile_img username').exec();
    const followings = await User.find({ _id: { $in: user.following } }).lean().select('userid profile_img username').exec();

    res.json({followers, followings})
})

const checkEmail = asyncHandler(async (req, res) => {
    const {email} = req.body
    const checkeduser = await User.findOne({email}).lean().exec()
    console.log("email check:"+email)

    if(!email){return res.status(400).json({message:"이메일을 입력해주세요."})}

    if(checkeduser){
        res.status(409).json({ message: '이미 존재하는 이메일입니다' })
    }else{
        res.status(201).json({ message: 'Available Email' })
    }

})
const checkUserid = asyncHandler(async (req, res) => {
    const {userid} = req.body

    const checkeduser = await User.findOne({userid}).lean().exec()
    console.log(userid)
    console.log(checkeduser)
    if(checkeduser){
        res.status(409).json({ message: '이미 존재하는 아이디입니다' })
    }else{
        res.status(201).json({ message: 'Available userid' })
    }

})

const searchUser = asyncHandler(async(req, res)=>{
    const {searchword} = req.body;
    console.log(searchword)
    const users = await User.find({ userid: { $regex: `^${searchword}` } }).select('-password').lean();
    console.log(users)
    if(!users){
        console.log("유저 검색 결과 없음")
        return res.status(400).json({message:"유저 검색 결과 없음"})
    }
    

    res.json(users);
})

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, email, userid } = req.body
    // Confirm data
    console.log(password, email, userid)
    if (!userid||!email||!password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, email, userid }
    console.log(userObject)

    // Create and store new user   
    const user = await User.create(userObject)
    if (user) { 
        res.status(201).json({ message: `New user ${userid} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

const updateUser = asyncHandler(async(req, res)=>{
    const {email, _id, userid, password,username,follower, following} = req.body.updateduser;

    console.log(userid)
    console.log(follower)
    console.log(following)

    if (!email || !_id || !userid || !password){
        console.log("모든 항목이 채워지지 않았습니다")
        return res.status(400).json({ message: '모든 항목이 채워지지 않았습니다' })
    }

    const user = await User.findById(_id).exec()

    if (!user) {
        console.log("해당 유저 없음")
        return res.status(400).json({ message: '해당 유저 없음' })
    }
    
    user.email = email;
    user.userid = userid;
    user.password = password;
    user.username = username;
    user.follower = follower;
    user.following = following;

    await user.save()
    // console.log(user)
    res.sendStatus(201)
})


module.exports ={
    getAllUsers,
    checkEmail,
    checkUserid,
    createNewUser,
    getUserById,
    updateUser,
    searchUser,
    getFollowsbyId
}
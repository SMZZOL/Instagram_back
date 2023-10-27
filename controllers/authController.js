const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const login = asyncHandler(async(req, res)=>{
    console.log(req.body)
    console.log(req.body)
    console.log(req.body)
    const  {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"모든 입력창을 입력해 주세요"})
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: "해당 이메일은 존재하지 않습니다" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(401).json({ message: "비밀번호가 틀립니다" });
    const accessToken = jwt.sign(
    {
        UserInfo: {
            userid: foundUser.userid,
            email:foundUser.email,
            _id:foundUser._id
        },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    console.log(accessToken)
    // Send accessToken containing username and roles
    res.json({ accessToken });

    

})


module.exports = {
    login,
    // refresh,
    // logout,
};

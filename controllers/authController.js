const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const login = asyncHandler(async(req, res)=>{


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
    { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
    { _id:foundUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "20m" }
    ); 

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    res.json({ accessToken });

    
  

})
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const foundUser = await User.findOne({
            _id: decoded._id,
        }).exec();
        if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userid: foundUser.userid,
                    email:foundUser.email,
                    _id:foundUser._id
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
            );

        res.json({ accessToken });
        })
    );
};
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
};


module.exports = {
    login,
    refresh,
    logout,
};

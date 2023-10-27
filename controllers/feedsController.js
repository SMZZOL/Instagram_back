const Feed = require('../models/Feed')
const User = require("../models/User")
const asyncHandler = require("express-async-handler")

const createNewFeed = asyncHandler(async(req, res)=>{
    const {user,content, files}= req.body
    files.map((file)=>{
        if(!file.type.startsWith("image/")){
            console.log("이미지 파일의 형식이 아닙니다.")
            return res.status(416).json({message:"이미지 파일의 형식이 아닙니다."})
        }
    })
    const founduser = await User.findOne({userid:user}).exec()


    const feeddata = {
        user:founduser._id,
        content,
        files: files.map((file, i) =>({
            data:file.data,
            taged:file.taged
        })),
    }
    // console.log(typeof feeddata.files[0])
    const newFeed = await Feed.create(feeddata)

    if(newFeed){
        founduser.feeds = [...founduser.feeds, newFeed._id]
        await founduser.save();
        res.status(201).json({ message: `업로드 성공` })
    }else{
        res.status(400).json({ message: `Uploaded Complete` })
    }
})

const getFeedsbyid = asyncHandler(async (req, res)=>{//로그인된 계정피드

    const {userid} = req.body

    const {feeds} = await User.findOne({userid}).exec()
    // const followings = await User.find({ _id: { $in: user.following } }).lean().exec();

    const Feeds = await Feed.find({_id:{ $in : feeds}}).lean().exec();

    res.json(Feeds)

})
const getAllFeeds = asyncHandler(async (req, res)=>{//로그인된 계정의 팔로워들 피드

    const {userid} = req.body;

    const user= await User.findOne({userid}).exec();

    let feedids=[];

    const followers = await User.find({_id:{$in : user.follower}}).exec();

    followers.map((follower)=>{
        feedids = [...feedids, ...follower.feeds]
    })
    const Feeds = await Feed.find({_id:{ $in : feedids}}).lean().exec();

    Feeds.map((feed)=>{
        const {userid} = followers.find(follower=>follower._id.equals(feed.user))
        feed.userid =userid;
    })


    res.json(Feeds)
})

//게시물 좋아요 추가 및 취소
const changeLiked = asyncHandler(async (req, res)=>{
    const {feed_id, user_id} =req.body

    const feed = await Feed.findOne({_id:feed_id}).exec();

    console.log(feed.likes)
    feed.likes = feed.likes.includes(user_id)
    ?feed.likes.filter(id => !id.equals(user_id))
    :[...feed.likes, user_id]
    await feed.save();

    res.sendStatus(201)
})





module.exports={
    createNewFeed,
    getAllFeeds,
    getFeedsbyid,
    changeLiked
}
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


// router.get("/", (req,res) => {
//     res.send("posts router");
// });
//投稿を作成
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        return res.status(200).json(savePost);
    } catch (err){
        return res.status(500).json(err);
    }
});

//投稿を更新
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        return res.status(200).json("Post edited successfully");
      } else {
        return res.status(403).json("You can only edit your own posts");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  });

//delete
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // console.log("Post User ID:", post.userId);
        // console.log("Request Body User ID:", req.body.userId);

        if(post.userId === req.body.userId){
            await post.deleteOne();
            return res.status(200).json("deleted");
        } else {
            return res.status(403).json("cannnot delete other peoples post");
        }
    } catch (err){
        return res.status(403).json(err);
    }
});

//投稿を取得
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err){
        return res.status(403).json(err);
    }
});

//like the post 
router.put("/:id/like", async (req, res)=> {
        try {
            // まだいいねを押していなければいいね可能
            const post = await Post.findById(req.params.id);
            //すでに相手をフォローしているのかの条件分岐
            //自分が相手のフォロワーに含まれているかを確認。いなければフォロー可能
            if(!post.likes.includes(req.body.userId)){
                //mongooseのメソッド
                await post.updateOne({
                    $push: {
                        // 相手アカウントのフォロワーarray に挿入
                        likes: req.body.userId,
                    },
                });
                return res.status(200).json("投稿に良いねしました");
            } else {
                // いいねを取り除く
                await post.updateOne({
                    $pull: {
                        likes: req.body.userId,
                    },
                });
                return res.status(403).json("いいねを外しました");
            }
        } catch(err){
            return res.status(500).json(err);
        }
    } 
);

//94 profile専用
router.get("/profile/:username", async(req, res)=> {
    try{
        const user = await User.findOne({username: req.params.username});
        const posts = await Post.find({ userId: user._id});
        return res.status(200).json(posts)
    } catch (err){
        return res.status(500).json(err);
    }
});

//33 timeline post 
router.get("/timeline/:userId", async(req, res)=> {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id});
        //follow しているアカウントの投稿内容を取得
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) =>{
                return Post.find({ userId: friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err){
        return res.status(500).json(err);
    }
});

module.exports = router;


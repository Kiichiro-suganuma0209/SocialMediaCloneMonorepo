const router = require("express").Router();
const User = require("../models/User");

//CRUD
//ユーザー情報の更新
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("ユーザー情報更新されました");

        }catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403)
        .json("自身のアカウントでないため更新できません");
    }
});
//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ユーザー情報削除されました");

        }catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403)
        .json("自身のアカウントでないため削除できません");
    }
});
//ユーザー情報の取得 timeline 表示に使う
// router.get("/:id", async(req, res) => {
//         try{
//             const user = await User.findById(req.params.id);
//             const { password, updatedAt, ...other } = user._doc;
//             return res.status(200).json(other);
//         }catch(err){
//             return res.status(500).json(err);
//         }
// });

//95 クエリで情報を取得
router.get("/", async(req, res) => {
    const userId = req.query.useId;
    const username = req.query.usename;
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username: username});
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
});

// 23. ユーザーのフォロー
router.put("/:id/follow", async (req, res)=> {
    if(req.body.useId !== req.params.id){
        try {
            //これからフォローする相手の情報
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //すでに相手をフォローしているのかの条件分岐
            //自分が相手のフォロワーに含まれているかを確認。いなければフォロー可能
            if(!user.followers.includes(req.body.userId)){
                //mongooseのメソッド
                await user.updateOne({
                    $push: {
                        // 相手アカウントのフォロワーarray に挿入
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $push: {
                        // フォロー中配列に挿入
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローに成功しました");
            } else {
                return res.status(403).json("あなたはすでこのユーザーをにフォローしています");
            }
        } catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身をフォローできません");
    }
});

// 25. ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res)=> {
    if(req.body.useId !== req.params.id){
        try {
            //これからフォローする相手の情報
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //すでに相手をフォローしているのかの条件分岐
            //自分が相手のフォロワーに含まれているかを確認。いなければフォロー可能
            //自分がフォロワーに含まれていたらアンフォローできる
            if(user.followers.includes(req.body.userId)){
                //mongooseのメソッド
                await user.updateOne({
                    $pull: {
                        // 相手アカウントのフォロワーarray に挿入
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $pull: {
                        // フォロー中配列に挿入
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォロー解除しました");
            } else {
                return res.status(403).json("アンフォローできません");
            }
        } catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身をアンフォローできません");
    }
});


//初期コード
// router.get("/", (req,res) => {
//     res.send("users router");
// });

module.exports = router;
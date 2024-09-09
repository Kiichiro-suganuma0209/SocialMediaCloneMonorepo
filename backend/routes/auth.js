const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// user登録ハッシュかあり
// router.post('/register', async (req, res) => {
//     try {
//         // パスワードのハッシュ化
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//         });

//         const user = await newUser.save();
//         res.status(200).json(user);
//     } catch (err) {
//         console.error(err); // エラーをコンソールに表示
//         res.status(500).json(err);
//     }
// });

//ハッシュ化なし
router.post('/register', async (req, res) => {
    try {
        // パスワードをそのまま保存（非推奨）
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password, // ここでハッシュ化をしない
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err); // エラーをコンソールに表示
        res.status(500).json(err);
    }
});


// ログイン
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json('ユーザーが見つかりません');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json('パスワードが違います');
        }
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({user, token });
    } catch (err) {
        console.error(err); // エラーをコンソールに表示
        res.status(500).json(err);
    }
});

module.exports = router;

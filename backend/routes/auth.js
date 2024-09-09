const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


require('dotenv').config();  // .envファイルを読み込む
// user登録ハッシュかあり
router.post('/register', async (req, res) => {
    try {
        // パスワードのハッシュ化
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err); // エラーをコンソールに表示
        res.status(500).json(err);
    }
});
router.put("/:id", async (req, res) => {
    try {

    } catch (err){
        return res.status(500).json(err);
    }
});

function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}
function sendResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // 使用するメールサービス（例: Gmail）
        auth: {
            user: 'your-email@gmail.com', // あなたのメールアドレス
            pass: 'your-email-password'   // あなたのメールのパスワード（またはアプリパスワード）
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Please use the following token to reset your password: ${token}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
// const { generateResetToken } = require('./utils');


// router.post("/forgot-password", async (req, res) => {
//     try {
//         const { email } = req.body;
//         console.log("Requested email: ", email);
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.log("User not found");
//             return res.status(404).json("User not found");
//         }
//         const token = generateResetToken();
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 36000000;

//         await user.save();
//         sendResetEmail(user.email, token);
//         return res.status(200).json("Reset link sent");
//     } catch (err) {
//         console.log("Error: ", err);
//         return res.status(500).json(err);
//     }
// });

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Requested email: ", email);  // デバッグ用のログ
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json("User not found");
        }
        const token = generateResetToken();
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 36000000;

        await user.save();
        sendResetEmail(user.email, token);
        return res.status(200).json("Reset link sent: " + token);
    } catch (err) {
        console.error("Error occurred: ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});


//ハッシュ化なし
// router.post('/register', async (req, res) => {
//     try {
//         // パスワードをそのまま保存（非推奨）
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password, // ここでハッシュ化をしない
//         });

//         const user = await newUser.save();
//         res.status(200).json(user);
//     } catch (err) {
//         console.error(err); // エラーをコンソールに表示
//         res.status(500).json(err);
//     }
// });


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
        console.log("サーバーエラー", err); // エラーをコンソールに表示
        res.status(500).json(err);
    }
});

module.exports = router;

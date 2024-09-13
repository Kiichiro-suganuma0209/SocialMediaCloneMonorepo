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

// router.put("/reset-password/:token", async (req, res) => {
//     try{
//         const {token} = req.params;
//         const {password} = req.body;

//         const user = await User.findOne({
//             resetToken: token,
//             resetTokenExpiration: {$gt: Date.now()}
//         });
//         if(!user){
//             return res.status(404).json("Invalid or expired token");
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;

//         user.resetToken = null;
//         user.resetTokenExpiration = null;

//         await user.save();

//         return res.status(200).json("Password has been reset");

//     }catch(err){
//         // return res.status(500).json(err);
//         console.error("Error occurred: ", err);
//         return res.status(500).json({ message: "Internal server error", error: err });
//     }
// })



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
        const resetLink = `http://localhost:8000/api/auth/reset-password/${token}`;


        const emailContent = `Hello ${user.email},You have requested to reset your password. Please click the following link to reset it:
          
          ${resetLink}
          
          This link will expire in 1 hour.`;

        //   sendResetEmail(user.email, token);
        return res.status(200).json({
            message: "Reset link sent: ",
            resetLink: resetLink,
            emailContent: emailContent
    });
    } catch (err) {
        console.error("Error occurred: ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});

// routes/auth.js
// const router = require('express').Router();

router.get("/test", (req, res) => {
    res.send("Test endpoint is working");
});

module.exports = router;

router.put("/:token", async (req, res) => {
    try {
        console.log("PUT request received for reset-password with token:", req.params.token);
        res.status(200).json({ message: "PUT request received" });
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// router.put("/reset-password/:token", async (req, res) => {
    // router.put("/:token", async (req, res) => {
    //     console.log("PUT request received for reset-password with token:", req.params.token);
    //     res.status(200).json({ message: "PUT request received" });

        // try {
    
        //     const { token } = req.params;
        //     const { password } = req.body;
    
        //     // トークンと有効期限をチェックしてユーザーを取得
        //     const user = await User.findOne({
        //         resetToken: token,
        //         resetTokenExpiration: { $gt: Date.now() }  // トークンの有効期限がまだ残っているか
        //     });
    
        //     if (!user) {
        //         console.error("Invalid or expired token");
        //         return res.status(400).json("Invalid or expired token");
        //     }
    
        //     // 新しいパスワードをハッシュ化
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     user.password = hashedPassword;
    
        //     // トークンを無効にして保存
        //     user.resetToken = null;
        //     user.resetTokenExpiration = null;
        //     await user.save();
    
        //     return res.status(200).json("Password has been reset");
        // } catch (err) {
        //     // エラーメッセージをコンソールに出力
        //     // console.log("Error occurred:", err);
        //     // return res.status(500).json(err);
        //     console.error("Error occurred: ", err);
    
        // }
    // });
    router.put("/reset-password/:token", async (req, res) => {
        try {
            // トークンとリクエストボディのパスワードを取得
            const { token } = req.params;
            const { password } = req.body;
    
            // トークンと有効期限をチェックしてユーザーを取得
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() }  // トークンの有効期限が残っているか
            });
    
            if (!user) {
                // 無効なトークンまたは期限切れ
                console.error("Invalid or expired token");
                return res.status(400).json({ message: "Invalid or expired token" });
            }
    
            // 新しいパスワードが送信されているかチェック
            if (!password || password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
    
            // 新しいパスワードをハッシュ化
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
    
            // トークンを無効にし、保存
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save();
    
            return res.status(200).json({ message: "Password has been reset successfully" });
        } catch (err) {
            // エラーハンドリング
            console.error("Error occurred during password reset: ", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    
    router.put("/:token", async (req, res) => {
        try {
            console.log("PUT request received for reset-password with token:", req.params);
            res.status(200).json({ message: "PUT request received" });
        } catch (err) {
            console.error("Error occurred:", err);
            res.status(500).json({ message: "Internal server error" });
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
        console.log("サーバーエラー", err); // エラーをコンソールに表示
        res.status(500).json(err);
    }
});
router.put("/testput", (req, res) => {
    res.status(200).json({ message: "Simple PUT request successful" });
});




module.exports = router;

// const router = require("express").Router();
// const multer = require("multer");
// const User = require("../models/User");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // 画像アップロードAPI
// router.post("/", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("img upload successed");
//   } catch (err) {
//     console.log(err);
//   }
// });
// // CoverImgアップロードAPI
// router.post("/cover", upload.single("file"), async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json("User not found");
//     }

//     user.coverPicture = req.file.filename;
//     await user.save();

//     return res.status(200).json({ filename: req.file.filename });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json(err);
//   }
// });

// module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const User = require("../models/User");
const path = require("path");

// ストレージの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // 画像ファイルの保存先
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ファイル名の設定
  },
});

const upload = multer({ storage });

// 画像アップロードAPI
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("img upload successed");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err); // エラーレスポンスを追加
  }
});

// CoverImgアップロードAPI
router.post("/cover", upload.single("file"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    user.coverPicture = req.file.filename; // カバー画像のファイル名を保存
    await user.save();

    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// 新しいカバー画像アップロードAPI
router.post("/uploadCover", upload.single("file"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    user.coverPicture = req.file.filename; // カバー画像のファイル名を保存
    await user.save();

    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

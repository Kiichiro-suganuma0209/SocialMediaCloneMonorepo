const express = require("express");
const cors = require("cors");

const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT =  8000;
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config();

mongoose.connect(
    // process.env.MONGOURL
    "mongodb+srv://kiichirosuganuma0209:GxUPpiQx1GAniw9N@cluster0.6t6faoi.mongodb.net/realsns2?retryWrites=true&w=majority&appName=Cluster0"

)
.then(() => {
    console.log("DB接続中");
}).catch((err) => {
    console.log(err);

})
.then(() => {
    console.log("DB接続中");
}).catch((err) => {
    console.log(err);
});

// CORS設定
app.use(cors({
    origin: "http://localhost:3000", // フロントエンドのURL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

// ミドルウェア
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);  // ここでauthRouteを使用
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.use("/images", express.static("public/images"));



app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(PORT, () => console.log("サーバーが起動しました"));

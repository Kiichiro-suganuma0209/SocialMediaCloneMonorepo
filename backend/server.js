const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT =  8000;
const mongoose = require("mongoose");
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

// ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);  // ここでauthRouteを使用しています
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(PORT, () => console.log("サーバーが起動しました"));

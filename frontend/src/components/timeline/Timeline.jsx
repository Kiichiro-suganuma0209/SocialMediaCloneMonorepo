import React, { useContext, useEffect, useState } from "react";
import "./Timeline.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom"; // useParamsをインポート
import axios from "../../axios";

export default function Timeline({ gridView = false, showShare = true }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // エラーステートの追加
  const { user } = useContext(AuthContext);
  const { user: currentUser } = useContext(AuthContext);

  console.log("Current user:", currentUser);
  console.log("Current user:", currentUser.user.username);
  console.log("Current user:", currentUser.user._id);

  const { username } = useParams(); // useParamsを使ってusernameを取得

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // currentUser.user._idを使ってタイムラインの投稿を取得
        const response = await axios.get(
          `/posts/timeline/${currentUser.user._id}`
        );

        // デバッグ用ログ
        console.log("Timeline posts fetched:", response.data);

        // 投稿データが存在するかチェック
        if (response.data.length > 0) {
          setPosts(response.data); // 正常にデータが取得できた場合はステートに保存
        } else {
          setError("No posts available"); // 投稿がない場合のエラーメッセージ
        }
      } catch (err) {
        console.error("Error fetching timeline posts:", err.message);
        setError("Failed to fetch timeline posts.");
      }
    };

    // currentUserが正しく存在するか確認
    if (currentUser && currentUser.user && currentUser.user._id) {
      fetchPosts();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // if (!currentUser && !(user && user._id)) {
        if (!currentUser || !currentUser.user._id) {
          throw new Error("No valid username or user ID");
        }

        // デバッグ用ログ
        console.log("Fetching posts for user:", username || user._id);

        const response = currentUser.user.username
          ? await axios.get(`/posts/profile/${currentUser.user.username}`) // URLから取得したusernameを使用
          : await axios.get(`/posts/timeline/${currentUser.user._id}`); // userのIDを使用

        console.log("Posts fetched:", response.data);
        setPosts(response.data); // フェッチした投稿をステートに保存
        setError(null); // エラーをリセット
      } catch (err) {
        console.error(
          "Error fetching posts:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to fetch posts.");
      }
    };

    // usernameもuser._idもない場合は何もしない
    if (username || (user && user._id)) {
      fetchPosts();
    }
  }, [username, user]);

  return (
    <div className="timeline">
      <div className={`timelineWrapper ${gridView ? "gridView" : ""}`}>
        {showShare && <Share />}
        {error ? (
          <div className="error">{error}</div> // エラーメッセージ表示
        ) : (
          posts.map((post) => (
            <div className="postWrapper" key={post._id}>
              <Post post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

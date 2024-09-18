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

  const { username } = useParams(); // useParamsを使ってusernameを取得

  // useEffect(() => {
  //   console.log("Username from URL (useParams):", username);
  //   console.log("User context from AuthContext:", user);

  //   const fetchPosts = async () => {
  //     try {
  //       if (!username && !(user && user._id)) {
  //         throw new Error("No valid username or user ID");
  //       }

  //       console.log("Fetching posts for:", username || user._id);

  //       const response = username
  //         ? await axios.get(`/posts/profile/${username}`) // URLから取得したusernameを使用
  //         : await axios.get(`/posts/timeline/${user._id}`); // userのIDを使用

  //       console.log("Posts fetched:", response.data);
  //       setPosts(response.data);
  //       setError(null);
  //     } catch (err) {
  //       console.log(
  //         "Error fetching posts:",
  //         err.response ? err.response.data : err.message
  //       );
  //       setError("Failed to fetch posts.");
  //     }
  //   };

  //   if (username || (user && user._id)) {
  //     fetchPosts();
  //   }
  // }, [username, user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!username && !(user && user._id)) {
          throw new Error("No valid username or user ID");
        }

        // デバッグ用ログ
        console.log("Fetching posts for user:", username || user._id);

        const response = currentUser.user.username
          ? await axios.get(`/posts/profile/${currentUser.user.username}`) // URLから取得したusernameを使用
          : await axios.get(`/posts/timeline/${user._id}`); // userのIDを使用

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

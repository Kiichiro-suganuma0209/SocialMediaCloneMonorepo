import React, { useContext, useEffect, useState } from "react";
import "./Timeline.css";
import Share from "../share/Share";
import Post from "../post/Post";
// import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";

export default function Timeline({
  username,
  gridView = false,
  showShare = true,
}) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // エラーステートの追加
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("Username:", username);
    console.log("User context:", user);
    // const fetchPosts = async () => {
    //   try {
    //     console.log("Fetching posts for:", username || user._id); // デバッグ用ログ
    //     const response = username
    //       ? await axios.get(`/posts/profile/${username}`)
    //       : await axios.get(`/posts/timeline/${user._id}`);
    //     console.log("Posts fetched:", response.data); // デバッグ用ログ
    //     setPosts(response.data);
    //     setError(null);
    //   } catch (error) {
    //     console.error(
    //       "Error fetching posts:",
    //       error.response ? error.response.data : error.message
    //     );
    //     setError("Failed to fetch posts.");
    //   }
    // };
    const fetchPosts = async () => {
      try {
        if (!username && !(user && user._id)) {
          throw new Error("No valid username or user ID");
        }

        console.log("Fetching posts for:", user || user._id);

        const response = username
          ? // ? await axios.get(`/posts/profile/${username}`)
            await axios.get(`/posts/profile/${username}`)
          : await axios.get(`/posts/timeline/${user._id}`);

        console.log("Posts fetched:", response.data);
        setPosts(response.data);
        setError(null);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to fetch posts.");
      }
    };

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

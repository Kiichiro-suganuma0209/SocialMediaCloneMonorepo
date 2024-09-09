import React, { useEffect, useState, useContext } from "react";
import "./Post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { AuthContext } from "../../context/AuthContext";

Modal.setAppElement("#root");

export default function Post({ post, onDelete }) {
  // onDeleteプロップを追加
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [desc, setDesc] = useState(post.desc);

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users?userId=${post.userId}`);
        setUser(response.data);
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!currentUser) return;
    try {
      await axios.put(`/posts/${post._id}`, { userId: currentUser._id, desc });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });
      onDelete(post._id); // 削除後に親コンポーネントの関数を呼び出して状態を更新
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture || PUBLIC_FOLDER + "/person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUserName">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{desc}</span>
          <img src={PUBLIC_FOLDER + post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={PUBLIC_FOLDER + (isLiked ? "/redHeart.png" : "/heart.png")}
              alt=""
              className="likeIcon"
              onClick={handleLike}
            />
            <span className="postLikeCounter">{like} people liked</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Edit Post"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Post</h2>
        <textarea
          className="modalTextarea"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleEdit}>Save</button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button
          onClick={handleDelete}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete
        </button>{" "}
        {/* 削除ボタンを追加 */}
      </Modal>
    </div>
  );
}

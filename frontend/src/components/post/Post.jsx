import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./Post.css";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Post({ post, onDelete }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isOpen, setIsOpen] = useState(false); // モーダルの状態管理
  const [desc, setDesc] = useState(post.desc);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });

      console.log("Post Deleted");

      onDelete(post._id);
      setIsOpen(false);
      window.location.reload();

      // onDelete(post._id); // 削除後に親コンポーネントの関数を呼び出して状態を更新
      // setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.put(`/posts/${post._id}`, {
        userId: currentUser._id,
        desc: desc,
      });
      console.log("Post Updated:", response.data);

      setIsOpen(false);
      window.location.reload();

      // await axios.put(`/posts/${post._id}`, { userId: currentUser._id, desc });
      // setIsOpen(false); // モーダルを閉じる
    } catch (err) {
      console.error(err);
    }
  };

  // モーダル開閉に関するログを追加してデバッグする
  const openModal = () => {
    console.log("Opening modal");
    setIsOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsOpen(false);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PUBLIC_FOLDER + user.profilePicture
                    : PUBLIC_FOLDER + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert
              style={{ cursor: "pointer" }}
              onClick={openModal} // モーダルを開く
            />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img
            className="postImg"
            src={PUBLIC_FOLDER + "/images/" + post.img}
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={PUBLIC_FOLDER + "/images/heart.png"}
              alt=""
              onClick={handleLike}
            />
            <span className="postLikeCounter">
              {like}人がいいねを押しました
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment}:コメント</span>
          </div>
        </div>
      </div>

      {/* モーダル部分 */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal} // モーダル外クリックで閉じる
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
        <button onClick={closeModal}>Cancel</button> {/* モーダルを閉じる */}
        <button
          onClick={handleDelete}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete
        </button>
      </Modal>
    </div>
  );
}

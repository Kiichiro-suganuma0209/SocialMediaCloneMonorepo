import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
// import axios from "axios";
import axios from "../../axios";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  // const [user, setUser] = useState({});
  // const [file, setFile] = useState(null);
  // const [followers, setFollowers] = useState([]);
  const { user: currentUser } = useContext(AuthContext); // 現在ログインしているユーザーを取得
  console.log("Current user in Sidebar:", currentUser);

  const [user, setUser] = useState(currentUser); // デフォルトではログインしているユーザーを表示
  const [file, setFile] = useState(null);
  const [followers, setFollowers] = useState([]);

  // useParams を使って URL からユーザー名を取得
  const { username } = useParams();

  useEffect(() => {
    if (!username) {
      console.error("Username is undefined");
    }
  }, [username]);

  // ユーザー情報を取得
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`/users?username=${username}`);
  //       console.log("User data:", response.data); // デバッグ用
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error(
  //         "Error fetching user:",
  //         error.response ? error.response.data : error.message
  //       );
  //     }
  //   };
  //   fetchUser();
  // }, [username]);

  // useEffect(() => {
  //   if (username && username !== currentUser.username) {
  //     const fetchUser = async () => {
  //       try {
  //         const response = await axios.get(`/users?username=${username}`);
  //         setUser(response.data);
  //       } catch (error) {
  //         console.error(
  //           "Error fetching user:",
  //           error.response ? error.response.data : error.message
  //         );
  //       }
  //     };
  //     fetchUser();
  //   } else {
  //     setUser(currentUser); // ログインしているユーザーのプロフィールを表示
  //   }
  // }, [username, currentUser]);
  useEffect(() => {
    const fetchUser = async () => {
      const username =
        currentUser?.username || currentUser?.user?.username || ""; // 正しいプロパティを参照
      if (username) {
        try {
          const response = await axios.get(`/users?username=${username}`);
          setUser(response.data);
        } catch (error) {
          console.error(
            "Error fetching user:",
            error.response ? error.response.data : error.message
          );
        }
      } else {
        console.error("Username is undefined or empty");
      }
    };
    fetchUser();
  }, [currentUser]);

  // ファイル変更のハンドリング
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ファイルアップロードのハンドリング
  const handleUpload = async () => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("userId", user._id);

      try {
        const res = await axios.post("/api/upload/cover", data);
        const updatedUser = { ...user, coverPicture: res.data.filename };
        setUser(updatedUser);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };
  const followersList = async (userId) => {
    try {
      const res = await axios.get(`/users/followers/${userId}`);
      console.log("Followers data:", res.data); // ここでデータを確認

      setFollowers(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error");
    }
  };
  const handleFollow = async (userId) => {
    try {
      await axios.put(`users/${userId}/follow`, { userId: username });
    } catch (err) {
      // console.error(err);
      console.log(err);
    }
  };

  return (
    <>
      <Topbar />

      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <section className="profileCover">
            <h1 className="hello">Hi</h1>
            {/* デバッグ用: PUBLIC_FOLDER と user.coverPicture の確認 */}
            {console.log("PUBLIC_FOLDER:", PUBLIC_FOLDER)}
            {console.log("user.coverPicture:", user.coverPicture)}

            <img
              src={
                user.coverPicture
                  ? PUBLIC_FOLDER + "/images/" + user.coverPicture
                  : PUBLIC_FOLDER + "/post/3.jpeg" // デフォルト画像
              }
              alt="Profile Cover"
              className="profileCoverImg"
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
          </section>

          <section className="below">
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <button onClick={handleFollow}>follow</button>
              <button onClick={async () => await followersList(user._id)}>
                followers
              </button>

              <button>followings</button>

              <span className="profileInfoDesc">{user.desc}</span>
            </div>
            {/* フォロワーリスト表示 */}
            <ul>
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <li key={follower._id}>
                    <img
                      src={
                        follower.profilePicture || "default_profile_picture_url"
                      }
                      alt={follower.username}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }} // プロフィール画像のスタイルを調整
                    />
                    <span>{follower.username}</span>
                  </li>
                ))
              ) : (
                <li>No followers found</li>
              )}
            </ul>
          </section>

          <div className="profileRightBottom">
            <Timeline username={username} gridView={true} pageType="profile" />
          </div>
        </div>
      </div>
    </>
  );
}

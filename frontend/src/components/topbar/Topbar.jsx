// import React, { useContext } from "react";
// import "./Topbar.css";
// import {
//   Chat,
//   Notifications,
//   Person,
//   Search,
//   Logout // ログアウトアイコンを追加
// } from "@mui/icons-material";
// import { Link, useHistory } from "react-router-dom"; // useHistoryを使ってリダイレクト
// import { AuthContext } from "../../context/AuthContext";

// export default function Topbar() {
//   const { user, dispatch } = useContext(AuthContext); // dispatchを追加
//   const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
//   const history = useHistory();

//   // ログアウト処理
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // トークンを削除
//     dispatch({ type: "LOGOUT" }); // グローバルなユーザー状態をリセット
//     history.push("/login"); // ログイン画面にリダイレクト
//   };

//   return (
//     <div className="topbarContainer">
//       <div className="topbarLeft">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <span className="logo">Real SNS</span>
//         </Link>
//       </div>
//       <div className="topbarCenter">
//         <div className="searchbar">
//           <Search className="searchIcon" />
//           <input
//             type="text"
//             className="searchInput"
//             placeholder="探し物は何ですか？"
//           />
//         </div>
//       </div>
//       <div className="topbarRight">
//         <div className="topbarIcons">
//           <div className="topbarIconItem">
//             <Chat />
//             <span className="topbarIconBadge">2</span>
//           </div>
//           <div className="topbarIconItem">
//             <Notifications />
//             <span className="topbarIconBadge">1</span>
//           </div>
//           <Link to={`/profile/${user.username}`}>
//             <img
//               src={
//                 user.profilePicture
//                   ? PUBLIC_FOLDER + user.profilePicture
//                   : PUBLIC_FOLDER + "person/noAvatar.png"
//               }
//               alt=""
//               className="topbarImg"
//             />
//           </Link>
//           {/* ログアウトボタン */}
//           <div className="topbarIconItem" onClick={handleLogout}>
//             <Logout />
//             <span className="logoutText">Logout</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useContext } from "react";
import "./Topbar.css";
import {
  Chat,
  Notifications,
  Person,
  Search,
  Logout, // ログアウトアイコンを追加
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // useHistoryを使ってリダイレクト
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext); // dispatchを追加
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useNavigate();

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token"); // トークンを削除
    dispatch({ type: "LOGOUT" }); // グローバルなユーザー状態をリセット
    history.push("/login"); // ログイン画面にリダイレクト
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Real SNS</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="探し物は何ですか？"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PUBLIC_FOLDER + user.profilePicture
                  : PUBLIC_FOLDER + "person/noAvatar.png"
              }
              alt=""
              className="topbarImg"
            />
          </Link>
          {/* ログアウトボタン */}
          <div className="topbarIconItem" onClick={handleLogout}>
            <Logout />
            <span className="logoutText">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

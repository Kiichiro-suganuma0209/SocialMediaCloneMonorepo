import React, { useContext, useRef } from "react";
import "./Login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigateをフックとして利用

  // const handleClick = async (e) => {
  //   e.preventDefault();

  //   // ログイン処理の開始　エラーが指定している行が73
  //   loginCall(
  //     { email: email.current.value, password: password.current.value },
  //     dispatch
  //   );
  // };
  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // 非同期処理の完了を待つ
  //     await loginCall(
  //       { email: email.current.value, password: password.current.value },
  //       dispatch
  //     );
  //   } catch (err) {
  //     console.error("ログイン処理中にエラーが発生しました: ", err);
  //   }
  // };

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(email.current.value);
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  const handleReset = () => {
    navigate("/reset");
  };
  const handleHomeClick = () => {
    navigate("/");
  };

  // ローディング状態かエラーがある場合のUI変更
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Real SNS</h3>
          <span className="loginDesc">本格的なSNSを、自分の手で。</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <p className="loginMsg">ログインはこちら</p>
            <input
              type="email"
              className="loginInput"
              placeholder="Eメール"
              required
              ref={email}
              disabled={isFetching} // ローディング中は入力を無効化
            />
            <input
              type="password"
              className="loginInput"
              required
              minLength="6"
              placeholder="パスワード"
              ref={password}
              disabled={isFetching} // ローディング中は入力を無効化
            />
            <button
              className="loginButton"
              // disabled={isFetching}
              // onClick={handleHomeClick}
            >
              {isFetching ? "ローディング中..." : "ログイン"}
            </button>
            {error && (
              <span className="loginError">
                ログインに失敗しました。再試行してください。
              </span>
            )}
          </form>

          <div className="otherbox">
            <button
              className="loginForgot"
              // onClick={handleReset}
            >
              パスワードを忘れた方へ
            </button>
            <button
              className="loginRegisterButton"
              disabled={isFetching}
              onClick={handleRegisterClick}
            >
              アカウント作成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useRef, useContext } from "react";
// import { loginCall } from "../../apiCalls"; // loginCall関数をインポート
// import { AuthContext } from "../../context/AuthContext"; // AuthContextをインポート
// import CircularProgress from "@mui/material/CircularProgress"; // ローディング表示用

// export default function Login() {
//   // emailとpasswordの参照を作成
//   const email = useRef();
//   const password = useRef();
//   const { user, isFetching, dispatch } = useContext(AuthContext);

//   const handleClick = (e) => {
//     e.preventDefault(); // ページのリロードを防ぐ
//     loginCall(
//       { email: email.current.value, password: password.current.value },
//       dispatch
//     );
//   };

//   console.log(user); // ログイン後のユーザー情報を確認

//   return (
//     <div className="login">
//       <div className="loginWrapper">
//         <div className="loginLeft">
//           <h3 className="loginLogo">MyApp</h3>
//           <span className="loginDesc">
//             Connect with friends and the world around you on MyApp.
//           </span>
//         </div>
//         <div className="loginRight">
//           <form className="loginBox" onSubmit={handleClick}>
//             <input
//               placeholder="Email"
//               type="email"
//               required
//               className="loginInput"
//               ref={email}
//             />
//             <input
//               placeholder="Password"
//               type="password"
//               required
//               minLength="6"
//               className="loginInput"
//               ref={password}
//             />
//             <button className="loginButton" type="submit" disabled={isFetching}>
//               {isFetching ? <CircularProgress size="20px" /> : "Log In"}
//             </button>
//             <span className="loginForgot">Forgot Password?</span>
//             <button className="loginRegisterButton">
//               {isFetching ? (
//                 <CircularProgress size="20px" />
//               ) : (
//                 "Create a New Account"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

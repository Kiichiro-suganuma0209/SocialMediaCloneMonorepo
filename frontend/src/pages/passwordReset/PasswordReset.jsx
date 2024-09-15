import React, { useContext, useRef } from "react";
import "./Login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();

    // ログイン処理の開始　エラーが指定している行が73
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
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
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? "ローディング中..." : "ログイン"}
            </button>
            {error && (
              <span className="loginError">
                ログインに失敗しました。再試行してください。
              </span>
            )}
            <span className="loginForgot">パスワードを忘れた方へ</span>
            <button className="loginRegisterButton" disabled={isFetching}>
              アカウント作成
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

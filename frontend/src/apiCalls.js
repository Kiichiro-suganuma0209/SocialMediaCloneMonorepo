// import axios from "axios";
// import { LoginStart, LoginSuccess, LoginError } from "../apiCall.js"

// export const loginCall = async (user, dispatch) => {
//   dispatch({ type: "LOGIN_START" }); // dispatch(LoginStart(user)) こちらでも可です。
//   try {
//     const res = await axios.post("auth/login", user);
//     dispatch({ type: "LOGIN_SUCCESS", payload: res.data }); // dispatch(LoginSuccess(user)) こちらでも可です。
//   } catch (err) {
//     dispatch({ type: "LOGIN_ERROR", payload: err }); // dispatch(LoginError(err)) こちらでも可です。
//   }
// };

import axios from "axios";

// loginCall関数の定義とエクスポート
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    //この下の行がエラーを吐いている
    const res = await axios.post("http://localhost:8000/api/auth/login", userCredentials, {
        headers: {
            "Content-Type": "application/json"  // リクエストヘッダーの設定
          }
    });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    // dispatch({ type: "LOGIN_FAILURE", payload: err });
    dispatch({ type: "LOGIN_FAILURE", payload: err.response ? err.response.data : err.message });

  }
};

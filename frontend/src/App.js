import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import Topbar from "./components/topbar/Topbar"; // Topbarをインポート

function App() {
  const { user } = useContext(AuthContext);

  return (

    <Router>
      {/* ログインしている場合のみTopbarを表示 */}
      {/* {user && <Topbar />}  */}
      
      <Routes>
        {/* ホームページへのルート */}
        <Route path="/" element={user ? <Home /> : <Register />} />
        
        {/* ログインページへのルート */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        {/* 登録ページへのルート */}
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        {/* <Route path="/reset" element={user ? <Navigate to="/" /> : <Register />}
        /> */}
        
        {/* プロフィールページへのルート */}
        <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>

  );
}

export default App;

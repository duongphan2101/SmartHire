import "./App.css";
import "./styles/colors.css";

import Home from "./pages/HomePage/Home";
import Login from "./pages/Started/Login";
import Register from "./pages/Started/Register";
import Intro from "./pages/Introduction/Intro";
import BuildCV from "./pages/buildCV/BuildCV";
import Profile from "./pages/Profile/Profile";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/buildcv" element={<BuildCV />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

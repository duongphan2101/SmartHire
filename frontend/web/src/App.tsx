import './App.css'
import './styles/colors.css'

import Home from './pages/HomePage/Home'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Started/Login";
import Register from "./components/Started/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );

}

export default App;

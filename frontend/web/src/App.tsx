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
      </Routes>
    </Router>
  );
}

export default App;

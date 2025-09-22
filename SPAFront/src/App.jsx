import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./modules/Login";
import RegisterForm from "./modules/Register";
import Dashboard from "./modules/dashboard/Dashboard";
import { UserProvider } from "./context/UserContext";
import "./App.css";
import MyCourses from "./modules/myCourses/MyCourses";
import PCourses from "./modules/pcourses/PCourses";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Ejemplos */}
          <Route path="/perfil" element={<h2>Perfil</h2>} />
          <Route path="/ajustes" element={<h2>Ajustes</h2>} />
          <Route path="/mis-cursos" element={<MyCourses/>} />
          <Route path="/cursos" element={<PCourses/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

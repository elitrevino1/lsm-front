import './App.css';
import CustomNavbar from "./Components/CustomNavbar";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Aprende from './Views/Aprende';
import Practica from './Views/Practica';
import Leccion from './Views/Leccion';

function App() {
  return (
    <>
      <CustomNavbar />

      <BrowserRouter>
        <Routes>
          <Route path="/aprende" element={<Aprende />} />
          <Route path="/practica" element={<Practica />} />
          <Route path="/aprende/leccion" element={<Leccion />} />
          <Route path="*" element={<Navigate replace to="/aprende" />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;

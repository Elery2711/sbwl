import './App.css'
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './AppRoutes';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />  
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App

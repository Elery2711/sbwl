import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Login } from "./pages/login";
import { Home } from "./pages/all-users/home";
import PrivateRoute from "./PrivateRoute";
import { Unauthorized } from "./pages/unauthorized";

const AppRoutes = () => {
  const authContext = useAuth();

  const { authToken } = authContext.authState;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authToken ? "/home" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute allowedRoles={["admin","capturista"]} />}>
        <Route path="/home" element={<Home/>} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
      </Route>
      <Route element={<PrivateRoute allowedRoles={["capturista"]} />} >
      </Route>
      <Route path="/unauthorized" element={< Unauthorized/>} />
    </Routes>
  );
};

export default AppRoutes;

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex border-2 items-center justify-center fixed left-0 top-0 w-full py-5 px-20 text-sm font-light bg-white shadow-sm h-24 bg-blue-100">
      <div className="flex">NavBar</div>
      <div className="flex justify-end ml-auto">
        {authState.authToken ? (
          <div>
            <button className="mr-4" onClick={navigateToHome}>
              Inicio
            </button>
            <button className="mr-4" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

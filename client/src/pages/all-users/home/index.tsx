import { useAuth } from "../../../context/AuthContext";

export const Home = () => {
  const authContext = useAuth();
  const { user } = authContext.authState;


  return (
      <div className="w-full h-full">
        {user && (
          <h1>
            {user.rol} Bienvenido {user.nombre + " " + user.apellido}
          </h1>
        )}
      </div>
  );
};

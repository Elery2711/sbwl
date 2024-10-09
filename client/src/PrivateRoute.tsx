import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from './components/Layout';

const PrivateRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const { authState, setAuthState } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean|null>(null);

  useEffect(() => {
    if (authState.isLoading) {
      return;
    }

    const verifyAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
          headers: {
            Authorization: `${authState.authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Not authorized");
        }

        const data = await response.json();
        
        if (
          data.message === "Token is valid" &&
          authState.user && allowedRoles.includes(authState.user.rol)
        ) {
          setIsAuthorized(true);
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        setAuthState({ ...authState, authToken: null });
        setIsAuthorized(false);
        console.log(error);
      }
    };

    if (authState.authToken) {
      verifyAuth();
    } else {
      setIsAuthorized(false);
    }
  }, [authState, setAuthState, allowedRoles]);

  if (authState.isLoading) {
    return (
      <Layout>
        <div className="mt-4">Cargando...</div>
      </Layout>
    );
  }

  if (isAuthorized === null) {
    return <div className="mt-4">Cargando...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;

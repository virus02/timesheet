import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        if(isMounted) {
          await refresh();
        }
      } catch(err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    !auth?.token ? verifyRefreshToken() : setIsLoading(false);
    return () => {
      isMounted = false;
    };

  }, [auth?.token, refresh]);

  useEffect(() => {

  }, [auth?.token, isLoading]);

  return(
    <>
      {isLoading
        ? <p>Loading...</p>
        : <Outlet />
      }
    </>  
  )
}

export default PersistLogin
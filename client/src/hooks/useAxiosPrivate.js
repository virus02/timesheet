import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if(!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => {
        console.log(response);
        return response
      },
      async (error) => {
        const prevRequest = error?.config;
        if(error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch(refreshError) {
            console.error('Token refresh failed:', refreshError);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }  
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    }
  }, [auth, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate;
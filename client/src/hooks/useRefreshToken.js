import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();
  

  const refresh = async () => {
    
    const response = await axios.get(`/refresh`,{
      withCredentials: true
    });
    
    setAuth(prev => {
      return { 
        ...prev,
        role: response.data.role,
        token: response.data.token }
    });

    return response.data.token;
  }
  return refresh;
}

export default useRefreshToken;
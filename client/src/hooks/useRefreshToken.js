import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    
    const response = await axios.get(`/refresh?email=${auth.email}`,{
      withCredentials: true
    });
    
    setAuth(prev => {
      return { ...prev, token: response.data.token }
    });

    return response.data.token;
  }
  return refresh;
}

export default useRefreshToken;
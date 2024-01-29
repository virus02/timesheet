import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import useAuth from "../hooks/useAuth";

function Layout() {
  const { auth } = useAuth();
  return (
    <main>
      {auth?.email ? 
        (
          <div>
            <Header />
            <Outlet />
          </div>
        ) 
        :(
          <Outlet />
        )
      }
     
    </main>
  )
}

export default Layout;
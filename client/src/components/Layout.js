import { Outlet } from "react-router-dom";
import Header from "./header/Header";

function Layout() {
  return (
      <main>
        <Header />
        <Outlet />
      </main>
  )
}

export default Layout;
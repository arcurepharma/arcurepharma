
import routes from "../dependencies/route";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  return (
    <>
      <div>
        <Navbar route={routes} />
        <div className="main-body">
          <Outlet />
        </div>
      </div>
    </>
  );
}
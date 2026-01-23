import routes from "../dependencies/route";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";
import WhatsAppButton from "./WhatsAppButton";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbar route={routes} />
        <div className="main-body flex-grow-1">
          <Outlet />
        </div>
        <FloatingCart />
        <WhatsAppButton />
        <Footer />
      </div>
    </>
  );
}

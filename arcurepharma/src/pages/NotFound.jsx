import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="background-modern">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="content">
          <h3 className="heading-h3">📦 Arcurepharma</h3>
          <h2 className="heading-h2">404</h2>
          <small className="oops">OOPS! PAGE NOT FOUND</small>
          <button className="home-btn" onClick={() => navigate("/")}>
            GO BACK HOME
          </button>
        </div>
      </div>
    </>
  );
}

export default NotFound;

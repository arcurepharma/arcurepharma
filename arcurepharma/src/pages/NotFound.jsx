import { useNavigate } from "react-router-dom";
import HeroSection from "../components/shared/HeroSection";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-modern">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="container section-spacing">
          <HeroSection
            subtitle="📦 Arcurepharma"
            title={
              <>
                <span className="text-gradient">404</span>
              </>
            }
            description="OOPS! PAGE NOT FOUND"
          >
            <button
              className="btn btn-modern-submit premium-btn px-5 mt-4"
              onClick={() => navigate("/")}
            >
              GO BACK HOME
            </button>
          </HeroSection>
        </div>
      </div>
    </>
  );
}

export default NotFound;

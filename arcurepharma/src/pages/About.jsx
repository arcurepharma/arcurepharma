import aboutData from "../dependencies/aboutData";
import HeroSection from "../components/shared/HeroSection";
import GlassCard from "../components/shared/GlassCard";

export default function About() {
  return (
    <>
      <div className="bg-modern d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          <HeroSection
            subtitle="Who We Are"
            title={
              <>
                Redefining <span className="text-gradient">Healthcare</span>
              </>
            }
            description="At Arcurepharma, we combine science and compassion to create pharmaceutical solutions that change lives."
          />

          {/* Cards Grid */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <GlassCard className="text-start">
                <div className="icon-box">🚀</div>
                <h4 className="fw-bold mb-3">Our Story</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.story}
                </p>
              </GlassCard>
            </div>
            <div className="col-md-4">
              <GlassCard className="text-start">
                <div className="icon-box">🎯</div>
                <h4 className="fw-bold mb-3">Our Mission</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.mission}
                </p>
              </GlassCard>
            </div>
            <div className="col-md-4">
              <GlassCard className="text-start">
                <div className="icon-box">💡</div>
                <h4 className="fw-bold mb-3">Our Vision</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.vision}
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Values Section */}
          <div className="row justify-content-center mt-5 mb-5">
            <div className="col-12 text-center mb-4">
              <h2 className="heading-h2" style={{ fontSize: "2.5rem" }}>
                Our Core Values
              </h2>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-3">
                <h5 className="fw-bold">Integrity</h5>
                <p className="small op-7">Doing what is right</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-3">
                <h5 className="fw-bold">Innovation</h5>
                <p className="small op-7">Science led</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-3">
                <h5 className="fw-bold">Quality</h5>
                <p className="small op-7">Excellence always</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-3">
                <h5 className="fw-bold">Care</h5>
                <p className="small op-7">Patient first</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

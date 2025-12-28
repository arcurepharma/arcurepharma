import aboutData from "../dependencies/aboutData";

export default function About() {
  return (
    <>
      <div className="background-modern d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          {/* Hero Section */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="hero-subtitle">Who We Are</span>
              <h1 className="hero-title mb-4">
                Redefining <span className="text-gradient">Healthcare</span>
              </h1>
              <p
                className="lead op-8"
                style={{ fontSize: "1.25rem", fontWeight: 300 }}
              >
                At Arcurepharma, we combine science and compassion to create
                pharmaceutical solutions that change lives.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="glass-card text-start">
                <div className="icon-box">🚀</div>
                <h4 className="fw-bold mb-3">Our Story</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.story}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card text-start">
                <div className="icon-box">🎯</div>
                <h4 className="fw-bold mb-3">Our Mission</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.mission}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card text-start">
                <div className="icon-box">💡</div>
                <h4 className="fw-bold mb-3">Our Vision</h4>
                <p className="op-7 small" style={{ textAlign: "justify" }}>
                  {aboutData.vision}
                </p>
              </div>
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

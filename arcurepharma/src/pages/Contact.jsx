import contactInfo from "../dependencies/contactInfo";

export default function Contact() {
  return (
    <>
      <div className="backgroung-modern d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          {/* Hero Section */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="hero-subtitle">Get In Touch</span>
              <h1 className="hero-title mb-4">
                Let's Start a{" "}
                <span className="text-gradient">Conversation</span>
              </h1>
              <p
                className="lead op-8"
                style={{ fontSize: "1.25rem", fontWeight: 300 }}
              >
                Have questions or want to learn more about our work? We're here
                to help.
              </p>
            </div>
          </div>

          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="glass-card">
                <h3 className="fw-bold mb-4">Send us a Message</h3>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="text-white-50 mb-2 small">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control glass-input"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="text-white-50 mb-2 small">
                          Your Email
                        </label>
                        <input
                          type="email"
                          className="form-control glass-input"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="text-white-50 mb-2 small">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control glass-input"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="text-white-50 mb-2 small">
                          Message
                        </label>
                        <textarea
                          className="form-control glass-input"
                          rows="4"
                          placeholder="Write your message here..."
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="button"
                        className="btn btn-modern-submit w-100"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4 h-100">
                {/* Info Card 1 */}
                <div className="glass-card d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    📍
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Our Location</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.address.line1},<br />
                      {contactInfo.address.line2}
                    </p>
                  </div>
                </div>

                {/* Info Card 2 */}
                <div className="glass-card d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    📞
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Phone Number</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.phone.number}
                      <br />
                      {contactInfo.phone.hours}
                    </p>
                  </div>
                </div>

                {/* Info Card 3 */}
                <div className="glass-card d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    ✉️
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Email Address</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.email.primary}
                      <br />
                      {contactInfo.email.support}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

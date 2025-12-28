import React, { useState, useEffect } from "react";

export default function ComingSoon() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2026-01-25T00:00:00") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value) => String(value || 0).padStart(2, "0");

  return (
    <>
      <div className="backgroung-modern_home d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="hero-subtitle">Arcurepharma</span>
              <h1 className="hero-title mb-4">
                Coming <span className="text-gradient">Soon</span>
              </h1>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-auto">
              <div className="countdown">
                <div>
                  <span>{formatTime(timeLeft.days)}</span>
                  <small>Days</small>
                </div>
                <div>
                  <span>{formatTime(timeLeft.hours)}</span>
                  <small>Hours</small>
                </div>
                <div>
                  <span>{formatTime(timeLeft.minutes)}</span>
                  <small>Minutes</small>
                </div>
                <div>
                  <span>{formatTime(timeLeft.seconds)}</span>
                  <small>Seconds</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

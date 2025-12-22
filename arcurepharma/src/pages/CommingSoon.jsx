import React, { useState, useEffect } from 'react';

export default function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState(30 * 24 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days = String(Math.floor(timeLeft / (24 * 60 * 60))).padStart(2, '0');
  const hours = String(Math.floor((timeLeft % (24 * 60 * 60)) / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="coming-soon-modern">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="content">
        <h3>📦 Arcurepharma</h3>
        <h1>COMING SOON</h1>
        <div className="countdown">
          <div><span>{days}</span><small>Days</small></div>
          <div><span>{hours}</span><small>Hours</small></div>
          <div><span>{minutes}</span><small>Minutes</small></div>
          <div><span>{seconds}</span><small>Seconds</small></div>
        </div>
      </div>
    </div>
  );
}

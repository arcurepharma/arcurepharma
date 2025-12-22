import React, { useState, useEffect } from 'react';

export default function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 }); // Placeholder countdown

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="container">
            <header className="fade-in">
                <div className="logo-pulse">
                    <h1>Arcurepharma</h1>
                </div>
            </header>
            <main className="fade-in-delay">
                <h2>Coming Soon</h2>

                {/* Animated Countdown */}
                <div className="countdown">
                    <div className="time-box">
                        <span className="number">{timeLeft.days}</span>
                        <span className="label">Days</span>
                    </div>
                    <div className="time-box">
                        <span className="number">{timeLeft.hours}</span>
                        <span className="label">Hours</span>
                    </div>
                    <div className="time-box">
                        <span className="number">{timeLeft.minutes}</span>
                        <span className="label">Minutes</span>
                    </div>
                    <div className="time-box">
                        <span className="number">{timeLeft.seconds}</span>
                        <span className="label">Seconds</span>
                    </div>
                </div>
            </main>
            <footer className="fade-in-delay">
                <p>&copy; 2025 arcurepharma. All rights reserved.</p>
            </footer>
        </div>
    );
}

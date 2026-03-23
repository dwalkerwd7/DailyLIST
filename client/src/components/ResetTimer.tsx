import { useState, useEffect } from "react";

export default function ResetTimer() {
    const [timeLeft, setTimeLeft] = useState(-1);

    useEffect(() => {
        setTimeLeft(24 * 3600);
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const timeLeftFormatString = () => {
        if (timeLeft < 0) {
            return "--:--:--";
        }

        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return timeLeft >= 0 ? (
        <span className="font-bold text-primary-text">{timeLeftFormatString()}</span>
    ) : (
        <span className="font-bold text-primary-text">--:--:--</span>
    );
}
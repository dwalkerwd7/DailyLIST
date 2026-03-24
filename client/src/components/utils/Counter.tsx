import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

type CounterHandle = {
    startTimer: () => void;
    pauseTimer: () => void;
    stopTimer: () => void;
    setTime: (time: number) => void;
    getTime: () => number;
};

type CounterProps = {
    startTime: number;
    endTime: number;
    step: number;
    formatString?: (currentTime: number) => string;
    indicateStartStop?: boolean;
    indicateStartStopClass?: string;
    className?: string;
};

const Counter = forwardRef<CounterHandle, CounterProps>(({
    startTime,
    endTime,
    step,
    formatString = (currentTime) => String(currentTime),
    indicateStartStop = false,
    indicateStartStopClass = "",
    className = "",

}, ref) => {
    const [currentTime, setCurrentTime] = useState(startTime);
    const [active, setActive] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        if(active) {
            if (currentTime === -1) {
                setCurrentTime(startTime);
            }
            intervalRef.current = setInterval(() => {
                if(currentTime !== endTime) {
                    setCurrentTime((prev) => prev + step);
                } else {
                    pauseTimer();
                }
            }, Math.abs(step));
        } else {
            clearInterval(intervalRef.current);
        }

        if(intervalRef.current && indicateStartStop) {
            const el = document.getElementById("counttimer-bg");
            if (el && indicateStartStopClass.length > 0) {
                el.classList.remove(indicateStartStopClass);
                void el.offsetWidth; // force reflow to restart animation
                el.classList.add(indicateStartStopClass);
            }
        }
    }, [active]);

    const startTimer = () => {
        setActive(true);
    };

    const pauseTimer = () => {
        setActive(false);
    };

    const stopTimer = () => {
        setActive(false);
        setCurrentTime(-1);
    };

    useImperativeHandle(ref, () => ({
        startTimer,
        pauseTimer,
        stopTimer,
        setTime: (time) => setCurrentTime(time),
        getTime: () => currentTime,

    }));

    return (
        <span id="counttimer-bg" className="inline-flex items-center justify-center rounded-md w-max h-max p-1">
            <span className={`${className}`}>
                {formatString(currentTime)}
            </span>
        </span>
    );
});

export default Counter;
export type { CounterHandle };

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

type CounterHandle = {
    startTimer: () => void;
    pauseTimer: () => void;
    stopTimer: () => void;
    setTime: (time: number) => void;
    getTime: () => number;
    isRunning: () => boolean;
};

type CounterProps = {
    startTime: number;
    endTime: number;
    step: number;
    formatString?: (currentTime: number) => string;
    onTick?: (currentTime: number) => void;
    indicateStartStop?: boolean;
    indicateStartStopClass?: string;
    className?: string;
};

const Counter = forwardRef<CounterHandle, CounterProps>(({
    startTime,
    endTime,
    step,
    formatString = (currentTime) => String(currentTime),
    onTick,
    indicateStartStop = false,
    indicateStartStopClass = "",
    className = "",

}, ref) => {
    const [currentTime, setCurrentTime] = useState(startTime);
    const [active, setActive] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const currentTimeRef = useRef(startTime);


    useEffect(() => {
        if (active) {
            if (currentTimeRef.current === -1) {
                currentTimeRef.current = startTime;
                setCurrentTime(startTime);
            }
            intervalRef.current = setInterval(() => {
                const next = currentTimeRef.current !== endTime ? currentTimeRef.current + step : currentTimeRef.current;
                currentTimeRef.current = next;
                setCurrentTime(next);
                onTick?.(next);
            }, Math.abs(step));
        } else {
            clearInterval(intervalRef.current);
        }

        if (intervalRef.current && indicateStartStop) {
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
        currentTimeRef.current = -1;
        setCurrentTime(-1);
    };

    useImperativeHandle(ref, () => ({
        startTimer,
        pauseTimer,
        stopTimer,
        setTime: (time) => { currentTimeRef.current = time; setCurrentTime(time); },
        getTime: () => currentTimeRef.current,
        isRunning: () => active
    }), [active]);

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

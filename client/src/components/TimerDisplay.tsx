import { type RefObject } from "react";
import Counter, { type CounterHandle } from "./utils/Counter";

interface TimerDisplayProps {
    isPulsing: boolean;
    isDimmed: boolean;
    isWarning: boolean;
    allComplete: boolean;
    isTimerHovered: boolean;
    isTimerTouchRevealed: boolean;
    counterHandle: RefObject<CounterHandle | null>;
    timerTouchRef: RefObject<boolean>;
    setIsTimerHovered: (val: boolean) => void;
    setIsTimerTouchRevealed: React.Dispatch<React.SetStateAction<boolean>>;
    formatString: (ms: number) => string;
    onTick: (currentTime: number) => void;
}

export default function TimerDisplay({
    isPulsing,
    isDimmed,
    isWarning,
    allComplete,
    isTimerHovered,
    isTimerTouchRevealed,
    counterHandle,
    timerTouchRef,
    setIsTimerHovered,
    setIsTimerTouchRevealed,
    formatString,
    onTick,
}: TimerDisplayProps) {
    const timerRevealed = isTimerHovered || isTimerTouchRevealed;
    const timerDimActive = isDimmed && !timerRevealed && !isPulsing && counterHandle.current?.isRunning();

    return (
        <>
            <p className="text-lg text-center text-muted">
                Your list automatically resets in:
            </p>
            <div
                className="px-8 select-none cursor-default"
                onMouseEnter={() => { if (!timerTouchRef.current) setIsTimerHovered(true); }}
                onMouseLeave={() => { if (!timerTouchRef.current) setIsTimerHovered(false); }}
                onTouchStart={() => { timerTouchRef.current = true; if (isDimmed) setIsTimerTouchRevealed(prev => !prev); }}
            >
                <span
                    className={`inline-flex mb-2 ${isPulsing ? "timer-warning-pulse" : ""} ${timerDimActive ? "timer-dimming" : "timer-revealing"}`}
                >
                    <Counter
                        ref={counterHandle}
                        startTime={-1}
                        endTime={0}
                        step={-1000}
                        formatString={formatString}
                        onTick={onTick}
                        indicateStartStop={true}
                        indicateStartStopClass="counttimer-highlight"
                        className={`font-bold text-xl ${timerDimActive ? "text-muted" : allComplete ? "text-on" : isWarning ? "text-warning" : "text-primary-text"}`}
                    />
                </span>
            </div>
        </>
    );
}

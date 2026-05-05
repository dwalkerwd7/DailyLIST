import { useState, useRef, useEffect } from "react";
import { type CounterHandle } from "../components/utils/Counter";

export default function useTimer() {
  const [isWarning, setIsWarning] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [isTimerHovered, setIsTimerHovered] = useState(false);
  const [isTimerTouchRevealed, setIsTimerTouchRevealed] = useState(false);

  const counterHandle = useRef<CounterHandle>(null);
  const expiresAtRef = useRef<number | null>(null);
  const isWarningRef = useRef(false);
  const lastWarningMinuteRef = useRef(-1);
  const timerTouchRef = useRef(false);

  useEffect(() => {
    const el = document.getElementById("counttimer-bg");
    if (!el) return;
    const handler = (e: AnimationEvent) => {
      if (e.animationName === "bg-in-out") {
        setIsDimmed(true);
        setIsTimerTouchRevealed(false);
      }
    };
    el.addEventListener("animationend", handler);
    return () => el.removeEventListener("animationend", handler);
  }, []);

  const startTimerAnew = () => {
    const MAX_TODO_LIFETIME = 24 * 60 * 60 * 1000;
    expiresAtRef.current = Date.now() + MAX_TODO_LIFETIME;
    counterHandle.current?.setTime(MAX_TODO_LIFETIME);
    counterHandle.current?.startTimer();
  };

  const initializeTimer = (expiresAt: number) => {
    expiresAtRef.current = expiresAt;
    counterHandle.current?.setTime(expiresAt - Date.now());
    counterHandle.current?.startTimer();
  };

  const resetTimerState = () => {
    expiresAtRef.current = null;
    counterHandle.current?.stopTimer();
    setIsWarning(false);
    setIsPulsing(false);
    setIsDimmed(false);
    setIsTimerTouchRevealed(false);
    isWarningRef.current = false;
    lastWarningMinuteRef.current = -1;
  };

  const pauseTimer = () => {
    counterHandle.current?.pauseTimer();
  };

  const resumeIfActive = () => {
    if (expiresAtRef.current) counterHandle.current?.startTimer();
  };

  const handleCounterTick = (currentTime: number) => {
    const timeLeft = expiresAtRef.current ? expiresAtRef.current - Date.now() : currentTime;
    const warning = timeLeft > 0 && timeLeft <= 30 * 60 * 1000;

    if (warning !== isWarningRef.current) {
      isWarningRef.current = warning;
      setIsWarning(warning);
      if (!warning) lastWarningMinuteRef.current = -1;
    }

    if (warning) {
      const currentMinute = Math.floor(timeLeft / 60000);
      if (currentMinute !== lastWarningMinuteRef.current) {
        lastWarningMinuteRef.current = currentMinute;
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 800);
      }
    }
  };

  const timeLeftFormatString = (_ms: number) => {
    const ms = expiresAtRef.current ? expiresAtRef.current - Date.now() : _ms;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 0) return "24:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return {
    counterHandle,
    timerTouchRef,
    isWarning,
    isPulsing,
    isDimmed,
    isTimerHovered,
    isTimerTouchRevealed,
    setIsTimerHovered,
    setIsTimerTouchRevealed,
    handleCounterTick,
    timeLeftFormatString,
    startTimerAnew,
    initializeTimer,
    resetTimerState,
    pauseTimer,
    resumeIfActive,
  };
}

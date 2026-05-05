import { useState, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "../achievements";
import { playAchievementSound } from "../sounds";
import { APIPaths } from "../app-constants";
import { type Todo } from "../components/TodoItem";

export default function useAchievements() {
  const [toastQueue, setToastQueue] = useState<(Achievement & { id: string })[]>([]);
  const firedAchievementsRef = useRef<Set<string>>(new Set());
  const achievementsLoadedRef = useRef(false);

  const queueAchievement = (id: string) => {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;
    firedAchievementsRef.current.add(id);
    setToastQueue(prev => [...prev, { id, ...achievement }]);
    playAchievementSound(id);
    void fetch(APIPaths.achievements, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const checkAchievements = (prev: Todo[], curr: Todo[]) => {
    const fired = firedAchievementsRef.current;
    const prevCompleted = prev.filter(t => t.completed).length;
    const currCompleted = curr.filter(t => t.completed).length;
    const prevAllComplete = prev.length > 0 && prev.every(t => t.completed);
    const currAllComplete = curr.length > 0 && curr.every(t => t.completed);

    if (!fired.has("first_todo_added") && prev.length === 0 && curr.length >= 1)
      queueAchievement("first_todo_added");
    if (!fired.has("five_added") && prev.length < 5 && curr.length >= 5)
      queueAchievement("five_added");
    if (!fired.has("ten_added") && prev.length < 10 && curr.length >= 10)
      queueAchievement("ten_added");
    if (!fired.has("first_completed") && prevCompleted === 0 && currCompleted >= 1)
      queueAchievement("first_completed");
    if (!fired.has("five_completed") && prevCompleted < 5 && currCompleted >= 5)
      queueAchievement("five_completed");
    if (!fired.has("ten_completed") && prevCompleted < 10 && currCompleted >= 10)
      queueAchievement("ten_completed");
    if (!fired.has("all_completed") && !prevAllComplete && currAllComplete)
      queueAchievement("all_completed");
  };

  const loadAchievements = async () => {
    try {
      const response = await fetch(APIPaths.achievements);
      if (response.ok) {
        const data = await response.json();
        firedAchievementsRef.current = new Set(data.fired);
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      achievementsLoadedRef.current = true;
    }
  };

  const dismissToast = () => setToastQueue(prev => prev.slice(1));

  return {
    toastQueue,
    achievementsLoadedRef,
    loadAchievements,
    checkAchievements,
    dismissToast,
  };
}

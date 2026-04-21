import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
    message: string;
    Icon: LucideIcon;
    onDismiss: () => void;
}

export default function AchievementToast({ message, Icon, onDismiss }: Props) {
    const [exiting, setExiting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setExiting(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!exiting) return;
        const el = ref.current;
        if (!el) return;
        el.addEventListener("animationend", onDismiss, { once: true });
        return () => el.removeEventListener("animationend", onDismiss);
    }, [exiting, onDismiss]);

    return (
        <div
            ref={ref}
            className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium text-white bg-linear-to-r from-accent-from to-accent-to ${exiting ? "achievement-exit" : "achievement-enter"}`}
        >
            <Icon size={16} />
            <span>{message}</span>
        </div>
    );
}

import { Sparkles, Zap, Trophy, ListChecks, SquareCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Achievement {
    message: string;
    Icon: LucideIcon;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    first_todo_added: { message: "First todo of the day!", Icon: Sparkles },
    first_completed: { message: "First one done! Phew.", Icon: SquareCheck },
    five_completed: { message: "5 todos completed! Great progress!", Icon: Zap },
    ten_completed: { message: "10 todos completed! You go!", Icon: Zap },
    all_completed: { message: "All todos complete! Congrats!", Icon: Trophy },
    five_added: { message: "5 todos added! Solid!", Icon: ListChecks },
    ten_added: { message: "10 todos added! You're busy!", Icon: ListChecks },
};

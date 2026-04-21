import { Sparkles, CheckCheck, Zap, Trophy, ListChecks } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Achievement {
    message: string;
    Icon: LucideIcon;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    first_todo_added: { message: "First todo of the day!",  Icon: Sparkles   },
    first_completed:  { message: "First one done!",         Icon: CheckCheck },
    five_completed:   { message: "5 todos completed!",      Icon: Zap        },
    all_completed:    { message: "All todos complete!",     Icon: Trophy     },
    ten_added:        { message: "10 todos added!",         Icon: ListChecks },
};

import AchievementToast from "./utils/AchievementToast";
import { type Achievement } from "../achievements";

interface ControlsBarProps {
    allExpanded: boolean;
    toastQueue: (Achievement & { id: string })[];
    onToggleExpandAll: () => void;
    onResetList: () => void;
    onDismissToast: () => void;
}

export default function ControlsBar({
    allExpanded,
    toastQueue,
    onToggleExpandAll,
    onResetList,
    onDismissToast,
}: ControlsBarProps) {
    return (
        <div className="relative flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 w-full border-b border-primary-border pb-3">
            <button
                className={`h-9 px-4 text-sm text-todo-text rounded ${allExpanded ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}`}
                onClick={onToggleExpandAll}
            >
                {allExpanded ? "Collapse All" : "Expand All"}
            </button>
            <button
                className="h-9 px-4 text-sm bg-delete hover:bg-delete-hover text-white rounded"
                onClick={onResetList}
            >
                Reset List
            </button>
            {toastQueue.length > 0 && (
                <AchievementToast
                    key={toastQueue[0].id}
                    message={toastQueue[0].message}
                    Icon={toastQueue[0].Icon}
                    onDismiss={onDismissToast}
                />
            )}
        </div>
    );
}

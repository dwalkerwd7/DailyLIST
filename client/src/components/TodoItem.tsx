import { useState, useRef } from "react";
import { GripVertical, Minus, Plus, Trash2 } from "lucide-react";
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DynamicTextarea from "./utils/DynamicTextarea";

export type Todo = {
    id: number;
    completed: boolean;
    title: string;
    expanded?: boolean;
    notes?: string;
};

export type ToggleCompleteHandler = (id: number) => void;
export type UpdateTitleHandler = (id: number, title: string) => void;
export type UpdateNotesHandler = (id: number, notes: string) => void;
export type DeleteHandler = (id: number) => void;
export type ToggleExpandHandler = (id: number) => void;

export default function TodoItem({ todo, isRemoving = false, onRemoveComplete, onToggleExpand, onToggleComplete, onUpdateTitle, onUpdateNotes, onDelete }: { todo: Todo, isRemoving?: boolean, onRemoveComplete?: () => void, onToggleExpand: ToggleExpandHandler, onToggleComplete: ToggleCompleteHandler, onUpdateTitle: UpdateTitleHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, expanded = false, notes = "" } = todo;
    const [flashing, setFlashing] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const titleOnFocus = useRef<string>("");
    const { active } = useDndContext();

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    const handleTitleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        titleOnFocus.current = e.currentTarget.value;
    };

    const handleTitleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (e.currentTarget.value !== titleOnFocus.current) {
            setFlashing(true);
            setTimeout(() => setFlashing(false), 600);
        }
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            onAnimationEnd={(e) => {
                if (isRemoving) onRemoveComplete?.();
                if (e.animationName === "todo-enter") setHasEntered(true);
            }}
            className={`
                flex flex-row flex-wrap items-center justify-between py-2 px-2 block w-full mb-2 rounded
                ${active ? (isDragging ? "border-button-primary bg-button-tertiary border-dashed border-2" : "border-primary-border border-dashed border-2") : "border border-primary-border"}
                ${flashing ? "todo-confirm" : ""}
                ${isRemoving ? "todo-exit" : (hasEntered ? "" : "todo-enter")}
            `}
        >
            <div className="flex flex-row items-center gap-2">
                <button
                    ref={setActivatorNodeRef}
                    className="
                        w-11 h-11 text-todo-text
                        rounded bg-button-tertiary hover:bg-button-tertiary-hover cursor-grab active:cursor-grabbing
                        inline-flex items-center justify-center
                    "
                    aria-label="Drag todo"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={16} />
                </button>
                <button className="
                    w-11 h-11
                    text-todo-text font-bold rounded
                    bg-button-secondary hover:bg-button-secondary-hover
                    inline-flex items-center justify-center
                    " onClick={() => onToggleExpand(id)}
                >
                    {expanded ? <Minus size={16} /> : <Plus size={16} />}
                </button>
            </div>
            <div className="flex-1 self-stretch flex items-center mx-1 px-1 rounded focus-within:ring-1 focus-within:ring-primary-border focus-within:bg-secondary-bg">
                <textarea
                    className={
                        `${completed ? "line-through text-muted" : "text-todo-text"}
                        text-center w-full
                        border-none focus:outline-none focus:ring-0
                        bg-transparent
                        resize-none whitespace-nowrap overflow-x-auto todo-title-input`}
                    rows={1}
                    value={title}
                    placeholder="Empty Todo"
                    maxLength={100}
                    onChange={(e) => onUpdateTitle(id, e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onFocus={handleTitleFocus}
                    onBlur={handleTitleBlur}
                />
            </div>
            <button
                className="w-9 h-9 inline-flex items-center justify-center rounded text-delete hover:bg-delete hover:text-white"
                aria-label="Delete todo"
                onClick={() => onDelete(id)}
            >
                <Trash2 size={16} />
            </button>
            <label className="w-11 h-11 inline-flex items-center justify-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={completed}
                    className="w-5 h-5 accent-[var(--highlight-primary)]"
                    onChange={() => {
                        onToggleComplete(id);
                    }}
                />
            </label>
            {expanded && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                    <DynamicTextarea
                        className="text-todo-text min-h-20 max-h-50 bg-todo-notes-bg p-3 rounded resize-none w-full"
                        value={notes}
                        placeholder="Add notes here..."
                        maxLength={500}
                        onChange={(e) => onUpdateNotes(id, e.target.value)}
                    />
                    <span className="text-xs text-muted">{notes.length}/500</span>
                </div>
            )}
        </li>
    );
}

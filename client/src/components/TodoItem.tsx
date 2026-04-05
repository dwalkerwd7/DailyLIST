import { useState } from "react";
import { GripVertical, Minus, Plus } from "lucide-react";
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

export default function TodoItem({ todo, onToggleExpand, onToggleComplete, onUpdateTitle, onUpdateNotes, onDelete }: { todo: Todo, onToggleExpand: ToggleExpandHandler, onToggleComplete: ToggleCompleteHandler, onUpdateTitle: UpdateTitleHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, expanded = false, notes = "" } = todo;
    const [flashing, setFlashing] = useState(false);
    const { active } = useDndContext();

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
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
            className={`
                flex flex-row flex-wrap items-center justify-between py-2 px-2 block w-full mb-2 rounded
                ${active ? (isDragging ? "border-button-primary bg-button-tertiary border-dashed border-2" : "border-primary-border border-dashed border-2") : "border border-primary-border"}
                ${flashing ? "todo-confirm" : ""}
            `}
        >
            <div className="flex flex-row items-center gap-2">
                <button
                    ref={setActivatorNodeRef}
                    className="
                        w-8 h-8 text-todo-text
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
                    w-8 h-8
                    text-todo-text font-bold rounded
                    bg-button-secondary hover:bg-button-secondary-hover
                    inline-flex items-center justify-center
                    " onClick={() => onToggleExpand(id)}
                >
                    {expanded ? <Minus size={16} /> : <Plus size={16} />}
                </button>
            </div>
            <input
                className={
                    `${completed ? "line-through text-muted" : "text-todo-text"}
                    text-center flex-1 mx-2 text-wrap
                    border-none focus:ring-1 focus:outline-none
                    focus:ring-primary-border rounded bg-transparent focus:bg-secondary-bg
                    h-7`}
                value={title}
                placeholder="Empty Todo"
                onChange={(e) => onUpdateTitle(id, e.target.value)}
                onKeyDown={handleTitleKeyDown}
            />
            <input
                type="checkbox"
                checked={completed}
                className="w-5 h-5"
                onChange={() => {
                    onToggleComplete(id);
                }}
            />
            {expanded && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                    <DynamicTextarea
                        className="text-todo-text min-h-20 max-h-50 bg-todo-notes-bg p-3 rounded resize-none w-full"
                        value={notes}
                        placeholder="Add notes here..."
                        onChange={(e) => onUpdateNotes(id, e.target.value)}
                    />
                    <button className="h-7 text-sm px-5 bg-delete hover:bg-delete-hover text-white rounded self-end" onClick={() => onDelete(id)}>
                        Delete
                    </button>
                </div>
            )}
        </li>
    );
}

import { useState } from "react";

type Todo = {
    id: number;
    completed: boolean;
    title: string;
    notes?: string;
};

type ToggleCompleteHandler = (id: number) => void;
type UpdateNotesHandler = (id: number, notes: string) => void;
type DeleteHandler = (id: number) => void;

function TodoList({ children }: { children: React.ReactNode }) {
    return (
        <ul className="flex flex-col items-start w-full list-none p-0 m-0">
            {children}
        </ul>
    )
}

function TodoItem({ todo, onToggleComplete, onUpdateNotes, onDelete }: { todo: Todo, onToggleComplete: ToggleCompleteHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, notes = '' } = todo;
    const [expanded, setExpanded] = useState(false);

    const onExpandTodo = () => {
        setExpanded(!expanded);
    };

    return (
        <li key={id} className="flex flex-row flex-3 flex-wrap justify-between border-b border-primary-border py-2 block w-full">
            <button className="text-todo-text w-5 h-5 rounded bg-button-secondary hover:bg-button-secondary-hover" onClick={onExpandTodo}>
                {expanded ? "-" : "+"}
            </button>
            <span className={completed ? "line-through text-muted" : "text-todo-text"}>
                {title}
            </span>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => {
                    onToggleComplete(id);
                }}
            />
            {expanded && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                    <textarea autoFocus contentEditable className="text-todo-text" onChange={(e) => onUpdateNotes(id, e.target.value)}>{notes}</textarea>
                    <button className="h-7 text-sm px-5 bg-delete hover:bg-delete-hover text-white rounded self-end" onClick={() => onDelete(id)}>
                        Delete
                    </button>
                </div>
            )}
        </li>
    );
}

export { TodoList, TodoItem };
export type { Todo, ToggleCompleteHandler, UpdateNotesHandler, DeleteHandler };
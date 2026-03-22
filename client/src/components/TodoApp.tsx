import { useState } from "react";

type Todo = {
    id: number;
    completed: boolean;
    title: string;
    expanded?: boolean;
    notes?: string;
};

type ToggleCompleteHandler = (id: number) => void;
type UpdateNotesHandler = (id: number, notes: string) => void;
type DeleteHandler = (id: number) => void;
type ToggleExpandHandler = (id: number) => void;

function Todo({ todo, onToggleExpand, onToggleComplete, onUpdateNotes, onDelete }: { todo: Todo, onToggleExpand: ToggleExpandHandler, onToggleComplete: ToggleCompleteHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, expanded = false, notes = "" } = todo;

    return (
        <li key={id} className="flex flex-row flex-3 flex-wrap justify-between border-b border-primary-border py-2 block w-full">
            <button className="
                text-todo-text font-bold p-2 rounded 
                bg-button-secondary hover:bg-button-secondary-hover 
                inline-flex items-center justify-center leading-none
                " onClick={() => onToggleExpand(id)}
            >
                {expanded ? "-" : "+"}
            </button>
            <span className={completed ? "line-through text-muted" : "text-todo-text"}>
                {title}
            </span>
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
                    <textarea
                        autoFocus
                        className="text-todo-text h-20 bg-todo-notes-bg p-2 rounded resize-none w-full"
                        value={notes}
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

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const generateNewTodoID = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const handleAddTodo = () => {
        setTodos([...todos, { id: generateNewTodoID(), completed: false, title: "New Todo", expanded: false }]);
    };

    const handleOnToggleComplete: ToggleCompleteHandler = (id: number) => {
        setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const handleToggleExpand: ToggleExpandHandler = (id: number) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, expanded: !todo.expanded } : todo));
    };

    const handleUpdateNotes: UpdateNotesHandler = (id: number, notes: string) => {
        setTodos(todos.map((todo) => todo.id === id ? { ...todo, notes } : todo));
    };

    const handleOnDelete: DeleteHandler = (id: number) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            setTodos(todos.filter((todo) => todo.id !== id));
        }
    };

    const handleToggleExpandAll = () => {
        if (todos.length === 0) {
            return;
        }

        const areAllExpanded = todos.every((todo) => todo.expanded);
        setTodos((prev) => prev.map((todo) => ({ ...todo, expanded: !areAllExpanded })));
    };

    const handleToggleCompleteAll = () => {
        if (todos.length === 0) {
            return;
        }

        const areAllCompleted = todos.every((todo) => todo.completed);
        setTodos((prev) => prev.map((todo) => ({ ...todo, completed: !areAllCompleted })));
    };

    const handleResetList = () => {
        if (confirm("Are you sure you want to reset the list?")) {
            setTodos([]);
        }
    };

    const areAllExpanded = todos.length > 0 && todos.every((todo) => todo.expanded);
    const areAllCompleted = todos.length > 0 && todos.every((todo) => todo.completed);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-row gap-2 justify-between w-full border-b border-primary-border pb-3 mb-5">
                <button className={`
                    h-9 px-4 text-sm text-todo-text rounded
                    ${areAllExpanded ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}
                `} onClick={handleToggleExpandAll}
                >
                    {areAllExpanded ? "Collapse All" : "Expand All"}
                </button>
                <button className={`
                    h-9 px-4 text-sm text-todo-text rounded
                    ${areAllCompleted ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}
                `} onClick={handleToggleCompleteAll}
                >
                    {areAllCompleted ? "Uncheck All" : "Check All"}
                </button>
                <button className="h-9 px-4 text-sm bg-delete hover:bg-delete-hover text-white rounded" onClick={handleResetList}>
                    Reset List
                </button>
            </div>
            <ul className="flex flex-col items-start w-full list-none p-0 m-0">
                {todos.map((todo) => (
                    <Todo 
                        key={todo.id} 
                        todo={todo} 
                        onToggleExpand={handleToggleExpand}
                        onToggleComplete={handleOnToggleComplete} 
                        onUpdateNotes={handleUpdateNotes}
                        onDelete={handleOnDelete}
                    />
                ))}
            </ul>
            <button className="w-25 h-15 font-bold text-lg bg-button-primary hover:bg-button-primary-hover hover:cursor-pointer text-white rounded" onClick={handleAddTodo}>
                +
            </button>
        </div>
    );
}
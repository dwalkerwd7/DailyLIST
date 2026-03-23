import { useEffect, useRef, useState } from "react";
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    useDndContext,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function TodoItem({ todo, onToggleExpand, onToggleComplete, onUpdateNotes, onDelete }: { todo: Todo, onToggleExpand: ToggleExpandHandler, onToggleComplete: ToggleCompleteHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, expanded = false, notes = "" } = todo;
    const notesRef = useRef<HTMLTextAreaElement | null>(null);
    const { active } = useDndContext();
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

    const resizeNotesTextarea = (textarea: HTMLTextAreaElement) => {
        const computedStyle = window.getComputedStyle(textarea);
        const minHeight = Number.parseFloat(computedStyle.minHeight) || 0;
        const maxHeightRaw = Number.parseFloat(computedStyle.maxHeight);
        const maxHeight = Number.isFinite(maxHeightRaw) ? maxHeightRaw : Number.POSITIVE_INFINITY;

        textarea.style.height = "auto";
        const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${nextHeight}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    useEffect(() => {
        if (expanded && notesRef.current) {
            resizeNotesTextarea(notesRef.current);
        }
    }, [expanded, notes]);

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`
                flex flex-row flex-wrap items-center justify-between py-2 px-2 block w-full mb-2 rounded
                border-2 border-dashed
                ${active ? (isDragging ? "border-button-primary bg-button-tertiary" : "border-primary-border") : "border-transparent"}
            `}
        >
            <div className="flex flex-row items-center gap-2">
                <button
                    ref={setActivatorNodeRef}
                    className="
                        w-8 h-8 p-2 text-todo-text p-2 
                        rounded bg-button-tertiary hover:bg-button-tertiary-hover cursor-grab active:cursor-grabbing 
                        inline-flex items-center justify-center
                    "
                    aria-label="Drag todo"
                    {...attributes}
                    {...listeners}
                >
                    ::
                </button>
                <button className="
                    w-8 h-8 p-2
                    text-todo-text font-bold rounded 
                    bg-button-secondary hover:bg-button-secondary-hover 
                    inline-flex items-center justify-center
                    " onClick={() => onToggleExpand(id)}
                >
                    {expanded ? "-" : "+"}
                </button>
            </div>
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
                        ref={notesRef}
                        className="text-todo-text min-h-20 max-h-50 bg-todo-notes-bg p-3 rounded resize-none w-full"
                        value={notes}
                        onChange={(e) => {
                            onUpdateNotes(id, e.target.value);
                            resizeNotesTextarea(e.currentTarget);
                        }}
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
    const [allExpanded, setAllExpanded] = useState(false);
    const [allChecked, setAllChecked] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateNewTodoID = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const handleAddTodo = () => {
        setTodos((prev) => [...prev, { id: generateNewTodoID(), completed: false, title: "New Todo", expanded: false }]);
    };

    const handleOnToggleComplete: ToggleCompleteHandler = (id: number) => {
        const newTodos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        setTodos(newTodos);

        if(newTodos.every((todo) => todo.completed)) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    };

    const handleToggleExpand: ToggleExpandHandler = (id: number) => {
        const newTodos = todos.map((todo) => todo.id === id ? { ...todo, expanded: !todo.expanded } : todo);
        setTodos(newTodos);

        if(newTodos.every((todo) => todo.expanded)) {
            setAllExpanded(true);
        } else {
            setAllExpanded(false);
        }
    };

    const handleUpdateNotes: UpdateNotesHandler = (id: number, notes: string) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, notes } : todo));
    };

    const handleOnDelete: DeleteHandler = (id: number) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            setAllExpanded(false);
            setAllChecked(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setTodos((prev) => {
            const oldIndex = prev.findIndex((todo) => todo.id === active.id);
            const newIndex = prev.findIndex((todo) => todo.id === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                return prev;
            }

            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleToggleExpandAll = () => {
        if (todos.length === 0) {
            return;
        }

        const newAllExpanded = !todos.every((todo) => todo.expanded);
        setAllExpanded(newAllExpanded);
        setTodos((prev) => prev.map((todo) => ({ ...todo, expanded: newAllExpanded })));
    };

    const handleToggleCompleteAll = () => {
        if (todos.length === 0) {
            return;
        }

        const newAllChecked = !todos.every((todo) => todo.completed);
        setAllChecked(newAllChecked);
        setTodos((prev) => prev.map((todo) => ({ ...todo, completed: newAllChecked })));
    };

    const handleResetList = () => {
        if (confirm("Are you sure you want to reset the list?")) {
            setTodos([]);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-lg">
            <div className="flex flex-row gap-2 justify-between w-full border-b border-primary-border pb-3 mb-5">
                <button className={`
                    h-9 px-4 text-sm text-todo-text rounded
                    ${allExpanded ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}
                `} onClick={handleToggleExpandAll}
                >
                    {allExpanded ? "Collapse All" : "Expand All"}
                </button>
                <button className={`
                    h-9 px-4 text-sm text-todo-text rounded
                    ${allChecked ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}
                `} onClick={handleToggleCompleteAll}
                >
                    {allChecked ? "Uncheck All" : "Check All"}
                </button>
                <button className="h-9 px-4 text-sm bg-delete hover:bg-delete-hover text-white rounded" onClick={handleResetList}>
                    Reset List
                </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col items-start w-full list-none p-0 m-0">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggleExpand={handleToggleExpand}
                                onToggleComplete={handleOnToggleComplete}
                                onUpdateNotes={handleUpdateNotes}
                                onDelete={handleOnDelete}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <button className="w-25 h-15 font-bold text-3xl bg-button-primary hover:bg-button-primary-hover hover:cursor-pointer text-white rounded" onClick={handleAddTodo}>
                +
            </button>
        </div>
    );
}
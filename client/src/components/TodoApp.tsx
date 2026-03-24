import { useState, useRef, useEffect } from "react";
import { GripVertical, Minus, Plus } from "lucide-react";
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
import ModalAlert, { openModalAlert, type ModalAlertState } from "./utils/ModalAlert";
import DynamicTextarea from "./utils/DynamicTextarea";
import Counter, { type CounterHandle } from "./utils/Counter";

type Todo = {
    id: number;
    completed: boolean;
    title: string;
    expanded?: boolean;
    notes?: string;
};

type ToggleCompleteHandler = (id: number) => void;
type UpdateTitleHandler = (id: number, title: string) => void;
type UpdateNotesHandler = (id: number, notes: string) => void;
type DeleteHandler = (id: number) => void;
type ToggleExpandHandler = (id: number) => void;

function TodoItem({ todo, onToggleExpand, onToggleComplete, onUpdateTitle, onUpdateNotes, onDelete }: { todo: Todo, onToggleExpand: ToggleExpandHandler, onToggleComplete: ToggleCompleteHandler, onUpdateTitle: UpdateTitleHandler, onUpdateNotes: UpdateNotesHandler, onDelete: DeleteHandler }) {
    const { id, completed, title, expanded = false, notes = "" } = todo;
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
                    focus:ring-primary-border rounded bg-transparent focus:bg-secondary-bg`} 
                value={title} 
                onChange={(e) => onUpdateTitle(id, e.target.value)}
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
    const [allExpanded, setAllExpanded] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [modalAlertProps, setModalAlertProps] = useState<ModalAlertState>(null);
    
    const counterHandle = useRef<CounterHandle>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (todos.length === 0) {
            counterHandle.current?.stopTimer();
        } else if (todos.length === 1) {
            counterHandle.current?.startTimer();
        }
    }, [todos]);

    const generateNewTodoID = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const handleAddTodo = () => {
        setTodos((prev) => [...prev, { 
            id: generateNewTodoID(), 
            completed: false, 
            title: "New Todo", 
            expanded: false 
        }]);
    };

    const handleToggleComplete: ToggleCompleteHandler = (id: number) => {
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

    const handleUpdateTitle: UpdateTitleHandler = (id: number, title: string) => {
        if(title.length === 0) {
            title = "New Todo";
        } else if(title.length >= 50) {
            title = title.slice(0, 50);
        }

        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, title } : todo));
    };

    const handleUpdateNotes: UpdateNotesHandler = (id: number, notes: string) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, notes } : todo));
    };

    const handleDeleteTodo: DeleteHandler = (id: number) => {
        openModalAlert(setModalAlertProps, "warning", "Delete Todo", "Are you sure you want to delete this todo?", "Delete", () => {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            setAllExpanded(false);
            setAllChecked(false);
            setModalAlertProps(null);
        });
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
        if (todos.length === 0) {
            return;
        }
        
        openModalAlert(setModalAlertProps, "critical", "Reset List", "Are you sure you want to delete all your todos? This process is irreversible.", "Reset", () => {
            setTodos([]);
            setAllExpanded(false);
            setAllChecked(false);
            setModalAlertProps(null);
        });
    };

    const timeLeftFormatString = (seconds: number) => {
        if (seconds < 0) {
            return "--:--:--";
        }

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center gap-4 w-lg sm:w-2xl md:w-3xl">
            <p className="text-lg text-center text-muted mb-2">
                Your list automatically resets in: 
                <div id="countdown-timer-bg">
                    <Counter
                        ref={counterHandle}
                        startTime={24 * 3600}
                        endTime={0}
                        step={-1}
                        formatString={timeLeftFormatString}
                        indicateStartStop={true}
                        indicateStartStopClass="counttimer-highlight"
                        className="text-primary-text font-bold"
                    />
                </div>
            </p>
            <div className="flex flex-row gap-2 justify-center gap-8 w-full border-b border-primary-border pb-3">
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
                                onToggleComplete={handleToggleComplete}
                                onUpdateTitle={handleUpdateTitle}
                                onUpdateNotes={handleUpdateNotes}
                                onDelete={handleDeleteTodo}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <button className="w-25 h-15 bg-button-primary hover:bg-button-primary-hover hover:cursor-pointer text-white rounded flex items-center justify-center" onClick={handleAddTodo}>
                <Plus size={28} />
            </button>
            {modalAlertProps && (
                <ModalAlert
                    {...modalAlertProps}
                    cancelLabel="Cancel"
                    showCancel
                />
            )}
        </div>
    );
}
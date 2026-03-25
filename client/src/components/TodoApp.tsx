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
import ToggleSwitch from "./utils/ToggleSwitch";
import APIPaths from "../utils/api-paths";

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
                ${active ? (isDragging ? "border-button-primary bg-button-tertiary border-dashed border-2" : "border-primary-border border-dashed border-2") : "border border-primary-border"}
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
    const [modalAlertProps, setModalAlertProps] = useState<ModalAlertState>(null);
    const [autoDelete, setAutoDelete] = useState(() => {
        const saved = localStorage.getItem("autoDelete");
        return saved === "true";
    });
    
    const counterHandle = useRef<CounterHandle>(null);
    const expiresAtRef = useRef<number | null>(null);
    const hasLoaded = useRef(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const MAX_LIFETIME = 24 * 60 * 60 * 1000;

    const generateNewTodoID = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const startTimerAnew = () => {
        expiresAtRef.current = Date.now() + MAX_LIFETIME;
        counterHandle.current?.setTime(MAX_LIFETIME);
        counterHandle.current?.startTimer();
    }

    const loadTodos = async () => {
        try {
            const response = await fetch(APIPaths.todos);
            if(response.ok) {
                const data = await response.json();

                hasLoaded.current = true;
                setTodos(data.todos);
                
                if(data.expiresAt) {
                    expiresAtRef.current = data.expiresAt;
                    counterHandle.current?.setTime(data.expiresAt - Date.now());
                    counterHandle.current?.startTimer();
                }
            }
        } catch(err) {
            console.error("Error fetching todos:", err);
        }
    };

    const saveTodos = async(todos: Todo[]) => {
        try {
            const response = await fetch(APIPaths.todos, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ todos }),
            });
            if(!response.ok) {
                const resData = await response.json();
                console.error("Error saving todos:", resData.message);
            }
        } catch(err) {
            console.error("Error posting todos:", err);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    useEffect(() => {
        if(todos.length === 0) {
            expiresAtRef.current = null;
            counterHandle.current?.stopTimer();
        }
        
        if(hasLoaded.current) {
            saveTodos(todos);
        }
    }, [todos]);

    const handleAddTodo = () => {
        if(todos.length >= 20) {
            openModalAlert(
                setModalAlertProps, 
                "info", 
                "Limit Reached", 
                "You have reached the maximum number of todos (20). Please delete some todos before adding new ones.", 
                "OK", 
                () => {}
            );
            return;
        }

        setTodos((prev) => {
            if(prev.length === 0) {
                startTimerAnew();
            }
            
            return [...prev, { 
            id: generateNewTodoID(), 
            completed: false, 
            title: "New Todo", 
            expanded: false 
            }]
        });
    };

    const handleToggleComplete: ToggleCompleteHandler = (id: number) => {
        const updateTodos = () => {
            const newTodos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
            setTodos(newTodos);
        };

        if(autoDelete) {
            if(!todos.find((todo) => todo.id === id)?.completed) {
                updateTodos();
            }
            setTimeout(() => {
                setTodos((prev) => prev.filter((todo) => todo.id !== id));
            }, 300);
        } else {
            updateTodos();
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

    const handleResetList = () => {
        if (todos.length === 0) {
            return;
        }
        
        openModalAlert(setModalAlertProps, "critical", "Reset List", "Are you sure you want to delete all your todos? This process is irreversible.", "Reset", () => {
            setTodos([]);
            setAllExpanded(false);
            setModalAlertProps(null);
        });
    };

    const handleAutoDeleteToggle = () => {
        const newAutoDelete = !autoDelete;
        setAutoDelete(newAutoDelete);
        localStorage.setItem("autoDelete", String(newAutoDelete));
    };

    const timeLeftFormatString = (_ms: number) => {
        const ms = expiresAtRef.current ? expiresAtRef.current - Date.now() : _ms;
        const seconds = Math.floor(ms / 1000);

        if (seconds < 0) {
            return "--:--:--";
        }

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center gap-3 w-lg sm:w-2xl md:w-3xl">
            <p className="text-lg text-center text-muted">
                Your list automatically resets in: 
            </p>
            <span className="inline-flex mb-2">
                <Counter
                    ref={counterHandle}
                    startTime={-1}
                    endTime={0}
                    step={-1000}
                    formatString={timeLeftFormatString}
                    indicateStartStop={true}
                    indicateStartStopClass="counttimer-highlight"
                    className="text-primary-text font-bold text-xl"
                />
            </span>
            <div className="flex flex-row gap-2 items-center justify-center gap-8 w-full border-b border-primary-border pb-3">
                <button className={`
                    h-9 px-4 text-sm text-todo-text rounded
                    ${allExpanded ? "bg-button-secondary hover:bg-button-secondary-hover" : "bg-button-tertiary hover:bg-button-tertiary-hover"}
                `} onClick={handleToggleExpandAll}
                >
                    {allExpanded ? "Collapse All" : "Expand All"}
                </button>
                <button className="h-9 px-4 text-sm bg-delete hover:bg-delete-hover text-white rounded" onClick={handleResetList}>
                    Reset List
                </button>
                <div className="flex flex-row gap-2 items-center">
                    <span className="text-sm text-muted mr-2">Auto-Delete Todos</span>
                    <ToggleSwitch isOn={autoDelete} width={11} height={6} handleToggle={handleAutoDeleteToggle} />
                </div>
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
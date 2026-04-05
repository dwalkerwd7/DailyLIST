import { useState, useRef, useEffect } from "react";
import { Plus, ArrowDown } from "lucide-react";
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ModalAlert, { openModalAlert, type ModalAlertState } from "./utils/ModalAlert";
import Counter, { type CounterHandle } from "./utils/Counter";
import { MAX_TODO_LIFETIME, APIPaths } from "../app-constants";
import TodoItem, {
    type Todo,
    type ToggleCompleteHandler,
    type UpdateTitleHandler,
    type UpdateNotesHandler,
    type DeleteHandler,
    type ToggleExpandHandler
} from "./TodoItem";

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
    const [allExpanded, setAllExpanded] = useState(false);
    const [modalAlertProps, setModalAlertProps] = useState<ModalAlertState>(null);
    const [isWarning, setIsWarning] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    const counterHandle = useRef<CounterHandle>(null);
    const expiresAtRef = useRef<number | null>(null);
    const hasLoaded = useRef(false);
    const isWarningRef = useRef(false);
    const lastWarningMinuteRef = useRef(-1);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateNewTodoID = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const startTimerAnew = () => {
        expiresAtRef.current = Date.now() + MAX_TODO_LIFETIME;
        counterHandle.current?.setTime(MAX_TODO_LIFETIME);
        counterHandle.current?.startTimer();
    };

    const handleCounterTick = (currentTime: number) => {
        const timeLeft = expiresAtRef.current ? expiresAtRef.current - Date.now() : currentTime;
        const warning = timeLeft > 0 && timeLeft <= 30 * 60 * 1000;

        if (warning !== isWarningRef.current) {
            isWarningRef.current = warning;
            setIsWarning(warning);
            if (!warning) {
                lastWarningMinuteRef.current = -1;
            }
        }

        if (warning) {
            const currentMinute = Math.floor(timeLeft / 60000);
            if (currentMinute !== lastWarningMinuteRef.current) {
                lastWarningMinuteRef.current = currentMinute;
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 800);
            }
        }
    };

    const loadTodos = async () => {
        try {
            const response = await fetch(APIPaths.todos);
            if (response.ok) {
                const data = await response.json();
                setTodos(data.todos);

                if (data.expiresAt) {
                    expiresAtRef.current = data.expiresAt;
                    counterHandle.current?.setTime(data.expiresAt - Date.now());
                    counterHandle.current?.startTimer();
                }
            }
        } catch (err) {
            console.error("Error fetching todos:", err);
        } finally {
            hasLoaded.current = true;
        }
    };

    const saveTodos = async (todosToSave: Todo[]) => {
        try {
            const response = await fetch(APIPaths.todos, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ todos: todosToSave }),
            });
            if (!response.ok) {
                const resData = await response.json();
                console.error("Error saving todos:", resData.message);
            }
        } catch (err) {
            console.error("Error posting todos:", err);
        }
    };

    useEffect(() => {
        void loadTodos();
    }, []);

    useEffect(() => {
        const allComplete = todos.length > 0 && todos.every(t => t.completed);

        if (todos.length === 0) {
            expiresAtRef.current = null;
            counterHandle.current?.stopTimer();
            setIsWarning(false);
            setIsPulsing(false);
            isWarningRef.current = false;
            lastWarningMinuteRef.current = -1;
        } else if (allComplete) {
            counterHandle.current?.pauseTimer();
        } else if (expiresAtRef.current) {
            counterHandle.current?.startTimer();
        }

        if (hasLoaded.current) {
            void saveTodos(todos);
        }
    }, [todos]);

    const handleAddTodo = () => {
        if (todos.length >= 20) {
            openModalAlert(
                setModalAlertProps,
                "info",
                "Limit Reached",
                "You have reached the maximum number of todos (20). Please delete some todos before adding new ones.",
                "OK",
                () => { }
            );
            return;
        }

        setTodos((prev) => {
            if (prev.length === 0) {
                startTimerAnew();
            }

            return [...prev, {
                id: generateNewTodoID(),
                completed: false,
                title: "",
                expanded: false
            }]
        });
    };

    const handleToggleComplete: ToggleCompleteHandler = (id: number) => {
        const newTodos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        setTodos(newTodos);
    };

    const handleToggleExpand: ToggleExpandHandler = (id: number) => {
        const newTodos = todos.map((todo) => todo.id === id ? { ...todo, expanded: !todo.expanded } : todo);
        setTodos(newTodos);

        if (newTodos.every((todo) => todo.expanded)) {
            setAllExpanded(true);
        } else {
            setAllExpanded(false);
        }
    };

    const handleUpdateTitle: UpdateTitleHandler = (id: number, title: string) => {
        if (title.length >= 50) {
            title = title.slice(0, 50);
        }

        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, title } : todo));
    };

    const handleUpdateNotes: UpdateNotesHandler = (id: number, notes: string) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, notes } : todo));
    };

    const handleRemoveComplete = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        setRemovingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    };

    const handleDeleteTodo: DeleteHandler = (id: number) => {
        openModalAlert(setModalAlertProps, "warning", "Delete Todo", "Are you sure you want to delete this todo?", "Delete", () => {
            setModalAlertProps(null);
            setAllExpanded(false);
            setRemovingIds((prev) => new Set(prev).add(id));
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

    const completedCount = todos.filter(t => t.completed).length;
    const allComplete = todos.length > 0 && completedCount === todos.length;

    return (
        <div className="flex flex-col items-center gap-3 w-full px-4 sm:px-0">
            <p className="text-lg text-center text-muted">
                Your list automatically resets in:
            </p>
            <span className={`inline-flex mb-2 ${isPulsing ? "timer-warning-pulse" : ""}`}>
                <Counter
                    ref={counterHandle}
                    startTime={-1}
                    endTime={0}
                    step={-1000}
                    formatString={timeLeftFormatString}
                    onTick={handleCounterTick}
                    indicateStartStop={true}
                    indicateStartStopClass="counttimer-highlight"
                    className={`font-bold text-xl ${allComplete ? "text-on" : isWarning ? "text-warning" : "text-primary-text"}`}
                />
            </span>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 w-full border-b border-primary-border pb-3">
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
            </div>
            {todos.length > 0 && (
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-sm text-muted">
                        {completedCount} / {todos.length} done
                    </span>
                    <div className="w-full h-2 rounded-full bg-secondary-bg">
                        <div
                            className="h-2 rounded-full bg-on transition-[width] duration-300 ease-in-out"
                            style={{ width: `${(completedCount / todos.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col items-start w-full list-none p-0 m-0">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                isRemoving={removingIds.has(todo.id)}
                                onRemoveComplete={() => handleRemoveComplete(todo.id)}
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
            {todos.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-4 text-muted">
                    <p className="text-sm">Add your first task for today</p>
                    <ArrowDown className="hint-arrow" size={20} />
                </div>
            )}
            <button className="w-25 h-15 bg-linear-to-r from-accent-from to-accent-to hover:from-accent-from-hover hover:to-accent-to-hover hover:cursor-pointer text-white rounded flex items-center justify-center" onClick={handleAddTodo}>
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

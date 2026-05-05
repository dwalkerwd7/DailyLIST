import { useState, useRef, useEffect } from "react";
import ModalAlert from "./utils/alerts/ModalAlert";
import { openModalAlert, type ModalAlertState } from "./utils/alerts/modalAlertUtils";
import ControlsBar from "./ControlsBar";
import TimerDisplay from "./TimerDisplay";
import useTimer from "../hooks/useTimer";
import TodoList, { arrayMove, type DragEndEvent } from "./TodoList";
import AddTodoButton from "./AddTodoButton";
import { APIPaths } from "../app-constants";
import { playTodoAdded, playTodoCompleted, playTodoUncompleted, playTodoDeleted } from "../sounds";
import useAchievements from "../hooks/useAchievements";
import {
  type Todo,
  type ToggleCompleteHandler,
  type UpdateTitleHandler,
  type UpdateNotesHandler,
  type DeleteHandler,
  type ToggleExpandHandler,
} from "./TodoItem";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [modalAlertProps, setModalAlertProps] = useState<ModalAlertState>(null);
  const { toastQueue, achievementsLoadedRef, loadAchievements, checkAchievements, dismissToast } = useAchievements();
  const {
    counterHandle, timerTouchRef,
    isWarning, isPulsing, isDimmed, isTimerHovered, isTimerTouchRevealed,
    setIsTimerHovered, setIsTimerTouchRevealed,
    handleCounterTick, timeLeftFormatString,
    startTimerAnew, initializeTimer, resetTimerState, pauseTimer, resumeIfActive,
  } = useTimer();

  const hasLoaded = useRef(false);
  const prevTodosRef = useRef<Todo[]>([]);

  const generateNewTodoID = () => Math.floor(Math.random() * 9000) + 1000;

  const loadTodos = async () => {
    try {
      const response = await fetch(APIPaths.todos);
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);

        if (data.expiresAt) initializeTimer(data.expiresAt);
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
    void loadAchievements();
  }, []);
  useEffect(() => {
    const allComplete = todos.length > 0 && todos.every(t => t.completed);

    if (todos.length === 0) resetTimerState();
    else if (allComplete) pauseTimer();
    else resumeIfActive();

    if (hasLoaded.current) {
      if (achievementsLoadedRef.current) checkAchievements(prevTodosRef.current, todos);
      prevTodosRef.current = todos;
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

    playTodoAdded();
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
    const todo = todos.find(t => t.id === id);
    if (todo) {
      if (todo.completed) playTodoUncompleted();
      else playTodoCompleted();
    }
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
      playTodoDeleted();
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

  const completedCount = todos.filter(t => t.completed).length;
  const allComplete = todos.length > 0 && completedCount === todos.length;

  return (
    <div className="flex flex-col items-center gap-3 w-full px-4 sm:px-0">
      <TimerDisplay
        isPulsing={isPulsing}
        isDimmed={isDimmed}
        isWarning={isWarning}
        allComplete={allComplete}
        isTimerHovered={isTimerHovered}
        isTimerTouchRevealed={isTimerTouchRevealed}
        counterHandle={counterHandle}
        timerTouchRef={timerTouchRef}
        setIsTimerHovered={setIsTimerHovered}
        setIsTimerTouchRevealed={setIsTimerTouchRevealed}
        formatString={timeLeftFormatString}
        onTick={handleCounterTick}
      />
      <ControlsBar
        allExpanded={allExpanded}
        toastQueue={toastQueue}
        onToggleExpandAll={handleToggleExpandAll}
        onResetList={handleResetList}
        onDismissToast={dismissToast}
      />
      <TodoList
        todos={todos}
        removingIds={removingIds}
        completedCount={completedCount}
        onDragEnd={handleDragEnd}
        onRemoveComplete={handleRemoveComplete}
        onToggleExpand={handleToggleExpand}
        onToggleComplete={handleToggleComplete}
        onUpdateTitle={handleUpdateTitle}
        onUpdateNotes={handleUpdateNotes}
        onDelete={handleDeleteTodo}
      />
      <AddTodoButton onClick={handleAddTodo} />
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

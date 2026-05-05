import { useState, useRef, useEffect, type RefObject } from "react";
import { openModalAlert, type ModalAlertState } from "../components/utils/alerts/modalAlertUtils";
import { APIPaths } from "../app-constants";
import { playTodoAdded, playTodoCompleted, playTodoUncompleted, playTodoDeleted } from "../sounds";
import { arrayMove, type DragEndEvent } from "../components/TodoList";
import {
  type Todo,
  type ToggleCompleteHandler,
  type UpdateTitleHandler,
  type UpdateNotesHandler,
  type DeleteHandler,
  type ToggleExpandHandler,
} from "../components/TodoItem";

interface UseTodosOptions {
  startTimerAnew: () => void;
  initializeTimer: (expiresAt: number) => void;
  resetTimerState: () => void;
  pauseTimer: () => void;
  resumeIfActive: () => void;
  loadAchievements: () => Promise<void>;
  checkAchievements: (prev: Todo[], curr: Todo[]) => void;
  achievementsLoadedRef: RefObject<boolean>;
}

export default function useTodos({
  startTimerAnew,
  initializeTimer,
  resetTimerState,
  pauseTimer,
  resumeIfActive,
  loadAchievements,
  checkAchievements,
  achievementsLoadedRef,
}: UseTodosOptions) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [modalAlertProps, setModalAlertProps] = useState<ModalAlertState>(null);

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
        headers: { "Content-Type": "application/json" },
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
      if (prev.length === 0) startTimerAnew();
      return [...prev, { id: generateNewTodoID(), completed: false, title: "", expanded: false }];
    });
  };

  const handleToggleComplete: ToggleCompleteHandler = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      if (todo.completed) playTodoUncompleted();
      else playTodoCompleted();
    }
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleToggleExpand: ToggleExpandHandler = (id: number) => {
    const newTodos = todos.map((todo) => todo.id === id ? { ...todo, expanded: !todo.expanded } : todo);
    setTodos(newTodos);
    setAllExpanded(newTodos.every((todo) => todo.expanded));
  };

  const handleUpdateTitle: UpdateTitleHandler = (id: number, title: string) => {
    if (title.length >= 50) title = title.slice(0, 50);
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
    if (!over || active.id === over.id) return;
    setTodos((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === active.id);
      const newIndex = prev.findIndex((todo) => todo.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleToggleExpandAll = () => {
    if (todos.length === 0) return;
    const newAllExpanded = !todos.every((todo) => todo.expanded);
    setAllExpanded(newAllExpanded);
    setTodos((prev) => prev.map((todo) => ({ ...todo, expanded: newAllExpanded })));
  };

  const handleResetList = () => {
    if (todos.length === 0) return;
    openModalAlert(setModalAlertProps, "critical", "Reset List", "Are you sure you want to delete all your todos? This process is irreversible.", "Reset", () => {
      setTodos([]);
      setAllExpanded(false);
      setModalAlertProps(null);
    });
  };

  return {
    todos,
    removingIds,
    allExpanded,
    modalAlertProps,
    handleAddTodo,
    handleToggleComplete,
    handleToggleExpand,
    handleUpdateTitle,
    handleUpdateNotes,
    handleRemoveComplete,
    handleDeleteTodo,
    handleDragEnd,
    handleToggleExpandAll,
    handleResetList,
  };
}

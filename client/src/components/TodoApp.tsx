import ModalAlert from "./utils/alerts/ModalAlert";
import ControlsBar from "./ControlsBar";
import TimerDisplay from "./TimerDisplay";
import TodoList from "./TodoList";
import AddTodoButton from "./AddTodoButton";
import useAchievements from "../hooks/useAchievements";
import useTimer from "../hooks/useTimer";
import useTodos from "../hooks/useTodos";

export default function TodoApp() {
  const { toastQueue, achievementsLoadedRef, loadAchievements, checkAchievements, dismissToast } = useAchievements();
  const {
    counterHandle, timerTouchRef,
    isWarning, isPulsing, isDimmed, isTimerHovered, isTimerTouchRevealed,
    setIsTimerHovered, setIsTimerTouchRevealed,
    handleCounterTick, timeLeftFormatString,
    startTimerAnew, initializeTimer, resetTimerState, pauseTimer, resumeIfActive,
  } = useTimer();
  const {
    todos, removingIds, allExpanded, modalAlertProps,
    handleAddTodo, handleToggleComplete, handleToggleExpand,
    handleUpdateTitle, handleUpdateNotes, handleRemoveComplete,
    handleDeleteTodo, handleDragEnd, handleToggleExpandAll, handleResetList,
  } = useTodos({
    startTimerAnew, initializeTimer, resetTimerState, pauseTimer, resumeIfActive,
    loadAchievements, checkAchievements, achievementsLoadedRef,
  });

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

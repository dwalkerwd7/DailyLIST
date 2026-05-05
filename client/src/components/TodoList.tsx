import { ArrowDown } from "lucide-react";
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
import ProgressBar from "./utils/ProgressBar";
import TodoItem, {
    type Todo,
    type ToggleCompleteHandler,
    type UpdateTitleHandler,
    type UpdateNotesHandler,
    type DeleteHandler,
    type ToggleExpandHandler,
} from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    removingIds: Set<number>;
    completedCount: number;
    onDragEnd: (event: DragEndEvent) => void;
    onRemoveComplete: (id: number) => void;
    onToggleExpand: ToggleExpandHandler;
    onToggleComplete: ToggleCompleteHandler;
    onUpdateTitle: UpdateTitleHandler;
    onUpdateNotes: UpdateNotesHandler;
    onDelete: DeleteHandler;
}

export default function TodoList({
    todos,
    removingIds,
    completedCount,
    onDragEnd,
    onRemoveComplete,
    onToggleExpand,
    onToggleComplete,
    onUpdateTitle,
    onUpdateNotes,
    onDelete,
}: TodoListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <>
            {todos.length > 0 && (
                <ProgressBar value={completedCount} max={todos.length} />
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col items-start w-full list-none p-0 m-0">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                isRemoving={removingIds.has(todo.id)}
                                onRemoveComplete={() => onRemoveComplete(todo.id)}
                                onToggleExpand={onToggleExpand}
                                onToggleComplete={onToggleComplete}
                                onUpdateTitle={onUpdateTitle}
                                onUpdateNotes={onUpdateNotes}
                                onDelete={onDelete}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            {todos.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-4 text-muted">
                    <p className="text-sm">Add your first task for the day</p>
                    <ArrowDown className="hint-arrow" size={20} />
                </div>
            )}
        </>
    );
}

export { arrayMove };
export type { DragEndEvent };

import { useState } from "react";
import { TodoList, TodoItem, type Todo, type ToggleCompleteHandler, type UpdateNotesHandler, type DeleteHandler } from "./TodoList";

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const generateNewTodoID = () => {
        return Date.now();
    };

    const handleAddTodo = () => {
        setTodos([...todos, { id: generateNewTodoID(), completed: false, title: "New Todo" }]);
    };

    const handleOnToggleComplete: ToggleCompleteHandler = (id: number) => {
        setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const handleUpdateNotes: UpdateNotesHandler = (id: number, notes: string) => {
        setTodos(todos.map((todo) => todo.id === id ? { ...todo, notes } : todo));
    };

    const handleOnDelete: DeleteHandler = (id: number) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            setTodos(todos.filter((todo) => todo.id !== id));
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <TodoList>
                {todos.map((todo) => (
                    <TodoItem 
                        key={todo.id} 
                        todo={todo} 
                        onToggleComplete={handleOnToggleComplete} 
                        onUpdateNotes={handleUpdateNotes}
                        onDelete={handleOnDelete}
                    />
                ))}
            </TodoList>
            <button className="w-25 h-15 text-lg bg-button-primary-hover text-white rounded" onClick={handleAddTodo}>
                +
            </button>
        </div>
    );
}
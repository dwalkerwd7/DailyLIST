import { Plus } from "lucide-react";

interface AddTodoButtonProps {
    onClick: () => void;
}

export default function AddTodoButton({ onClick }: AddTodoButtonProps) {
    return (
        <button
            className="w-25 h-15 bg-linear-to-r from-accent-from to-accent-to hover:from-accent-from-hover hover:to-accent-to-hover hover:cursor-pointer text-white rounded flex items-center justify-center"
            onClick={onClick}
        >
            <Plus size={28} />
        </button>
    );
}

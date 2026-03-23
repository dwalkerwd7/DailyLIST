import { X } from "lucide-react";

type RotatingXProps = {
    className?: string;
    disabled?: boolean;
};

export default function RotatingX({ className = '', disabled = false }: RotatingXProps) {
    return (
        <X
            className={`h-4 w-4 ${!disabled ? 'transition-transform duration-150 ease-out group-hover:rotate-90' : ''} ${className}`}
            aria-hidden="true"
        />
    );
}

export type { RotatingXProps };

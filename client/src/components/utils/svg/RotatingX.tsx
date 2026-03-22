type RotatingXProps = {
	className?: string;
    disabled?: boolean;
};

export default function RotatingX({ className = '', disabled = false }: RotatingXProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={`h-4 w-4 ${!disabled ? 'transition-transform duration-150 ease-out group-hover:rotate-90' : ''} ${className}`}
			aria-hidden="true"
		>
			<path
				d="M6 6L18 18M18 6L6 18"
				stroke="currentColor"
				strokeWidth="2.25"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export type { RotatingXProps };
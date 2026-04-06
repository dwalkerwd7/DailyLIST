type ProgressBarProps = {
    value: number;
    max: number;
    label?: string;
};

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
    const percent = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
            <span className="text-sm text-muted">{label ?? `${value} / ${max} done`}</span>
            <div className="w-full h-2 rounded-full bg-secondary-bg">
                <div
                    className="h-2 rounded-full bg-on transition-[width] duration-300 ease-in-out"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

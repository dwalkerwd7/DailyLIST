import { useEffect, useRef } from "react";

type DynamicTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function DynamicTextarea({ value, ...props }: DynamicTextareaProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const textarea = ref.current;
        const computedStyle = window.getComputedStyle(textarea);
        const minHeight = Number.parseFloat(computedStyle.minHeight) || 0;
        const maxHeightRaw = Number.parseFloat(computedStyle.maxHeight);
        const maxHeight = Number.isFinite(maxHeightRaw) ? maxHeightRaw : Number.POSITIVE_INFINITY;

        textarea.style.height = "auto";
        const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${nextHeight}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [value]);

    return <textarea ref={ref} value={value} {...props} />;
}

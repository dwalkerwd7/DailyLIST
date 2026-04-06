import { useState } from "react";
import { X } from "lucide-react";

type AlertType = 'error' | 'success' | 'info' | 'warning' | 'critical';
type PageAlertProps = {
    title?: string,
    closable?: boolean,
    msg: string,
    type: AlertType
};

export default function PageAlert({ title = '', closable = false, msg, type }: PageAlertProps) {
    const [dismissedMsg, setDismissedMsg] = useState('');
    const visible = msg.length > 0 && msg !== dismissedMsg;

    const handleClose = (elem: HTMLButtonElement | null) => {
        if (!closable) {
            return; // Don't close if the button is disabled
        }

        if (elem && elem.parentElement) {
            elem.parentElement.classList.add('alert-fade-out');
        } else {
            setDismissedMsg(msg);
        }
    };

    const titleColorsByType: Record<AlertType, string> = {
        success: "text-alert-success-title",
        error: "text-alert-error-title",
        info: "text-alert-info-title",
        warning: "text-alert-warning-title",
        critical: "text-alert-critical-title"
    };

    const colorsBasedOnType: Record<AlertType, string> = {
        success: "bg-alert-success-bg/80 text-alert-success border-alert-success",
        error: "bg-alert-error-bg/80 text-alert-error border-alert-error",
        info: "bg-alert-info-bg/80 text-alert-info border-alert-info",
        warning: "bg-alert-warning-bg/80 text-alert-warning border-alert-warning",
        critical: "bg-alert-critical-bg/80 text-alert-critical border-alert-critical"
    };

    return visible ? (
        <div
            className={`relative flex justify-center ${colorsBasedOnType[type]} mt-4 px-4 py-2 rounded-md border`}
            onAnimationEnd={(e) => { if (e.animationName === 'fade-out') setDismissedMsg(msg); }}
        >
            <div className="flex flex-col items-center">
                {title && <h3 className={`font-bold mb-1 ${titleColorsByType[type]}`}>{title}</h3>}
                <p>{msg}</p>
            </div>
            {closable && (
                <button
                    type="button"
                    aria-label="Close alert"
                    className="group absolute top-1 right-1 inline-flex h-7 w-7 items-center justify-center
                        rounded-full border border-primary-border bg-primary-bg text-primary-text shadow-sm transition-all duration-150
                        hover:scale-105 hover:bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-button-primary"
                    onClick={(e) => handleClose(e.currentTarget)}
                >
                    <X className="h-4 w-4 group-hover:animate-rotate-x" aria-hidden="true" />
                </button>
            )}
        </div>
    ) : null;
};

export type { PageAlertProps, AlertType };

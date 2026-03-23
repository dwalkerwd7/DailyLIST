import { useEffect } from "react";
import Modal from "react-modal";
import type { AlertType } from "./PageAlert";

type ModalAlertProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: AlertType;
    confirmLabel?: string;
    cancelLabel?: string;
    showCancel?: boolean;
};

type ModalAlertState = ModalAlertProps | null;

const colorsByType: Record<AlertType, string> = {
    success: "bg-alert-success-bg/60 text-alert-success border-alert-success",
    error: "bg-alert-error-bg/60 text-alert-error border-alert-error",
    info: "bg-alert-info-bg/60 text-alert-info border-alert-info",
    warning: "bg-alert-warning-bg/60 text-alert-warning border-alert-warning",
    critical: "bg-alert-critical-bg/60 text-alert-critical border-alert-critical"
};

const buttonColorsByType: Record<AlertType, string> = {
    success: "bg-alert-success-bg text-white hover:brightness-95",
    error: "bg-alert-error-bg text-white hover:brightness-95",
    info: "bg-alert-info-bg text-white hover:brightness-95",
    warning: "bg-alert-warning-bg text-white hover:brightness-95",
    critical: "bg-alert-critical-bg text-white hover:brightness-95"
};

function openModalAlert(
    setter: React.Dispatch<React.SetStateAction<ModalAlertState>>,
    type: AlertType,
    title: string,
    message: string,
    confirmLabel: string,
    action: () => void,
) {
    setter({
        isOpen: true,
        title,
        message,
        type,
        confirmLabel,
        onConfirm: action,
        onRequestClose: () => setter(null),
    });
}

export default function ModalAlert({
    isOpen,
    onRequestClose,
    onConfirm,
    title,
    message,
    type = "error",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    showCancel = true,
}: ModalAlertProps) {
    useEffect(() => {
        Modal.setAppElement("#root");
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick
            shouldCloseOnEsc
            contentLabel={title}
            overlayClassName="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            className={`fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border ${colorsByType[type]} p-6 shadow-2xl outline-none`}
        >
            <div className={`mb-4 block w-full rounded-full text-center border px-3 py-1 text-sm font-semibold uppercase tracking-wide ${colorsByType[type]}`}>
                {type}
            </div>
            <h2 className="mb-2 text-xl font-bold text-primary-text">{title}</h2>
            <p className="mb-6 text-sm text-primary-text">{message}</p>
            <div className="flex justify-end gap-3">
                {showCancel && (
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="w-20 h-9 rounded-md border border-primary-border bg-button-tertiary text-sm text-todo-text transition-colors hover:bg-button-tertiary-hover"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="button"
                    onClick={onConfirm ?? onRequestClose}
                    className={`w-20 h-9 rounded-md px-4 text-sm transition-colors ${buttonColorsByType[type]}`}
                >
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}

export { openModalAlert };
export type { ModalAlertState };

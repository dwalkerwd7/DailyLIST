import type { Dispatch, SetStateAction } from "react";
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

function openModalAlert(
    setter: Dispatch<SetStateAction<ModalAlertState>>,
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

export { openModalAlert };
export type { ModalAlertProps, ModalAlertState };

import { useEffect, useState } from "react";

type AlertMessage = {
    title?: string,
    msg: string,
    type: 'error' | 'success'
};

export default function Alert({ message }: { message: AlertMessage }) {
    const { title, msg, type } = message;
    const [closed, setClosed] = useState(false);

    // Reset close state only when a new alert message arrives.
    useEffect(() => {
        if(msg.length > 0)
            setClosed(false);
    }, [msg, type]);

    const handleClose = (elem: HTMLButtonElement | null) => {
        if(elem && elem.parentElement) {
            elem.parentElement.classList.add('alert-fade-out');
            setTimeout(() => {
                setClosed(true);
            }, 200); // Match this duration with the CSS animation duration
        } else {
            setClosed(true);
        }
    };

    const getClassesBasedOnMessageType = () => {
        if (type === 'success') {
            return 'text-alert-success bg-alert-success-bg border-alert-success';
        } else {
            return 'text-alert-error bg-alert-error-bg border-alert-error';
        }
    };

    return msg.length > 0 && !closed ? (
        <div className={`
            relative flex justify-center 
            ${getClassesBasedOnMessageType()}
            mt-4 px-4 py-2 rounded-md border
        `}>
            <div className="flex flex-col items-center">
                {title && <h3 className="font-bold mb-1">{title}</h3>}
                <p>{ msg }</p>
            </div>
            <button 
                type="button" 
                className={`absolute top-0 right-0 h-6 w-6 items-center justify-center rounded-lg text-sm bg-white text-black`} 
                onClick={(e) => handleClose(e.currentTarget)}
            >
                X
            </button>
        </div>
    ) : null;
};

export type { AlertMessage };
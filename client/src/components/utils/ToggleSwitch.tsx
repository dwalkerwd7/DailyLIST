export default function ToggleSwitch({ isOn, handleToggle }: { isOn: boolean; handleToggle: () => void }) {
    return (
        <button
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isOn ? 'bg-on' : 'bg-off'
            }`}
            aria-label="Toggle switch"
        >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                    isOn ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
        </button>
    );
};
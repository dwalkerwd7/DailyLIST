export default function ToggleSwitch({ isOn, handleToggle, width=14, height=8 }: { isOn: boolean; handleToggle: () => void; width?: number; height?: number; }) {
    const outerWidth = width * 4;
    const outerHeight = height * 4;
    const innerWidthEm = (width - 2) * 0.25 * 0.6;
    const innerHeightEm = (height - 2) * 0.25;
    const translateRightEm = (width - 2) * 0.25 * 0.5;

    return (
        <button
            onClick={handleToggle}
            className={`relative inline-flex items-center rounded-full transition-colors caret-off outline-none ${
                isOn ? 'bg-on' : 'bg-off'
            }`}
            style={{width: `${outerWidth}px`, height: `${outerHeight}px`}}
            aria-label="Toggle switch"
        >
            <span
                className="inline-block transform rounded-full bg-white shadow-lg transition-transform caret-off"
                style={{
                    width: `${innerWidthEm}em`,
                    height: `${innerHeightEm}em`,
                    transform: isOn ? `translateX(${translateRightEm}em)` : 'translateX(0.25em)',
                }}
            />
        </button>
    );
};

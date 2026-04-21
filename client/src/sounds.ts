let ctx: AudioContext | null = null;

const getCtx = () => {
    if (!ctx) ctx = new AudioContext();
    return ctx;
};

// Plays a single sine tone at `freq` Hz, starting at `startTime` (audio clock
// seconds), fading out over `duration` seconds.
const playNote = (freq: number, startTime: number, duration: number, volume = 0.12) => {
    const context = getCtx();

    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
};

// --- Todo action sounds ---

// Short soft blip when a todo is added
export const playTodoAdded = () => {
    const now = getCtx().currentTime;
    playNote(587, now, 0.12, 0.08); // D5 — light tap
};

// Satisfying tick when a todo is checked off
export const playTodoCompleted = () => {
    const now = getCtx().currentTime;
    playNote(784, now, 0.1, 0.09); // G5
    playNote(1047, now + 0.07, 0.15, 0.07); // C6 — small lift at the end
};

// Softer descending blip when a todo is unchecked
export const playTodoUncompleted = () => {
    const now = getCtx().currentTime;
    playNote(523, now, 0.15, 0.07); // C5 — quieter, lower
};

// Brief low tone when a todo is deleted
export const playTodoDeleted = () => {
    const now = getCtx().currentTime;
    playNote(330, now, 0.12, 0.07); // E4 — low, understated
};

// --- Achievement sounds ---

export const playAchievementSound = (id: string) => {
    const now = getCtx().currentTime;

    switch (id) {
        case "first_todo_added":
            // Single soft note — a gentle nudge to get started
            playNote(523, now, 0.35);
            break;
        case "first_completed":
            // Two ascending notes — small win
            playNote(523, now, 0.2);
            playNote(659, now + 0.12, 0.3);
            break;
        case "five_added":
            // Two notes — quiet acknowledgment
            playNote(440, now, 0.15);
            playNote(587, now + 0.10, 0.3);
            break;
        case "five_completed":
            // Three ascending notes — building momentum
            playNote(523, now, 0.15);
            playNote(659, now + 0.10, 0.15);
            playNote(784, now + 0.20, 0.35);
            break;
        case "ten_added":
            // Two notes, a fifth apart
            playNote(440, now, 0.15);
            playNote(659, now + 0.11, 0.3);
            break;
        case "ten_completed":
            // Four ascending notes — more celebratory than five_completed
            playNote(523, now, 0.12);
            playNote(659, now + 0.09, 0.12);
            playNote(784, now + 0.18, 0.12);
            playNote(1047, now + 0.27, 0.4);
            break;
        case "all_completed":
            // C major arpeggio — all done
            playNote(523, now, 0.15);
            playNote(659, now + 0.09, 0.15);
            playNote(784, now + 0.18, 0.15);
            playNote(1047, now + 0.27, 0.45);
            break;
    }
};

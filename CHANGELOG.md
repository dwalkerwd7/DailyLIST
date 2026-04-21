# Changelog

## v0.9.0

### Features
- Achievement toasts — short-lived notifications that appear on the controls bar when milestones are reached, persisted via cookie so each fires only once per day
- Achievements: first todo added, first completed, 5 added, 10 added, 5 completed, 10 completed, all completed
- Web Audio API sounds for todo actions: add, complete, uncomplete, delete
- Distinct achievement sounds per milestone using scheduled sine-wave arpeggios

### Improvements
- Achievement definitions extracted to `achievements.ts` with typed `Record<string, Achievement>` shape
- Sound synthesis isolated in `sounds.ts`; `AudioContext` created lazily on first use to respect browser autoplay policy
- Achievement milestone checks extracted into `checkAchievements(prev, curr)` function
- Achievement API endpoints (`GET/POST /api/achievements`) use a plain `string[]` cookie — no `startTime` needed since cookie expiry is the source of truth


## v0.8.2

### Features
- Timer dims (fades to muted color, 30% opacity) after the activation/deactivation highlight animation ends — applies regardless of warning state
- Timer is revealed on mouse hover or touch tap (toggle), and re-dims on mouse leave
- During warning pulse, dim is suppressed so the red warning color shows through
- Invisible hit area div wraps the timer for easier hover/touch interaction

### Improvements
- Header title changed from solid purple to a purple → indigo gradient
- Confirmation flash now scoped to the title input container only (not the whole todo row), color changed to purple
- Home page max-width narrowed one step at `md` and `lg` breakpoints; `sm` uses full width
- `App.css` restructured: `@theme`, `@layer components`, `@layer utilities`, and `@keyframes` are now top-level instead of nested inside `@layer base`
- `Counter` refactored to call `onTick` directly in the interval callback instead of inside a `setCurrentTime` updater, preventing potential double-invocation in strict/concurrent mode


## v0.8.1

### Features
- Added Home nav link to header with exact-match active highlighting
- Feedback form now requires a category selection (Issue, Suggestion, Comment) which is included in the log
- Checkboxes are now purple using the theme's highlight color
- Todo title input replaced with a single-line textarea with a styled purple horizontal scrollbar when text overflows
- Notes section now shows a visible character counter (0/500)
- Delete button moved into the main todo row as a trash icon, between the title and checkbox

### Improvements
- Todo title input is now vertically centered with a subtle background and focus color change instead of a focus ring
- Todo title wrapper goes transparent during the confirm flash so the green shows through
- Confirm animation now triggers on blur only when the title has actually changed; Enter blurs the textarea
- Confirm animation resets via `animationend` instead of a hardcoded `setTimeout`
- `todo-enter` animation no longer re-triggers on re-renders after initial mount
- Notes area background lightened in both light and dark mode
- Progress bar extracted into a reusable `ProgressBar` component with max-width and centering
- Alert heading colors now correctly use per-type color tokens instead of the global purple heading color
- `PageAlert` close state replaced `useEffect` + boolean with a `dismissedMsg` string — no more setState in an effect
- `PageAlert` close animation uses `animationend` instead of a hardcoded `setTimeout`
- `RotatingX` component removed — close button now uses a Lucide `X` icon with a CSS keyframe rotation
- `openModalAlert` and related types moved to `modalAlertUtils.ts` so `ModalAlert.tsx` only exports a component (fixes Fast Refresh)
- Responsive min and max widths on the home page container for sm, md, and lg screens

### Bug fixes
- Fixed confirm flash animation never playing — `todo-confirm` was defined before `todo-enter` in the stylesheet, causing `todo-enter` to always win the cascade


## v0.8.0

### Features
- Purple used as the completion/on color (toggle switch, progress bar, timer all-complete state, confirm flash)
- Todo count and progress bar showing completed / total
- Timer turns red with a per-minute pulse animation at ≤30 minutes remaining
- Timer turns green and pauses when all todos are complete; resumes on uncheck
- Bouncing arrow hint above the + button when the list is empty
- Enter key on a todo title flashes a green confirmation animation
- Todos fade in on add and fade out on delete
- `animationend` event drives delete timing instead of a hardcoded `setTimeout`
- Active nav link highlight using React Router's `NavLink`
- Dark mode on by default
- Purple accent color palette for interactive/primary elements
- Purple → blue gradient on the add button

### Improvements
- Increased touch target sizes for drag handle, expand/collapse, checkbox, and delete buttons
- Removed auto-delete feature — todos can only be removed via the delete button
- About page updated to reflect removed features
- Feedback page: submit button uses accent gradient, form inputs use themed background

### Bug fixes
- Fixed mobile width overflow, header layout, and controls bar wrapping
- Fixed DnD touch scroll conflict on mobile (added `PointerSensor` activation distance constraint)
- Fixed header title animation getting stuck on mobile — tap now plays a one-shot animation via `onTouchStart`/`isTouchRef` pattern to ignore synthetic mouse events
- Fixed `hasLoaded` never being set on a failed fetch, which blocked all subsequent saves
- Fixed todo-enter CSS animation conflicting with dnd-kit's inline transform during drag
- Fixed `hasSubmittedFeedback` being read from a ref during render — converted to state

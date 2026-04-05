# Changelog

## v0.8

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

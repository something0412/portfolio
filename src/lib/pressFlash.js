const HOLD_MS = 650;

// On touch screens, marks the pressed button for a moment so its hover effect plays forward, then back
export function flashPress(event) {
  if (event.pointerType === "mouse") return;
  const el = event.currentTarget;
  el.dataset.pressed = "";
  clearTimeout(el.pressTimer);
  el.pressTimer = setTimeout(() => {
    delete el.dataset.pressed;
  }, HOLD_MS);
}

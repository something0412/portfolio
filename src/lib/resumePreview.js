export const RESUME_PREVIEW_EVENT = "resume-preview:open";

// Asks the resume preview to expand out of the pressed element, on phones and touch screens only
export function openResumePreview(event) {
  if (!window.matchMedia("(hover: none), (max-width: 639px)").matches) return;
  window.dispatchEvent(new CustomEvent(RESUME_PREVIEW_EVENT, { detail: event.currentTarget }));
}

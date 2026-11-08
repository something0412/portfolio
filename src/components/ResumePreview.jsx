import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { resumeFileName, resumeUrl } from "../data/content";
import { RESUME_PREVIEW_EVENT } from "../lib/resumePreview";

const MORPH_MS = 450;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const TRANSITION = ["left", "top", "width", "height", "border-radius"].map((p) => `${p} ${MORPH_MS}ms ${EASE}`).join(", ");

// The pressed button's box, shaped as a pill
const buttonBox = (origin) => {
  const r = origin.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height, radius: r.height / 2 };
};

// The centred box the preview settles into
const centerBox = () => {
  const pad = window.innerWidth < 640 ? 12 : 24;
  const width = Math.min(window.innerWidth - pad * 2, 768);
  const height = Math.min(window.innerHeight * 0.92, 992);
  return { left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height, radius: 24 };
};

const place = (el, box) => {
  el.style.left = `${box.left}px`;
  el.style.top = `${box.top}px`;
  el.style.width = `${box.width}px`;
  el.style.height = `${box.height}px`;
  el.style.borderRadius = `${box.radius}px`;
};

export default function ResumePreview() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [pdfMounted, setPdfMounted] = useState(false);
  const originRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeRef = useRef(null);
  const openTimerRef = useRef(0);
  const closeTimerRef = useRef(0);

  // Opens when any Resume button asks, remembering which button to grow out of
  useEffect(() => {
    const handleOpen = (event) => {
      originRef.current = event.detail;
      clearTimeout(closeTimerRef.current);
      setClosing(false);
      setShowContent(false);
      setPdfMounted(false);
      setOpen(true);
    };
    window.addEventListener(RESUME_PREVIEW_EVENT, handleOpen);
    return () => window.removeEventListener(RESUME_PREVIEW_EVENT, handleOpen);
  }, []);

  // Grows the panel out of the button into the centre, then fades the resume in
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!open || closing || !panel || !originRef.current) return undefined;
    panel.style.transition = "none";
    backdrop.style.transition = "none";
    place(panel, buttonBox(originRef.current));
    backdrop.style.opacity = "0";
    panel.getBoundingClientRect();
    panel.style.transition = TRANSITION;
    backdrop.style.transition = `opacity ${MORPH_MS}ms ease`;
    place(panel, centerBox());
    backdrop.style.opacity = "1";
    openTimerRef.current = setTimeout(() => {
      setShowContent(true);
      setPdfMounted(true);
      closeRef.current?.focus();
    }, MORPH_MS);
    return () => clearTimeout(openTimerRef.current);
  }, [open, closing]);

  // Keeps the open panel centred when the window changes size
  useEffect(() => {
    if (!open || closing) return undefined;
    const handleResize = () => {
      panelRef.current.style.transition = "none";
      place(panelRef.current, centerBox());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, closing]);

  // Shrinks the panel back into the button, then removes it
  const close = () => {
    const panel = panelRef.current;
    if (!panel || closing) return;
    clearTimeout(openTimerRef.current);
    setClosing(true);
    setShowContent(false);
    panel.style.transition = `${TRANSITION}, opacity ${MORPH_MS}ms ease`;
    if (originRef.current?.isConnected) place(panel, buttonBox(originRef.current));
    else panel.style.opacity = "0";
    backdropRef.current.style.opacity = "0";
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, MORPH_MS);
  };

  // Escape closes it, and the page behind stops scrolling while it is open
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") close();
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", handleKey);
    };
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div ref={backdropRef} onClick={close} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Resume preview"
        className="fixed flex flex-col overflow-hidden border border-panel-border bg-[#0f0d1c] shadow-2xl"
      >
        <div
          className={`flex shrink-0 items-center justify-between gap-3 border-b border-panel-border px-4 py-3 transition-opacity duration-200 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-display text-sm font-semibold text-text">Resume</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-2 py-1 text-xs text-text-dim transition-colors hover:text-text sm:px-3"
            >
              Open in new tab
            </a>
            <a
              href={resumeUrl}
              download={resumeFileName}
              className="rounded-full px-2 py-1 text-xs text-text-dim transition-colors hover:text-text sm:px-3"
            >
              Download
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close resume preview"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-bg transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-3.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {/* The PDF only loads once the panel has finished growing, so the animation stays smooth */}
        <div className={`flex-1 bg-white transition-opacity duration-300 ${showContent ? "opacity-100" : "opacity-0"}`}>
          {pdfMounted && (
            <iframe src={`${resumeUrl}#view=FitH&navpanes=0`} title="Resume" className="size-full" />
          )}
        </div>
      </div>
    </div>
  );
}

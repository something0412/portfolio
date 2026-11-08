import { useEffect, useRef } from "react";
import TimelineItem from "./TimelineItem";

// Eases a scroll position toward a target like the browser's smooth wheel scroll, and stops if something else moves it
function createGlider(read, write, max) {
  let target = 0;
  let pos = 0;
  let last = 0;
  let raf = 0;
  const step = (now) => {
    if (Math.abs(read() - pos) > 2) {
      raf = 0;
      return;
    }
    const dt = last ? now - last : 16;
    last = now;
    const next = pos + (target - pos) * (1 - Math.exp(-dt / 55));
    pos = Math.abs(target - next) < 0.5 ? target : next;
    write(pos);
    raf = pos === target ? 0 : requestAnimationFrame(step);
  };
  return {
    active: () => raf !== 0,
    add(dy) {
      if (!raf) {
        pos = read();
        target = pos;
        last = 0;
      }
      const before = target;
      target = Math.min(max(), Math.max(0, target + dy));
      if (!raf && target !== pos) raf = requestAnimationFrame(step);
      return target - before;
    },
    cancel() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

export default function Timeline({ entries, scrollable = false }) {
  const viewportRef = useRef(null);
  const thumbRef = useRef(null);

  // Tracks how far the list is from each end to size the fades and place the thumb
  useEffect(() => {
    const viewport = viewportRef.current;
    const thumb = thumbRef.current;
    if (!scrollable || !viewport || !thumb) return undefined;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const maxScroll = scrollHeight - clientHeight;
      viewport.style.setProperty("--overflow-start", `${scrollTop}px`);
      viewport.style.setProperty("--overflow-end", `${Math.max(0, maxScroll - scrollTop)}px`);
      const thumbHeight = Math.max(24, (clientHeight / scrollHeight) * (clientHeight - 8));
      const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * (clientHeight - 8 - thumbHeight) : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTop}px)`;
      thumb.style.opacity = maxScroll > 0 ? "1" : "0";
    };

    const page = createGlider(
      () => window.scrollY,
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    const listGlider = createGlider(
      () => viewport.scrollTop,
      (y) => {
        viewport.scrollTop = y;
      },
      () => viewport.scrollHeight - viewport.clientHeight,
    );

    // Sends each wheel tick to whatever is under the cursor right now: the list first, then the page with what is left
    const handleWheel = (event) => {
      if (event.ctrlKey) return;
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (!dy) return;
      const rect = viewport.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (inside) {
        event.preventDefault();
        const rest = dy - listGlider.add(dy);
        if (Math.abs(rest) > 0.5) page.add(rest);
      } else if (page.active()) {
        event.preventDefault();
        page.add(dy);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    viewport.addEventListener("scroll", update, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      page.cancel();
      listGlider.cancel();
      observer.disconnect();
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollable, entries]);

  const list = (
    <ul className="ml-9 border-l border-panel-border sm:ml-10">
      {entries.map((entry) => (
        <TimelineItem key={entry.name} entry={entry} />
      ))}
    </ul>
  );

  if (!scrollable) {
    return <div className="rounded-2xl border border-panel-border bg-panel">{list}</div>;
  }

  // Fades the edges only by as much as there is left to scroll, with a slim overlay thumb
  return (
    <div className="relative overflow-hidden rounded-2xl border border-panel-border bg-panel">
      <div
        ref={viewportRef}
        className="max-h-[30rem] overflow-y-auto [--fade-size:1.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0, #000 min(var(--fade-size), var(--overflow-start, 0px)), #000 calc(100% - min(var(--fade-size), var(--overflow-end, 0px))), transparent 100%)",
        }}
      >
        {list}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-1 right-1 w-1.5">
        <div ref={thumbRef} className="w-full rounded-full bg-text/15 opacity-0 transition-opacity" />
      </div>
    </div>
  );
}

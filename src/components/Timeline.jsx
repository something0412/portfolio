import TimelineItem from "./TimelineItem";

export default function Timeline({ entries }) {
  return (
    <div className="rounded-2xl border border-panel-border bg-panel">
      <ul className="ml-9 border-l border-panel-border sm:ml-10">
        {entries.map((entry) => (
          <TimelineItem key={entry.name} entry={entry} />
        ))}
      </ul>
    </div>
  );
}

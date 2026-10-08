export default function Section({ id, title, children, className = "" }) {
  return (
    <section id={id} className={`flex flex-col gap-6 ${className}`}>
      {title && <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>}
      {children}
    </section>
  );
}

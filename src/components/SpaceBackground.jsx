import StarField from "./StarField";

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#110e24_0%,#070611_55%,#030209_100%)]">
      <StarField className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgba(3,2,9,0.55)_100%)]" />
    </div>
  );
}

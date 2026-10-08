import Galaxy from "./Galaxy";

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#110e24_0%,#070611_55%,#030209_100%)]">
      <Galaxy
        starSpeed={0}
        density={2}
        hueShift={140}
        speed={0}
        glowIntensity={0.3}
        saturation={0.3}
        mouseRepulsion
        repulsionStrength={0.5}
        twinkleIntensity={0.1}
        rotationSpeed={0.02}
        transparent
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgba(3,2,9,0.55)_100%)]" />
    </div>
  );
}

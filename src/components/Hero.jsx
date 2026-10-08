import { useEffect, useRef, useState } from "react";
import animatedAvatarVideo from "../assets/images/animatedGIF.mp4";
import downloadIcon from "../assets/icons/download.png";
import profilePic from "../assets/images/Profile_Pic_1.jpg";
import { profile, resumeUrl, socials } from "../data/content";

const AVATAR_PLAY_COUNT = 1;

export default function Hero() {
  const [showAnimated, setShowAnimated] = useState(false);
  const [animatedLoaded, setAnimatedLoaded] = useState(false);
  const videoRef = useRef(null);
  const playsRemainingRef = useRef(AVATAR_PLAY_COUNT);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!showAnimated) {
      video.pause();
      return undefined;
    }

    playsRemainingRef.current = AVATAR_PLAY_COUNT;
    video.currentTime = 0;
    video.play().catch(() => {});

    const handleEnded = () => {
      playsRemainingRef.current -= 1;
      if (playsRemainingRef.current > 0) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [showAnimated]);

  return (
    <section id="top" className="flex flex-col gap-6 pt-10">
      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-panel-border bg-panel px-3 py-1.5 text-xs text-text-dim">
        <span className="size-1.5 rounded-full bg-accent-2 shadow-[0_0_8px] shadow-accent-2" />
        {profile.status}
      </p>

      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="group relative inline-flex w-fit items-center">
            <h1
              tabIndex={0}
              className="cursor-default text-balance font-display text-4xl font-bold tracking-tight text-text outline-none sm:text-5xl"
            >
              {profile.preferredName}
            </h1>

            <div className="pointer-events-none absolute left-full top-1/2 z-10 ml-3 -translate-x-3 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100">
              <div className="whitespace-nowrap rounded-xl border border-panel-border bg-panel px-3 py-2 shadow-lg">
                <p className="font-display text-accent font-semibold">{profile.name}</p>
                <p className="text-xs text-text-faint">({profile.pronunciation})</p>
              </div>
            </div>
          </div>

          <p className="mt-2 max-w-sm text-balance text-sm text-text-dim sm:text-base">
            {profile.role}, based in {profile.location}.
          </p>
        </div>

        <div className="size-[6.864rem] shrink-0 [perspective:1000px] sm:size-[8.58rem]">
          <button
            type="button"
            onClick={() => {
              setAnimatedLoaded(true);
              setShowAnimated((prev) => !prev);
            }}
            onMouseEnter={() => setAnimatedLoaded(true)}
            aria-label="Toggle avatar"
            className={`relative size-full cursor-pointer rounded-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
              showAnimated ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <img
              src={profilePic}
              alt={profile.name}
              className="absolute inset-0 size-full rounded-full border border-panel-border object-cover [backface-visibility:hidden]"
            />
            {animatedLoaded && (
              <video
                ref={videoRef}
                src={animatedAvatarVideo}
                muted
                playsInline
                className="absolute inset-0 size-full rounded-full border border-panel-border object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href={resumeUrl}
          download
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
        >
          Resume
          <img src={downloadIcon} alt="" className="size-4" />
        </a>
        <div className="flex gap-2.5">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="flex size-9 items-center justify-center rounded-full border border-panel-border bg-panel transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              <img src={social.icon} alt="" className="size-4 opacity-85 invert brightness-150" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

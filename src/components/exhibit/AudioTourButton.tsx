"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/paths";
import styles from "./AudioTourButton.module.css";

/**
 * Small headphones button — the audio tour handset. Plays the pre-generated
 * narration MP3 for this exhibit; visual state doubles as a play/stop toggle.
 */
export default function AudioTourButton({
  slug,
  stopNumber,
  playing,
  onToggle,
}: {
  slug: string;
  stopNumber: number;
  playing: boolean;
  onToggle: (playing: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        setFailed(true);
        onToggle(false);
      });
    } else {
      audio.pause();
    }
  }, [playing, onToggle]);

  return (
    <>
      <button
        className={`${styles.handset} ${playing ? styles.playing : ""}`}
        onClick={() => onToggle(!playing)}
        aria-pressed={playing}
        aria-label={
          playing
            ? "Stop audio guide"
            : `Play audio guide, stop number ${stopNumber}`
        }
        title={failed ? "Audio unavailable — transcript below" : "Audio guide"}
      >
        <HeadphonesIcon />
        <span className={styles.stopNo}>{stopNumber}</span>
      </button>
      <audio
        ref={audioRef}
        src={asset(`/audio/${slug}.mp3`)}
        preload="none"
        onEnded={() => onToggle(false)}
        onError={() => setFailed(true)}
      />
    </>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 14v4a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H4a9 9 0 0 1 16 0h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2v-4a9 9 0 0 0-18 0Z" />
    </svg>
  );
}

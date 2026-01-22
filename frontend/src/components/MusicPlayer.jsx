import React, { useEffect, useRef } from "react";

export default function MusicPlayer({ enabled }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (enabled) ref.current.play().catch(()=>{});
    else ref.current.pause();
  }, [enabled]);

  return (
    <div className="badge">
      Music: <b>{enabled ? "On" : "Off"}</b>
      <audio ref={ref} loop src="/music/lofi.mp3" />
    </div>
  );
}

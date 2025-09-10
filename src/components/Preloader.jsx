import React, { useEffect, useState } from "react";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // start fade-out
      setTimeout(() => setLoading(false), 500); // remove after fade
    }, 2000); // show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/preloader.webp"
        alt="Preloader"
        className="w-32 h-32 preloader-rotate"
        style={{ imageRendering: "auto" }}
      />
      {/* Add CSS below */}
      <style>{`
        .preloader-rotate {
          animation: rotateSmooth 3s linear infinite;
        }

        @keyframes rotateSmooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;

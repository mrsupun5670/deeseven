import gsap from "gsap";
import React, { useEffect, useRef } from "react";

function MobileCarousel() {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    gsap.to(text1Ref.current, {
      x: "-=100%", // Moves left
      duration: 9,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(text2Ref.current, {
      x: "+=100%", // Moves right
      duration: 9,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <div className="w-full relative inset-0 text-center bg-gray-300 min-h-[200px] overflow-hidden">
      {/* Scrolling Text Layer 1 */}
      <div
        ref={text1Ref}
        className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-bold opacity-20 text-gray-500 -top-1/3 whitespace-nowrap"
      >
        {Array(6)
          .fill("DEEZEVEN")
          .map((text, index) => (
            <span key={`text1-${index}`} className="mr-4 font-beyonder">
              {text}
            </span>
          ))}
      </div>

      {/* Scrolling Text Layer 2 */}
      <div
        ref={text2Ref}
        className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-bold opacity-5 text-black top-24 whitespace-nowrap"
      >
        <span className="mr-4 font-beyonder">R</span>
        {Array(7)
          .fill("DEEZEVEN")
          .map((text, index) => (
            <span key={`text2-${index}`} className="mr-4 font-beyonder">
              {text}
            </span>
          ))}
      </div>
    </div>
  );
}

export default MobileCarousel;

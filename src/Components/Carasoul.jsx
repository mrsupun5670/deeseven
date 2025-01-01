import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Carasoul() {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    gsap.to(text1Ref.current, {
      x: "-=100%", // Moves left
      duration: 10,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(text2Ref.current, {
      x: "+=100%", // Moves right
      duration: 10,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <section className="relative mt-48 inset-0 h-[400px] md:h-[500] lg:h-[600px] text-center bg-gray-300 overflow-hidden -z-10">
      {/* Scrolling Text Layer 1 */}
      <div
        ref={text1Ref}
        className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[150px] lg:text-[200px] font-bold opacity-20 text-gray-500 -top-12 sm:-top-48 whitespace-nowrap"
      >
        {Array(8)
          .fill("DEESEVEN")
          .map((text, index) => (
            <span key={`text1-${index}`} className="mr-4 font-beyonder">
              {text}
            </span>
          ))}
      </div>

      {/* Scrolling Text Layer 2 */}
      <div
        ref={text2Ref}
        className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[150px] lg:text-[200px] font-bold opacity-5 text-black top-20 sm:top-60 whitespace-nowrap"
      >
        <span className="mr-4 font-beyonder">R</span>
        {Array(9)
          .fill("DEESEVEN")
          .map((text, index) => (
            <span key={`text2-${index}`} className="mr-4 font-beyonder">
              {text}
            </span>
          ))}
      </div>
    </section>
  );
}

export default Carasoul;

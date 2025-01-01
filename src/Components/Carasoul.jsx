import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Carasoul() {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    
    gsap.to(text1Ref.current, {
      x: "-=100%", 
      duration: 10,
      repeat: -1,
      ease: "linear",
    });

    
    gsap.to(text2Ref.current, {
      x: "+=100%",
      duration: 10,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <section className="xl:h-[800] lg:h-[600px] md:h-[400px] relative text-center bg-gray-300 sm:mt-24 mb-20 overflow-hidden">
      <div
        ref={text1Ref}
        className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[150px] font-bold opacity-20 text-gray-500 -top-12 sm:-top-48 whitespace-nowrap"
      >
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
      </div>

      <div
        ref={text2Ref}
        className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[150px] font-bold opacity-5 text-black top-20 sm:top-60 whitespace-nowrap"
      >
        <span className="mr-4 font-beyonder">R</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
        <span className="mr-4 font-beyonder">DEESEVEN</span>
      </div>
    </section>
  );
}

export default Carasoul;

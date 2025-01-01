import React from "react";
import manImage from "../assets/MAN.png";
import circuls from "../assets/CIRCULS.png";

function Hero() {
  return (
    <div className="absolute hidden md:block inset-0 overflow-hidden" style={styles.carasoul}>
      <img
        src={manImage}
        alt="Top Layer"
        className="absolute top-0 left-0 object-contain"
      />
    </div>
  );
} 

const styles = {
  carasoul: {
    backgroundImage: `url(${circuls})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "top",
  },
};

export default Hero;

import React from "react";
import manImage from "../assets/MAN.png";
import circuls from "../assets/CIRCULS.png";
import Carasoul from "./Carasoul";

function Hero() {
  return (
    <div className="relative hidden md:block overflow-hidden w-100 h-[500px] md:h-[600px] lg:h-[800px] -mt-48" style={styles.carasoul}>
      <img
        src={manImage}
        alt="Top Layer"
        style={styles.man}
      />
      <Carasoul />
    </div>

  );
} 

const styles = {
  carasoul: {
    backgroundImage: `url(${circuls})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  man: {
    position: "absolute",
    height: "100%",
    width: "100%",
    objectFit: "contain"
  }
};

export default Hero;

import { useState } from "react";

export default function ProductImage({ mainImage, product }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="magnifier-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
    >
      <img
        src={mainImage}
        alt={product.title}
        className="main-image"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
      <div
        className="magnifier"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  );
}
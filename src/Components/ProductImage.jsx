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
      {product.product_status === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <span className="text-white text-sm md:text-lg font-bold bg-red-600 px-2 py-1 md:px-4 md:py-2 rounded-full">
            Out of Stock
          </span>
        </div>
      )}
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

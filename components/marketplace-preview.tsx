"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const products = [
  {
    name: "Everyday sneakers",
    category: "Footwear",
    className: "postcard-sneaker",
    image: "/images/sneaker.webp",
  },
  {
    name: "Sound, without limits",
    category: "Electronics",
    className: "postcard-headphones",
    image: "/images/headphones.webp",
  },
  {
    name: "Ready for your next idea",
    category: "Computers",
    className: "postcard-laptop",
    crop: "product-laptop",
  },
  {
    name: "Your next favourite fit",
    category: "Fashion",
    className: "postcard-dress",
    crop: "product-dress",
  },
];

export default function MarketplacePreview() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const depth = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <div
      ref={sceneRef}
      data-reveal="scene"
      className="marketplace-scene"
      role="img"
      aria-label="EkivaMart app preview with shopping categories and product listings, surrounded by sneakers, headphones, a laptop and a dress."
    >
      <div className="scene-orbit orbit-one" aria-hidden="true" />
      <div className="scene-orbit orbit-two" aria-hidden="true" />
      <motion.div
        className="scene-depth"
        style={{ y: reducedMotion ? 0 : depth }}
      >
        {products.map((product) => (
          <div
            className={`product-postcard ${product.className}`}
            key={product.category}
            aria-hidden="true"
          >
            {product.image ? (
              <div className="product-image">
                <Image src={product.image} alt="" width={220} height={180} />
              </div>
            ) : (
              <div className={`product-image product-crop ${product.crop}`}>
                <Image
                  src="/app_preview.png"
                  alt=""
                  width={933}
                  height={1903}
                />
              </div>
            )}
            <div className="postcard-caption">
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </div>
          </div>
        ))}
        <div className="preview-phone" aria-hidden="true">
          <Image
            src="/images/ekivamart-marketplace-hires.webp"
            alt=""
            width={878}
            height={1792}
            unoptimized
            priority
          />
        </div>
      </motion.div>
    </div>
  );
}

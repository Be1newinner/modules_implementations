"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import React, { useRef } from "react";

const layers = [
  //   {
  //     src: "/parallax/Sun_L_12.webp",
  //     z: -1,
  //     speed: -5,
  //     opacity: 1,
  //     contain: true,
  //   },
  {
    src: "/parallax/Sun_L_12.webp",
    z: 0,
    speed: -5,
    scale: 1.0,
    opacity: 1,
  },
  {
    src: "/parallax/Clouds_L_11.webp",
    z: 1,
    speed: -15,
    scale: 1.1,
    opacity: 1,
  },
  {
    src: "/parallax/Clouds_white_L_10.webp",
    z: 2,
    speed: -25,
    scale: 1.1,
    opacity: 1,
  },
  {
    src: "/parallax/Mountains_L_9.webp",
    z: 3,
    speed: -35,
    scale: 1.15,
    opacity: 1,
  },
  {
    src: "/parallax/Mountains_L_8.webp",
    z: 4,
    speed: -45,
    scale: 1.2,
    opacity: 1,
  },
  {
    src: "/parallax/Mountains_L_7.webp",
    z: 5,
    speed: -55,
    scale: 1.25,
    opacity: 1,
  },
  {
    src: "/parallax/Trees_L_6.webp",
    z: 6,
    speed: -65,
    scale: 1.3,
    opacity: 1,
  },
  {
    src: "/parallax/Mountains_L_5.webp",
    z: 7,
    speed: -75,
    scale: 1.35,
    opacity: 1,
  },
  {
    src: "/parallax/Trees_L_4.webp",
    z: 8,
    speed: -85,
    scale: 1.4,
    opacity: 1,
  },
  {
    src: "/parallax/Mountain_L3.webp",
    z: 9,
    speed: -95,
    scale: 1.45,
    opacity: 1,
  },
  {
    src: "/parallax/Trees_L_2.webp",
    z: 10,
    speed: -105,
    scale: 1.5,
    opacity: 1,
  },
  {
    src: "/parallax/MOuntains_L_1.webp",
    z: 11,
    speed: -115,
    scale: 1.55,
    opacity: 1,
  },
  {
    src: "/parallax/BIRDS-L-0.webp",
    z: 12,
    speed: -125,
    scale: 1.6,
    opacity: 1,
  },
];

export default function Parallax() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div className="bg-gradient-to-b from-[#c1dfed] via-[#1f2833] to-[#0b0c10]">
      <div ref={ref} className="relative h-[800vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {layers.map((layer, index) => {
            const y = useTransform(
              scrollYProgress,
              [0, 1],
              ["0px", `${layer.speed * 2}px`]
            );
            const scale = useTransform(
              scrollYProgress,
              [0, 1],
              [1, layer.scale ?? 1]
            );
            const opacity = useTransform(
              scrollYProgress,
              [0, 1],
              [1, layer.opacity ?? 1]
            );

            return (
              <motion.div
                key={index}
                style={{
                  y,
                  scale,
                  opacity,
                }}
                className={`absolute top-0 left-0 w-full h-full z-[${layer.z}] transition-transform duration-700 ease-out`}
              >
                <Image
                  src={layer.src}
                  alt={`layer-${index}`}
                  fill
                  className={`object-cover transition-all duration-700 ease-out`}
                  priority={index === layers.length - 1}
                  sizes="100vw"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDragControls } from "motion/react";
import { motion } from "motion/react";

export default function Drag() {
  const controls = useDragControls();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [SunPos, setSunPos] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log({ windowSize:  SunPos - windowSize.width / 2 });
  }, [windowSize, SunPos]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center h-svh bg-sky-100 w-full overflow-hidden flex-col"
    >
      <p className="text-black">Drag: {SunPos}</p>
      <motion.div
        drag="x"
        // dragControls={controls}
        // dragListener={false}
        // onDragStart={(e, info) => {
        //   controls.start(e as PointerEvent, { snapToCursor: true });
        // }}
        // onDrag={(e) => {
        //   if ("clientX" in e) {
        //     setSunPos(Math.floor(e.clientX || 0));
        //   }
        // }}
        // onPointerDown={(e) => controls.start(e, { snapToCursor: true })}
        // dragDirectionLock={true}
        className="bg-yellow-500 w-32 h-32 rounded-full flex items-center justify-center absolute top-0 left-1/2 -translate-x-1/2"
      ></motion.div>

      <div className="bg-blue-500 h-80 w-80"></div>
    </div>
  );
}

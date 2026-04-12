"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** 
 * SNOWFALL EFFECT 
 * High-performance Canvas-based snowfall.
 */
export const Snowfall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const snowflakes: any[] = [];
    const count = 280; // More dense

    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1.5, // slightly larger
        d: Math.random() * count,
        v: Math.random() * 1.2 + 0.4, // slightly faster
        s: Math.random() * 2 - 1,
      });
    }

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Add a very subtle glow to each flake
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(79, 168, 216, 0.5)'; 
      ctx.fillStyle = 'rgba(224, 242, 254, 0.95)'; // Arctic blue tint for visibility
      
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = snowflakes[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      // Reset shadow for performance
      ctx.shadowBlur = 0;
      
      update();
    };

    const update = () => {
      angle += 0.01;
      for (let i = 0; i < count; i++) {
        const p = snowflakes[i];
        p.y += p.v;
        p.x += Math.sin(angle) * p.s;

        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) {
            snowflakes[i] = { ...p, x: Math.random() * width, y: -10 };
          } else {
            if (Math.sin(angle) > 0) {
              snowflakes[i] = { ...p, x: -5, y: Math.random() * height };
            } else {
              snowflakes[i] = { ...p, x: width + 5, y: Math.random() * height };
            }
          }
        }
      }
    };

    let animationId: number;
    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

/**
 * CURSOR TRAIL EFFECT
 * Follows the mouse with a soft elegant trail.
 */
export const CursorEffect = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-48 h-48 rounded-full pointer-events-none z-10"
      style={{
        background: 'radial-gradient(circle, rgba(201, 109, 66, 0.05) 0%, transparent 70%)',
        left: mousePos.x,
        top: mousePos.y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: 0,
        y: 0,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 150 }}
    />
  );
};

/**
 * CLICK BURST EFFECT
 * Spawns a small visual burst where the user clicks.
 */
export const ClickEffect = () => {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 1000);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute w-8 h-8 rounded-full border-2 border-accent/30"
            style={{
              left: click.x - 16,
              top: click.y - 16,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

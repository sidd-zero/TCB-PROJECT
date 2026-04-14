'use client';

import { motion } from 'framer-motion';

export default function CSLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: -2 }}
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f76f8e] to-[#96616b] shadow-lg shadow-[#37505c]/20 ${className}`}
    >
      <span className="text-[#ffead0] font-black tracking-tighter text-xs" style={{ fontSize: '14px' }}>
        CS
      </span>
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}

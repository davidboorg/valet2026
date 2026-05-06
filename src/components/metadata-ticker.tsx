'use client';

import { motion } from 'framer-motion';

interface MetadataTickerProps {
  items: Array<{
    value: string | number;
    label: string;
  }>;
  className?: string;
}

export function MetadataTicker({ items, className = '' }: MetadataTickerProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-x-12 gap-y-6 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <span className="block text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
            {item.value}
          </span>
          <span className="block mt-2 text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)]">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

interface MetadataStripProps {
  items: string[];
  className?: string;
}

export function MetadataStrip({ items, className = '' }: MetadataStripProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 ${className}`}>
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          <span className="text-xs tracking-[0.15em] uppercase text-[var(--text-secondary)]">
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="text-[var(--border)] text-xs">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
}

// Icons as components
const Icons = {
  collection: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  timeline: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  words: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  tone: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  parties: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  exhibitions: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  about: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const NAV_ITEMS: NavItem[] = [
  { href: '/affischer', label: 'Samlingen', icon: Icons.collection },
  { href: '/tidslinje', label: 'Tidslinje', icon: Icons.timeline },
  { href: '/ord', label: 'Ord-explorer', icon: Icons.words, isHighlighted: true },
  { href: '/tonlage', label: 'Tonlägen', icon: Icons.tone, isHighlighted: true },
  { href: '/partier', label: 'Partier', icon: Icons.parties },
  { href: '/utstallningar', label: 'Utställningar', icon: Icons.exhibitions },
  { href: '/om', label: 'Om', icon: Icons.about },
];

// Quick access items for bottom bar
const QUICK_ACCESS = [
  { href: '/affischer', label: 'Samling', icon: Icons.collection },
  { href: '/tidslinje', label: 'Tidslinje', icon: Icons.timeline },
  { href: '/partier', label: 'Partier', icon: Icons.parties },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className = '' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dragControls = useDragControls();

  // Close menu on route change.
  // Vi använder en ref för att undvika setState-i-effect cascading-renders:
  // bara stäng om menyn faktiskt var öppen.
  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      // Schemalägg stängning utanför effect-bodyn
      queueMicrotask(() => setIsOpen(false));
    }
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle swipe to close
  const handleDragEnd = useCallback((_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className={`sm:hidden ${className}`}>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Öppna meny"
        aria-expanded={isOpen}
      >
        <motion.svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          whileTap={{ scale: 0.95 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </motion.svg>
      </button>

      {/* Overlay and drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="x"
              dragControls={dragControls}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-[var(--bg-primary)] border-l border-[var(--border)] flex flex-col"
              aria-label="Mobilnavigering"
            >
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--border)]">
                <span className="font-[var(--font-playfair)] text-lg font-bold text-[var(--text-primary)]">
                  Meny
                </span>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
                  aria-label="Stäng meny"
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Navigation links */}
              <ul className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-opacity ${
                          isActive
                            ? 'border-l-2 border-[var(--border-strong)] text-[var(--text-primary)] font-medium bg-[var(--bg-secondary)]'
                            : item.isHighlighted
                              ? 'text-[var(--text-primary)] font-medium hover:opacity-70'
                              : 'text-[var(--text-primary)] hover:opacity-70'
                        }`}
                      >
                        <span className={isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>
                          {item.icon}
                        </span>
                        {item.label}
                        {item.isHighlighted && !isActive && (
                          <span className="ml-auto text-xs border border-[var(--border-strong)] text-[var(--text-primary)] px-2 py-0.5">
                            Ny
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Quick stats */}
              <motion.div
                className="px-6 py-4 bg-[var(--bg-secondary)] border-t border-[var(--border)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">127</p>
                    <p className="text-xs text-[var(--text-secondary)]">Affischer</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">8</p>
                    <p className="text-xs text-[var(--text-secondary)]">Partier</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">130</p>
                    <p className="text-xs text-[var(--text-secondary)]">År</p>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--border)]">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 text-sm text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Startsidan
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile bottom navigation bar for quick access
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on home page
  if (pathname === '/') return null;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-t border-[var(--border)] pb-safe">
      <div className="flex justify-around items-center h-16">
        {QUICK_ACCESS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-opacity ${
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:opacity-70'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/utstallningar"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-opacity ${
            pathname.startsWith('/utstallningar')
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:opacity-70'
          }`}
        >
          {Icons.exhibitions}
          <span className="text-xs">Mer</span>
        </Link>
      </div>
    </nav>
  );
}

/**
 * Hook for detecting swipe gestures
 */
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement | null>,
  handlers: SwipeHandlers,
  threshold = 50
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Check if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < -threshold && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > threshold && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < -threshold && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handlers, threshold]);
}

/**
 * Swipeable container component
 */
interface SwipeableContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeableContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
}: SwipeableContainerProps) {
  const handleDragEnd = useCallback((_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > 100 && onSwipeRight) {
      onSwipeRight();
    } else if (info.offset.x < -100 && onSwipeLeft) {
      onSwipeLeft();
    }
  }, [onSwipeLeft, onSwipeRight]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={className}
    >
      {children}
    </motion.div>
  );
}

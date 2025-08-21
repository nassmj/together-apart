
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface DropdownMenuProps {
  trigger?: ReactNode;
  children: ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !triggerRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-black transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger || <EllipsisVerticalIcon className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div
                ref={menuRef}
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2f2828] ring-1 ring-white/10 focus:outline-none z-30"
                role="menu"
                aria-orientation="vertical"
            >
                <div className="py-1" role="none" onClick={() => setIsOpen(false)}>
                {children}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownMenuItem: React.FC<{ onClick?: (e: React.MouseEvent) => void, children: ReactNode, className?: string }> = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-sm ${className}`}
            role="menuitem"
        >
            {children}
        </button>
    );
};

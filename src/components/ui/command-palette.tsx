'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Command } from '@/components/icons';

interface Command {
  id: string;
  name: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function CommandPalette({ commands, isOpen: controlledIsOpen, onClose }: CommandPaletteProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(value);
    } else if (!value && onClose) {
      onClose();
    }
  };

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleCommandSelect = (command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const command = filteredCommands[selectedIndex];
      if (command) {
        handleCommandSelect(command);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div 
              className="overflow-hidden rounded-2xl glass neon-border spotlight"
              onMouseMove={handleMouseMove}
              style={{
                '--mouse-x': `${mousePosition.x}%`,
                '--mouse-y': `${mousePosition.y}%`,
              } as React.CSSProperties}
            >
              <div className="flex items-center border-b border-white/10 px-4">
                <Search className="h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none"
                  autoFocus
                />
                <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-zinc-400">
                  ESC
                </kbd>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500">
                    No commands found
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <button
                      key={command.id}
                      onClick={() => handleCommandSelect(command)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-150',
                        index === selectedIndex
                          ? 'bg-neon-purple/20 text-white'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {command.icon && (
                          <span className="text-zinc-500">{command.icon}</span>
                        )}
                        <span>{command.name}</span>
                      </div>
                      {command.shortcut && (
                        <kbd className="rounded bg-white/10 px-2 py-0.5 text-xs text-zinc-500">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-white/10 px-4 py-2 text-xs text-zinc-500 flex items-center justify-between">
                <div>
                  <span className="mr-4">↑↓ to navigate</span>
                  <span className="mr-4">↵ to select</span>
                  <span>esc to close</span>
                </div>
                <div className="flex items-center gap-1">
                  <Command className="h-3 w-3" />
                  <span>Night Shift Command</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function CommandPaletteTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      <kbd className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs">⌘K</kbd>
    </button>
  );
}

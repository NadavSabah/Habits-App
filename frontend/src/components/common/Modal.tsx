/**
 * Modal Component
 *
 * Uses Headless UI Dialog. Backdrop click and Escape close the modal.
 * Styling matches Design/README.md (white card, rounded, shadow).
 */

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { ModalProps } from '../../types';

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop – click to close */}
      <div
        className="fixed inset-0 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className="relative w-full max-w-lg rounded-card bg-white p-6 shadow-xl focus:outline-none"
          onClick={(event) => event.stopPropagation()}
        >
          {title && (
            <DialogTitle className="mb-4 text-xl font-semibold text-[var(--color-text-heading)]">
              {title}
            </DialogTitle>
          )}
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

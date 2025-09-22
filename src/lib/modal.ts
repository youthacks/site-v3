import { tick } from "svelte";
import type { Attachment } from "svelte/attachments";

export const focusTrap: Attachment<HTMLElement> = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab - if on first element, go to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab - if on last element, go to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);

  // Focus the modal when it opens
  tick().then(() => {
    element.focus();
  });

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
};

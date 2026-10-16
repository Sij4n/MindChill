import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Dialog({ open, onClose, label, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const node = ref.current;
    const focusable = () => [...node.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')];
    (focusable()[0] || node).focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    node.addEventListener('keydown', handleKey);
    return () => { node.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [open, onClose]);
  return createPortal(<div className="popup-overlay" hidden={!open} onClick={onClose}>
    <div ref={ref} className={`popup-container ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onClick={event => event.stopPropagation()}>
      <button className="popup-close" aria-label={`Close ${label}`} onClick={onClose}>×</button>
      {children}
    </div>
  </div>, document.body);
}

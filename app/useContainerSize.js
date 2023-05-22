import { useEffect, useState } from "react";

export function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) {
        return;
      }

      if (!entries.length) {
        return;
      }

      const entry = entries[0];

      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return size;
}

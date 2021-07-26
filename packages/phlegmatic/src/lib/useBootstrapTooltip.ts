import {
  Ref, useEffect, useRef, useState,
} from 'react';
import * as bootstrap from 'bootstrap';

export default function useBootstrapTooltip<E extends HTMLElement>(
  options?: Partial<bootstrap.Tooltip.Options>,
): [Ref<E | null>, (text: string | number) => void] {
  const elementRef = useRef<E | null>(null);
  const tooltipRef = useRef<bootstrap.Tooltip & { tip: HTMLElement }>();
  const [text, setText] = useState<string | number>('Moment...');

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      if (!tooltipRef.current) {
        tooltipRef.current = new bootstrap.Tooltip(
          element, {
            title: String(text),
            html: true,
            offset: options?.offset ?? [0, 0],
            trigger: options?.trigger,
          },
        ) as bootstrap.Tooltip & { tip: HTMLElement };
      }

      const handler = () => {
        const tipInner = tooltipRef.current?.tip?.querySelector('.tooltip-inner');
        if (tipInner) {
          tipInner.innerHTML = String(text);
        }
      };

      element.addEventListener('show.bs.tooltip', handler);
      element.addEventListener('inserted.bs.tooltip', handler);

      handler();

      return () => {
        element.removeEventListener('show.bs.tooltip', handler);
        element.removeEventListener('inserted.bs.tooltip', handler);
      };
    }

    return undefined;
  }, [options?.offset, options?.trigger, text]);

  return [elementRef, setText];
}

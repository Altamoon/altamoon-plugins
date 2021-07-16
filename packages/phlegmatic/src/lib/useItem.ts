import { useCallback } from 'react';
import useChange from 'use-change';

type SliceRecord<SLICE> = SLICE & Partial<Record<keyof SLICE, unknown>>;

type Key<SLICE, KEY> = keyof SLICE & string & KEY;

export type ReturnTuple<SLICE, KEY extends keyof SLICE>
  = [SLICE[KEY], (value: SLICE[Key<SLICE, KEY>]) => void];

export default function useItem<SLICE, KEY>(
  item: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
  onChangeItem?: (item: SliceRecord<SLICE>, key: string) => void,
): ReturnTuple<SLICE, typeof key> {
  const [, set] = useChange(item, key);
  const update = useCallback((value: SLICE[Key<SLICE, KEY>]) => {
    set(value);
    onChangeItem?.(item, key);
  }, [item, key, onChangeItem, set]);

  return [item[key], update];
}

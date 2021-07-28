import * as t from 'biduul-types';

export interface RootStore extends t.RootStore {
  phlegmatic: PhlegmaticStoreGlobal;
}

export interface PhlegmaticPosition {
  isDefault: boolean;
  symbol: string | null;

  isPullProfitEnabled: boolean;
  isTakeProfitEnabled: boolean;
  isReduceLossEnabled: boolean;
  isStopLossEnabled: boolean;

  pullProfitPercentValue: number | null;
  pullProfitPercentTrigger: number | null;
  pullProfitSecondsInterval: number | null;

  reduceLossPercentValue: number | null;
  reduceLossPercentTrigger: number | null;
  reduceLossSecondsInterval: number | null;

  takeProfitPercentTrigger: number | null;
  takeProfitSecondsShouldRemain: number | null;

  stopLossPercentTrigger: number | null;
  stopLossSecondsShouldRemain: number | null;
}

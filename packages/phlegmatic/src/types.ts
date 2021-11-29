import * as t from 'altamoon-types';

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
  isRecoverEnabled: boolean;
  isReduceLossTriggered: boolean;

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

  recoverPercentTrigger: number | null;
  recoverBalancePercentStop: number | null;
  recoverBalancePercentAdd: number | null;
}

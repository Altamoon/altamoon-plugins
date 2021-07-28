import { listenChange } from 'use-change';
import { difference, map } from 'lodash';
import * as t from 'biduul-types';
import { PhlegmaticPosition, RootStore } from './types';

function getPersistentStorageValue<O, T>(key: keyof O & string, defaultValue: T): T {
  const storageValue = localStorage.getItem(`phlegmatic_${key}`);
  return storageValue ? JSON.parse(storageValue) as T : defaultValue;
}

interface PhlegmaticPositionInfo {
  pullProfitTimeoutId: ReturnType<typeof setTimeout> | null;
  pullProfitCleanUp: () => void;

  reduceLossTimeoutId: ReturnType<typeof setTimeout> | null;
  reduceLossCleanUp: () => void;

  takeProfitLastUnsatisfiedTime: number;
  takeProfitTickTimeoutId: ReturnType<typeof setTimeout> | null
  takeProfitCleanUp: () => void;

  stopLossLastUnsatisfiedTime: number;
  stopLossTickTimeoutId: ReturnType<typeof setTimeout> | null
  stopLossCleanUp: () => void;
}

export default class PhlegmaticStore {
  public log = (symbol: string | null, ...msg: unknown[]): void => {
    if (!this.shouldLog) return;
    // eslint-disable-next-line no-console
    console.log(`%cPhlegmatic${symbol ? ` (${String(symbol)})` : ''} %c${msg.join(' ')}`, 'color: grey', 'color: black');
  };

  public phlegmaticMap = getPersistentStorageValue<PhlegmaticStore, Record<string, PhlegmaticPosition>>('phlegmaticMap', {});

  public isWidgetEnabled: boolean;

  public shouldLog = false;

  #store: Store;

  #defaults: PhlegmaticPosition = {
    isDefault: true,
    symbol: null,

    isPullProfitEnabled: getPersistentStorageValue<PhlegmaticPosition, boolean>('isPullProfitEnabled', false),
    isTakeProfitEnabled: getPersistentStorageValue<PhlegmaticPosition, boolean>('isTakeProfitEnabled', false),
    isReduceLossEnabled: getPersistentStorageValue<PhlegmaticPosition, boolean>('isReduceLossEnabled', false),
    isStopLossEnabled: getPersistentStorageValue<PhlegmaticPosition, boolean>('isStopLossEnabled', false),

    pullProfitPercentValue: getPersistentStorageValue<PhlegmaticPosition, number>('pullProfitPercentValue', 10),
    pullProfitPercentTrigger: getPersistentStorageValue<PhlegmaticPosition, number>('pullProfitPercentTrigger', 5),
    pullProfitSecondsInterval: getPersistentStorageValue<PhlegmaticPosition, number>('pullProfitSecondsInterval', 5),

    reduceLossPercentValue: getPersistentStorageValue<PhlegmaticPosition, number>('reduceLossPercentValue', 10),
    reduceLossPercentTrigger: getPersistentStorageValue<PhlegmaticPosition, number>('reduceLossPercentTrigger', 5),
    reduceLossSecondsInterval: getPersistentStorageValue<PhlegmaticPosition, number>('reduceLossSecondsInterval', 5),

    takeProfitPercentTrigger: getPersistentStorageValue<PhlegmaticPosition, number>('takeProfitPercentTrigger', 10),
    takeProfitSecondsShouldRemain: getPersistentStorageValue<PhlegmaticPosition, number>('takeProfitSecondsShouldRemain', 5),

    stopLossPercentTrigger: getPersistentStorageValue<PhlegmaticPosition, number>('stopLossPercentTrigger', 10),
    stopLossSecondsShouldRemain: getPersistentStorageValue<PhlegmaticPosition, number>('stopLossSecondsShouldRemain', 5),
  };

  public get defaults(): PhlegmaticPosition { return this.#defaults; }

  #phlegmaticInfo: Record<string, PhlegmaticPositionInfo> = {};

  #unlistenOpenPositions: () => void;

  constructor(store: RootStore, isWidgetInitiallyEnabled: boolean) {
    this.#store = store;
    this.isWidgetEnabled = isWidgetInitiallyEnabled;

    Object.getOwnPropertyNames(this.#defaults).forEach((key) => {
      listenChange(this.#defaults, key as keyof PhlegmaticStore['defaults'], (value: unknown) => {
        localStorage.setItem(`phlegmatic_${key}`, JSON.stringify(value));
      });
    });

    const keysToListen: (keyof PhlegmaticStore)[] = ['phlegmaticMap'];

    keysToListen.forEach((key) => {
      listenChange(this, key, (value: unknown) => {
        localStorage.setItem(`phlegmatic_${key}`, JSON.stringify(value));
      });
    });

    this.#unlistenOpenPositions = listenChange(store.trading, 'openPositions', this.#onOpenPositionsTick);
  }

  public destroy = (): void => {
    this.log(null, 'Destroy');
    const symbolsToCleanUp = Object.keys(this.phlegmaticMap);

    this.#unlistenOpenPositions();

    this.isWidgetEnabled = false;

    for (const symbol of symbolsToCleanUp) {
      this.#cleanUpOnePosition(symbol);
    }
  };

  #onOpenPositionsTick = (openPositions: t.TradingPosition[]): void => {
    const newMap: Record<string, PhlegmaticPosition> = {};
    let isMapChanged = false;

    for (const { symbol } of openPositions) {
      const existingPhlegmaticPosition = this.phlegmaticMap[symbol];

      if (existingPhlegmaticPosition) {
        // if it's restored from localStorage, it doesn't have its phlegmaticInfo
        newMap[symbol] = this.#enpowerPhlegmaticPosition(existingPhlegmaticPosition);
      } else {
        isMapChanged = true;

        newMap[symbol] = this.#enpowerPhlegmaticPosition({
          ...this.#defaults,
          isDefault: false,
          symbol,
        });
      }
    }

    if (this.#cleanUpPositions(map(openPositions, 'symbol')) || isMapChanged) {
      // trigger map change if some symbol is added or removed
      this.phlegmaticMap = newMap;
    }
  };

  #cleanUpPositions = (symbols: string[]): boolean => {
    const symbolsToCleanUp = difference(Object.keys(this.phlegmaticMap), symbols);

    for (const symbol of symbolsToCleanUp) {
      this.#cleanUpOnePosition(symbol);
    }

    return !!symbolsToCleanUp.length;
  };

  #cleanUpOnePosition = (symbol: string): void => {
    const info = this.#phlegmaticInfo[symbol];

    if (!info) return;

    info.pullProfitCleanUp();
    if (info.pullProfitTimeoutId !== null) {
      clearTimeout(info.pullProfitTimeoutId);
      info.pullProfitTimeoutId = null;
    }

    info.reduceLossCleanUp();
    if (info.reduceLossTimeoutId !== null) {
      clearTimeout(info.reduceLossTimeoutId);
      info.reduceLossTimeoutId = null;
    }

    info.takeProfitCleanUp();
    if (info.takeProfitTickTimeoutId !== null) {
      clearTimeout(info.takeProfitTickTimeoutId);
      info.takeProfitTickTimeoutId = null;
    }

    info.stopLossCleanUp();
    if (info.stopLossTickTimeoutId !== null) {
      clearTimeout(info.stopLossTickTimeoutId);
      info.stopLossTickTimeoutId = null;
    }

    delete this.#phlegmaticInfo[symbol];
  };

  #enpowerPhlegmaticPosition = (phlegmaticPosition: PhlegmaticPosition): PhlegmaticPosition => {
    const { symbol } = phlegmaticPosition;
    if (!symbol) throw new Error('Phlegmating position symbol is missing');

    if (this.#phlegmaticInfo[symbol]) return phlegmaticPosition;

    this.log(phlegmaticPosition.symbol, 'Enpower position');

    const info: PhlegmaticPositionInfo = {
      pullProfitTimeoutId: null,
      pullProfitCleanUp: listenChange(phlegmaticPosition, 'isPullProfitEnabled', (isEnabled) => {
        this.log(phlegmaticPosition.symbol, 'isPullProfitEnabled =', isEnabled);
        if (isEnabled) {
          void this.#pullProfitIteration(phlegmaticPosition);
        } else if (info.pullProfitTimeoutId !== null) {
          clearTimeout(info.pullProfitTimeoutId);
          info.pullProfitTimeoutId = null;
        }
      }),

      reduceLossTimeoutId: null,
      reduceLossCleanUp: listenChange(phlegmaticPosition, 'isReduceLossEnabled', (isEnabled) => {
        this.log(phlegmaticPosition.symbol, 'isReduceLossEnabled =', isEnabled);
        if (isEnabled) {
          void this.#reduceLossIteration(phlegmaticPosition);
        } else if (info.reduceLossTimeoutId !== null) {
          clearTimeout(info.reduceLossTimeoutId);
          info.reduceLossTimeoutId = null;
        }
      }),

      takeProfitLastUnsatisfiedTime: Date.now(),
      takeProfitTickTimeoutId: null,
      takeProfitCleanUp: listenChange(phlegmaticPosition, 'isTakeProfitEnabled', (isEnabled) => {
        if (isEnabled) {
          void this.#takeProfitIteration(phlegmaticPosition);
        } else if (info.takeProfitTickTimeoutId !== null) {
          clearTimeout(info.takeProfitTickTimeoutId);
          info.takeProfitTickTimeoutId = null;
        }
      }),

      stopLossLastUnsatisfiedTime: Date.now(),
      stopLossTickTimeoutId: null,
      stopLossCleanUp: listenChange(phlegmaticPosition, 'isStopLossEnabled', (isEnabled) => {
        if (isEnabled) {
          void this.#stopLossIteration(phlegmaticPosition);
        } else if (info.stopLossTickTimeoutId !== null) {
          clearTimeout(info.stopLossTickTimeoutId);
          info.stopLossTickTimeoutId = null;
        }
      }),
    };

    this.#phlegmaticInfo[symbol] = info;

    if (phlegmaticPosition.isPullProfitEnabled) void this.#pullProfitIteration(phlegmaticPosition);
    if (phlegmaticPosition.isTakeProfitEnabled) void this.#takeProfitIteration(phlegmaticPosition);
    if (phlegmaticPosition.isReduceLossEnabled) void this.#reduceLossIteration(phlegmaticPosition);
    if (phlegmaticPosition.isStopLossEnabled) void this.#stopLossIteration(phlegmaticPosition);

    return phlegmaticPosition;
  };

  #getPositionPnl = (
    symbol: string,
  ): number => this.#store.trading.openPositions
    .find((pos) => pos.symbol === symbol)?.pnlPositionPercent ?? 0;

  #pullProfitIteration = async (phlegmaticPosition: PhlegmaticPosition): Promise<void> => {
    if (!phlegmaticPosition) throw new Error('Phlegmating position is missing');
    const { symbol } = phlegmaticPosition;
    if (!symbol) throw new Error('Phlegmating position symbol is missing');
    const info = this.#phlegmaticInfo[symbol];
    if (!info) throw new Error('Phlegmating info is missing');

    const {
      pullProfitSecondsInterval, pullProfitPercentTrigger, pullProfitPercentValue,
    } = phlegmaticPosition;
    const now = Date.now();
    const { isWidgetEnabled } = this;

    if (
      isWidgetEnabled
      && pullProfitSecondsInterval !== null
      && pullProfitPercentTrigger !== null
      && pullProfitPercentValue !== null
    ) {
      const pnlPercent = this.#getPositionPnl(symbol);

      if (pnlPercent >= pullProfitPercentTrigger) {
        this.log(symbol, 'Pull profit trigger!');
        const position = this.#store.trading.openPositions.find((pos) => pos.symbol === symbol);

        if (!position) throw new Error(`Phlegmatic error: Unable to find position of symbol "${symbol}" to pull profit.`);

        const { initialAmt, positionAmt } = position;

        const { quantityPrecision } = this.#store.market.futuresExchangeSymbols[symbol];
        const pureQuantity = initialAmt * (pullProfitPercentValue / 100);

        const reduceQuantity = Math.min(positionAmt, Math.floor(
          pureQuantity * (10 ** quantityPrecision),
        ) / (10 ** quantityPrecision));

        await this.#store.trading.closePosition(symbol, reduceQuantity);
        if (reduceQuantity === positionAmt) {
          return; // do not continue and do not run timeout fhen position is killed
        }
      } else {
        this.log(symbol, 'Pull profit tick');
      }
    } else {
      this.log(symbol, 'Pull profit tick (invalid fields or widget disabled)');
    }

    const requestTimeDiff = Date.now() - now;

    // run timeout either once per pullProfitSecondsInterval seconds or 0.5 seconds
    // to be able to wait for valid field values
    const interval = pullProfitSecondsInterval
      ? (pullProfitSecondsInterval * 1000) - requestTimeDiff
      : 500;

    info.pullProfitTimeoutId = setTimeout(() => {
      void this.#pullProfitIteration(phlegmaticPosition);
    }, Math.max(interval - requestTimeDiff, 200));
  };

  #reduceLossIteration = async (phlegmaticPosition: PhlegmaticPosition): Promise<void> => {
    if (!phlegmaticPosition) throw new Error('Phlegmating position is missing');
    const { symbol } = phlegmaticPosition;
    if (!symbol) throw new Error('Phlegmating position symbol is missing');
    const info = this.#phlegmaticInfo[symbol];
    if (!info) throw new Error('Phlegmating info is missing');

    const {
      reduceLossSecondsInterval, reduceLossPercentTrigger, reduceLossPercentValue,
    } = phlegmaticPosition;
    const now = Date.now();
    const { isWidgetEnabled } = this;

    if (
      isWidgetEnabled
      && reduceLossSecondsInterval !== null
      && reduceLossPercentTrigger !== null
      && reduceLossPercentValue !== null
    ) {
      const pnlPercent = this.#getPositionPnl(symbol);

      if (pnlPercent <= -reduceLossPercentTrigger) {
        this.log(symbol, 'Reduce loss trigger!');
        const position = this.#store.trading.openPositions.find((pos) => pos.symbol === symbol);

        if (!position) throw new Error(`Phlegmatic error: Unable to find position of symbol "${symbol}" to reduce loss.`);

        const { initialAmt, positionAmt } = position;

        const { quantityPrecision } = this.#store.market.futuresExchangeSymbols[symbol];
        const pureQuantity = initialAmt * (reduceLossPercentValue / 100);

        const reduceQuantity = Math.min(positionAmt, Math.floor(
          pureQuantity * (10 ** quantityPrecision),
        ) / (10 ** quantityPrecision));

        await this.#store.trading.closePosition(symbol, reduceQuantity);
        if (reduceQuantity === positionAmt) {
          return; // do not continue and do not run timeout fhen position is killed
        }
      } else {
        this.log(symbol, 'Reduce loss tick');
      }
    } else {
      this.log(symbol, 'Reduce loss tick (invalid fields or widget disabled)');
    }

    const requestTimeDiff = Date.now() - now;

    // run timeout either once per reduceLossSecondsInterval seconds or 0.5 seconds
    // to be able to wait for valid field values
    const interval = reduceLossSecondsInterval
      ? (reduceLossSecondsInterval * 1000) - requestTimeDiff
      : 500;

    info.reduceLossTimeoutId = setTimeout(() => {
      void this.#reduceLossIteration(phlegmaticPosition);
    }, Math.max(interval - requestTimeDiff, 200));
  };

  #takeProfitIteration = async (phlegmaticPosition: PhlegmaticPosition): Promise<void> => {
    if (!phlegmaticPosition) throw new Error('Phlegmating position is missing');
    const { symbol } = phlegmaticPosition;
    if (!symbol) throw new Error('Phlegmating position symbol is missing');
    const info = this.#phlegmaticInfo[symbol];
    if (!info) throw new Error('Phlegmating info is missing');

    const { takeProfitSecondsShouldRemain, takeProfitPercentTrigger } = phlegmaticPosition;
    const pnlPercent = this.#getPositionPnl(symbol);
    const now = Date.now();
    const { isWidgetEnabled } = this;

    if (
      isWidgetEnabled
      && takeProfitSecondsShouldRemain !== null
      && takeProfitPercentTrigger !== null
    ) {
      if (pnlPercent >= takeProfitPercentTrigger) {
        this.log(symbol, 'Take profit is going to trigger soon...');

        if (now - info.takeProfitLastUnsatisfiedTime > takeProfitSecondsShouldRemain * 1000) {
          this.log(symbol, 'Take profit trigger!');
          await this.#store.trading.closePosition(symbol);
          return; // do not continue and do not run timeout fhen position is killed
        }
      } else {
        this.log(symbol, 'Take profit tick');

        info.takeProfitLastUnsatisfiedTime = now;
      }
    } else {
      this.log(symbol, 'Take profit tick (invalid fields or widget disabled)');

      info.takeProfitLastUnsatisfiedTime = now;
    }

    info.takeProfitTickTimeoutId = setTimeout(() => {
      void this.#takeProfitIteration(phlegmaticPosition);
    }, 500);
  };

  #stopLossIteration = async (phlegmaticPosition: PhlegmaticPosition): Promise<void> => {
    if (!phlegmaticPosition) throw new Error('Phlegmating position is missing');
    const { symbol } = phlegmaticPosition;
    if (!symbol) throw new Error('Phlegmating position symbol is missing');
    const info = this.#phlegmaticInfo[symbol];
    if (!info) throw new Error('Phlegmating info is missing');

    const { stopLossSecondsShouldRemain, stopLossPercentTrigger } = phlegmaticPosition;
    const pnlPercent = this.#getPositionPnl(symbol);
    const now = Date.now();
    const { isWidgetEnabled } = this;

    if (isWidgetEnabled
      && stopLossSecondsShouldRemain !== null
      && stopLossPercentTrigger !== null
    ) {
      if (pnlPercent <= -stopLossPercentTrigger) {
        this.log(symbol, 'Stop loss is going to trigger soon...');

        if (now - info.stopLossLastUnsatisfiedTime > stopLossSecondsShouldRemain * 1000) {
          this.log(symbol, 'Stop loss trigger!');
          await this.#store.trading.closePosition(symbol);
          return; // do not continue and do not run timeout fhen position is killed
        }
      } else {
        this.log(symbol, 'Stop loss tick');

        info.stopLossLastUnsatisfiedTime = now;
      }
    } else {
      this.log(symbol, 'Stop loss tick (invalid fields or widget disabled)');

      info.stopLossLastUnsatisfiedTime = now;
    }

    info.stopLossTickTimeoutId = setTimeout(() => {
      void this.#stopLossIteration(phlegmaticPosition);
    }, 500);
  };
}

// to use PhlegmaticStore at types and avoid circular dependencies
declare global { type PhlegmaticStoreGlobal = PhlegmaticStore; }

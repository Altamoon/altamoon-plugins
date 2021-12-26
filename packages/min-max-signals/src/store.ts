import * as api from 'altamoon-binance-api';
import * as t from 'altamoon-types';
import { keyBy } from 'lodash';
import { listenChange } from 'use-change';
import { MinMaxSignal } from './types';

// https://themushroomkingdom.net/media/smb/wav
const sound = new Audio('https://themushroomkingdom.net/sounds/wav/smb/smb_fireworks.wav');

const STORAGE_PREFIX = 'minMax_';

function persist<T>(key: keyof MinMaxStore, defaultValue: T): T {
  const storageValue = localStorage.getItem(STORAGE_PREFIX + key);
  return storageValue ? JSON.parse(storageValue) as T : defaultValue;
}

export const MIN_MAX = (store: t.RootStore & { minMax: MinMaxStore }): MinMaxStore => store.minMax;

export default class MinMaxStore {
  #tickers: Record<string, api.FuturesTicker> = {};

  #aggTradeUnsubscribe?: () => void;

  public exchangeInfo?: api.FuturesExchangeInfo;

  public minMax = persist<MinMaxSignal[]>('minMax', []);

  public minMaxTop = persist<number>('minMaxTop', 5);

  public minMaxSoundsOn = persist<boolean>('minMaxSoundsOn', false);

  constructor() {
    ['minMax', 'minMaxTop', 'minMaxSoundsOn'].forEach((key) => {
      listenChange(this, key as keyof MinMaxStore, (value: unknown) => {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      });
    });

    api.futuresTickerStream((tickers) => {
      Object.assign(this.#tickers, keyBy(tickers, 'symbol'));
    });

    void api.futuresExchangeInfo().then((exchangeInfo) => {
      this.exchangeInfo = exchangeInfo;
      this.#aggTradeSubscribe();
    });

    listenChange(this, 'minMaxTop', this.#aggTradeSubscribe);

    // clear older values
    setInterval(() => {
      this.minMax = this.minMax
        .filter(({ timeISO }) => new Date(timeISO).getTime() > Date.now() - 1000 * 60 * 60); // 1h
    }, 30_000);
  }

  #aggTradeSubscribe = () => {
    const { exchangeInfo } = this;
    if (!exchangeInfo) return;
    const { symbols } = exchangeInfo;

    const listenedSymbols = symbols.filter(({ contractType }) => contractType === 'PERPETUAL')
      .slice(0, this.minMaxTop).map(({ symbol }) => symbol);

    // eslint-disable-next-line no-console
    console.info('Min/Max is Listening ', listenedSymbols);
    this.#aggTradeUnsubscribe?.();
    this.#aggTradeUnsubscribe = api.futuresAggTradeStream(
      listenedSymbols,
      this.#check,
    );
  };

  #check = ({ price, symbol }: api.FuturesAggTradeStreamTicker) => {
    const ticker = this.#tickers[symbol];

    if (!ticker) return;

    const { high, low } = ticker;

    if (+high <= +price || +low >= +price) {
      let { minMax } = this;

      minMax = minMax.filter((mm) => mm.symbol !== symbol);
      minMax.unshift({
        type: +high <= +price ? 'MAX' : 'MIN',
        symbol,
        price: +high,
        timeISO: new Date().toISOString(),
      });

      if (this.minMaxSoundsOn && this.minMax.length !== minMax.length) {
        void sound.play();
      }

      this.minMax = minMax;
    }
  };
}

export interface MinMaxSignal {
  symbol: string;
  timeISO: string;
  price: number;
  type: 'MIN' | 'MAX';
}

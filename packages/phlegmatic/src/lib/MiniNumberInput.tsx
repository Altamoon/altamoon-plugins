import React, {
  ChangeEvent, ReactElement, RefObject, useCallback, useState,
} from 'react';
import styled from 'styled-components';
import { useSet, useValue } from 'use-change';
import * as t from 'altamoon-types';

import { format } from 'd3-format';
import useBootstrapTooltip from './useBootstrapTooltip';
import { CUSTOMIZATION, TRADING, ACCOUNT } from './storeSelectors';

const Input = styled.input`
    padding: 0.1rem 0.2rem !important;
    text-align: center;
    background-image: none !important;

    &:disabled {
        background-color: transparent !important;
    }
`;

interface Props {
  value: number | null;
  isEnabled: boolean;
  isPnlPercent?: boolean;
  isDefault: boolean;
  isNegative?: boolean;
  position?: t.TradingPosition;
  onChange: (value: number | null) => void;
}

const PRICE_LINE_ID = 'phlegmatic_price_line';

const parseNumber = (str: string) => (str && !Number.isNaN(+str) ? +str : null);

const calcPrice = (
  isNegative: boolean | undefined,
  valueStr: string,
  position?: t.TradingPosition,
) => {
  const percent = parseNumber(valueStr);
  if (!position || percent === null) return 0;
  const { entryPrice, leverage } = position;
  return entryPrice + ((entryPrice * ((percent / 100) / leverage)) * (isNegative ? -1 : 1) * (position.side === 'SELL' ? -1 : 1));
};

const MiniNumberInput = ({
  position: givenPosition, value, isPnlPercent, isDefault, isEnabled, isNegative, onChange,
}: Props): ReactElement => {
  const [valueStr, setValueStr] = useState(value?.toString() ?? '');
  const setCustomLines = useSet(CUSTOMIZATION, 'customPriceLines');
  const currentSymbolPseudoPosition = useValue(TRADING, 'currentSymbolPseudoPosition');
  const totalWalletBalance = useValue(ACCOUNT, 'totalWalletBalance');
  const [tooltipRef, setTooltip] = useBootstrapTooltip({ trigger: 'focus' });
  const position = isDefault ? currentSymbolPseudoPosition : givenPosition;

  const updateTooltip = useCallback((yValue: number, percent: number | null) => {
    if (!isPnlPercent || !position) return;

    if (percent === null) {
      setTooltip('Incorrect value');
    } else {
      const profit = (isNegative ? -1 : 1) * (position.side === 'SELL' ? -1 : 1)
        * (position.baseValue / position.leverage)
        * (percent / 100);
      const profitBalancePercent = (profit / totalWalletBalance) * 100;
      setTooltip(`
        1 ${position.baseAsset} = ${format(`.${position.pricePrecision}f`)(yValue)} USDT 
        ${!isDefault ? `<nobr>
          <span${profit ? ` class="${profit > 0 ? 'text-success' : 'text-danger'}"` : ''}>
            ${(profit > 0 ? '+' : '') + profit.toFixed(2)} USDT
          </span>
        </nobr>
        <br>
        <nobr>
          <span${profitBalancePercent ? ` class="${profitBalancePercent > 0 ? 'text-success' : 'text-danger'}"` : ''}>
            ${(profitBalancePercent > 0 ? '+' : '') + profitBalancePercent.toFixed(2)}%
          </span> on wallet
        </nobr>` : ''}
      `.trim());
    }
  }, [isDefault, isNegative, isPnlPercent, position, setTooltip, totalWalletBalance]);

  const onFocus = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!isPnlPercent || !position) return;
    const percent = parseNumber(target.value);
    const yValue = calcPrice(isNegative, target.value, position);
    setCustomLines((customLines) => [
      ...customLines.filter(({ id }) => id !== PRICE_LINE_ID),
      {
        yValue,
        isVisible: parseNumber(target.value) !== null,
        title: 'Phlegmatic',
        id: PRICE_LINE_ID,
        color: 'purple',
      },
    ]);

    updateTooltip(yValue, percent);
  }, [isNegative, isPnlPercent, position, setCustomLines, updateTooltip]);

  const onBlur = useCallback(() => {
    if (!isPnlPercent || !position) return;
    setCustomLines((customLines) => customLines.filter(({ id }) => id !== PRICE_LINE_ID));
  }, [isPnlPercent, position, setCustomLines]);

  const onInputChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const percent = parseNumber(target.value);
    setValueStr(target.value);
    onChange(percent);

    if (!isPnlPercent || !position) return;
    const yValue = calcPrice(isNegative, target.value, position);
    setCustomLines((customLines) => customLines
      .map((customLine) => (customLine.id === PRICE_LINE_ID ? {
        ...customLine,
        yValue,
        isVisible: percent !== null,
      } : customLine)));

    updateTooltip(yValue, percent);
  }, [isNegative, isPnlPercent, onChange, position, setCustomLines, updateTooltip]);

  return (
    <Input
      className={`form-control d-inline${(valueStr && !Number.isNaN(+valueStr)) || !isEnabled ? '' : ' is-invalid'}`}
      value={valueStr}
      ref={!isPnlPercent ? undefined : tooltipRef as RefObject<HTMLInputElement>}
      style={{ width: `${Math.max(30, (valueStr.length + 1) * 10)}px` }}
      onChange={onInputChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default MiniNumberInput;

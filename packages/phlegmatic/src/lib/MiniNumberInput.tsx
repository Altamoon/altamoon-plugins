import React, {
  ChangeEvent, ReactElement, RefObject, useCallback, useState,
} from 'react';
import styled from 'styled-components';
import { useSet } from 'use-change';
import * as t from 'biduul-types';

import { format } from 'd3-format';
import useBootstrapTooltip from './useBootstrapTooltip';

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

const priceLineId = 'phlegmatic_price_line';

const parseNumber = (str: string) => (str && !Number.isNaN(+str) ? +str : null);

const calcPrice = (
  isNegative: boolean | undefined,
  valueStr: string,
  position?: t.TradingPosition,
) => {
  const percent = parseNumber(valueStr);
  if (!position || percent === null) return 0;
  const { entryPrice, leverage } = position;
  return entryPrice + ((entryPrice * ((percent / 100) / leverage)) * (isNegative ? -1 : 1));
};

const MiniNumberInput = ({
  position, value, isPnlPercent, isDefault, isEnabled, isNegative, onChange,
}: Props): ReactElement => {
  const [valueStr, setValueStr] = useState(value?.toString() ?? '');
  const setCustomLines = useSet(({ customization }: t.RootStore) => customization, 'customPriceLines');
  const [tooltipRef, setTooltip] = useBootstrapTooltip({ trigger: 'focus' });

  const updateTooltip = useCallback((yValue: number, percent: number | null) => {
    if (isDefault || !isPnlPercent || !position) return;

    if (percent === null) {
      setTooltip('Incorrect value');
    } else {
      const profit = (isNegative ? -1 : 1)
        * (position.baseValue / position.leverage)
        * (percent / 100);
      setTooltip(`
        1 ${position.baseAsset} = ${format(`.${position.pricePrecision}f`)(yValue)} USDT 
        <nobr><span${profit ? ` class="${profit > 0 ? 'text-success' : 'text-danger'}"` : ''}>${(profit > 0 ? '+' : '') + profit.toFixed(2)} USDT</span></nobr>
      `.trim());
    }
  }, [isDefault, isNegative, isPnlPercent, position, setTooltip]);

  const onFocus = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    if (isDefault || !isPnlPercent || !position) return;
    const percent = parseNumber(target.value);
    const yValue = calcPrice(isNegative, target.value, position);
    setCustomLines((customLines) => [
      ...customLines.filter(({ id }) => id !== priceLineId),
      {
        yValue,
        isVisible: parseNumber(target.value) !== null,
        title: 'Phlegmatic',
        id: priceLineId,
        color: 'purple',
      },
    ]);

    updateTooltip(yValue, percent);
  }, [isDefault, isNegative, isPnlPercent, position, setCustomLines, updateTooltip]);

  const onBlur = useCallback(() => {
    if (isDefault || !isPnlPercent || !position) return;
    setCustomLines((customLines) => customLines.filter(({ id }) => id !== priceLineId));
  }, [isDefault, isPnlPercent, position, setCustomLines]);

  const onInputChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const percent = parseNumber(target.value);
    setValueStr(target.value);
    onChange(percent);

    if (isDefault || !isPnlPercent || !position) return;
    const yValue = calcPrice(isNegative, target.value, position);
    setCustomLines((customLines) => customLines
      .map((customLine) => (customLine.id === priceLineId ? {
        ...customLine,
        yValue,
        isVisible: percent !== null,
      } : customLine)));

    updateTooltip(yValue, percent);
  }, [isDefault, isNegative, isPnlPercent, onChange, position, setCustomLines, updateTooltip]);

  return (
    <Input
      className={`form-control d-inline${(valueStr && !Number.isNaN(+valueStr)) || !isEnabled ? '' : ' is-invalid'}`}
      value={valueStr}
      ref={isDefault || !isPnlPercent || !position
        ? undefined
        : tooltipRef as RefObject<HTMLInputElement>}
      style={{ width: `${Math.max(30, (valueStr.length + 1) * 10)}px` }}
      onChange={onInputChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default MiniNumberInput;

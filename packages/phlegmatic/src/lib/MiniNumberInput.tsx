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
  return entryPrice + ((entryPrice * ((percent / 100) * leverage)) * (isNegative ? -1 : 1));
};

const MiniNumberInput = ({
  position, value, isPnlPercent, isDefault, isEnabled, isNegative, onChange,
}: Props): ReactElement => {
  const [valueStr, setValueStr] = useState(value?.toString() ?? '');
  const setCustomLines = useSet(({ customization }: t.RootStore) => customization, 'customPriceLines');
  const [tooltipRef, setTooltip] = useBootstrapTooltip({ trigger: 'focus' });

  const onFocus = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    if (isDefault || !isPnlPercent || !position) return;
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

    setTooltip(`${format(`.${position.pricePrecision}f`)(yValue)} USDT`);
  }, [isDefault, isNegative, isPnlPercent, position, setCustomLines, setTooltip]);

  const onBlur = useCallback(() => {
    if (isDefault || !isPnlPercent || !position) return;
    setCustomLines((customLines) => customLines.filter(({ id }) => id !== priceLineId));
  }, [isDefault, isPnlPercent, position, setCustomLines]);

  const onInputChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    setValueStr(target.value);
    onChange(parseNumber(target.value));

    if (isDefault || !isPnlPercent || !position) return;
    const yValue = calcPrice(isNegative, target.value, position);
    setCustomLines((customLines) => customLines
      .map((customLine) => (customLine.id === priceLineId ? {
        ...customLine,
        yValue,
        isVisible: parseNumber(target.value) !== null,
      } : customLine)));

    setTooltip(`${format(`.${position.pricePrecision}f`)(yValue)} USDT`);
  }, [isDefault, isNegative, isPnlPercent, onChange, position, setCustomLines, setTooltip]);

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

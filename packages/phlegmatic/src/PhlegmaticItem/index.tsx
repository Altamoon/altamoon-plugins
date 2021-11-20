import React, { memo, ReactElement } from 'react';
import { format } from 'd3-format';
import { Badge } from 'reactstrap';
import * as t from 'altamoon-types';
import { useSet } from 'use-change';

import useItem from '../lib/useItem';
import { PhlegmaticPosition } from '../types';
import PullProfit from './PullProfit';
import TakeProfit from './TakeProfit';
import StopLoss from './StopLoss';
import ReduceLoss from './ReduceLoss';
import { PERSISTENT } from '../lib/storeSelectors';
import Recover from './Recover';

const formatNumber = (n: number, ignorePrecision?: boolean) => format(n < 10 && !ignorePrecision ? ',.4f' : ',.2f')(n);
const formatPercent = format(',.1f');
const textClassName = (value: number) => {
  if (!value) return '';

  return value > 0 ? 'text-success' : 'text-danger';
};

interface Props {
  isDefault: boolean;
  position?: t.TradingPosition;
  item: PhlegmaticPosition;
  onItemChange?: (item: PhlegmaticPosition, key: string) => void;
}

const PhlegmaticItem = ({
  isDefault, item, position, onItemChange,
}: Props): ReactElement => {
  const [isPullProfitEnabled, setIsPullProfitEnabled] = useItem(item, 'isPullProfitEnabled', onItemChange);
  const [isTakeProfitEnabled, setIsTakeProfitEnabled] = useItem(item, 'isTakeProfitEnabled', onItemChange);
  const [isReduceLossEnabled, setIsReduceLossEnabled] = useItem(item, 'isReduceLossEnabled', onItemChange);
  const [isStopLossEnabled, setIsStopLossEnabled] = useItem(item, 'isStopLossEnabled', onItemChange);
  const [isRecoverEnabled, setIsRecoverEnabled] = useItem(item, 'isRecoverEnabled', onItemChange);
  const setSymbol = useSet(PERSISTENT, 'symbol');
  const pnl = position?.pnl ?? 0;
  const pnlPercent = position?.pnlPositionPercent ?? 0;

  return (
    <tbody>
      <tr>
        <td
          rowSpan={6}
          className={!isPullProfitEnabled && !isTakeProfitEnabled && !isReduceLossEnabled && !isStopLossEnabled ? 'text-muted' : ''}
        >
          {isDefault && <strong>Default</strong>}
          {!isDefault && !position && <em className="text-danger">Unknown position error</em>}
          {!isDefault && !!position && (
            <>
              <p>
                {position.initialAmt}
                {' '}
                <span
                  className="link-alike"
                  onClick={() => setSymbol(position.symbol)}
                  onKeyDown={() => setSymbol(position.symbol)}
                  role="button"
                  tabIndex={0}
                >
                  {position.baseAsset}
                </span>
                {' '}
                &nbsp;
                {!!position && (
                <Badge className={position.side === 'BUY' ? 'bg-success' : 'bg-danger'}>
                  {position.leverage}
                  x
                </Badge>
                )}
              </p>
              <p>
                <span className="text-muted">PNL:</span>
                {' '}
                <span className={textClassName(pnl)}>
                  {formatNumber(pnl, true)}
                  {' '}
                  ₮
                </span>
                {' '}
                <span className={textClassName(pnlPercent)}>
                  (
                  {formatPercent(pnlPercent)}
                  %)
                </span>
              </p>
              <p>
                <span className="text-muted">Fulfilled:</span>
                {' '}
                {(100 - (position.positionAmt / position.initialAmt) * 100).toFixed(0)}
                %
              </p>
            </>
          )}
        </td>
      </tr>
      <PullProfit
        isDefault={isDefault}
        isEnabled={isPullProfitEnabled}
        item={item}
        position={position}
        onChangeEnabled={setIsPullProfitEnabled}
        onItemChange={onItemChange}
      />
      <ReduceLoss
        isDefault={isDefault}
        isEnabled={isReduceLossEnabled}
        item={item}
        position={position}
        onChangeEnabled={setIsReduceLossEnabled}
        onItemChange={onItemChange}
      />
      <TakeProfit
        isDefault={isDefault}
        isEnabled={isTakeProfitEnabled}
        item={item}
        position={position}
        onChangeEnabled={setIsTakeProfitEnabled}
        onItemChange={onItemChange}
      />
      <StopLoss
        isDefault={isDefault}
        isEnabled={isStopLossEnabled}
        item={item}
        position={position}
        onChangeEnabled={setIsStopLossEnabled}
        onItemChange={onItemChange}
      />
      <Recover
        isDefault={isDefault}
        isEnabled={isRecoverEnabled}
        item={item}
        position={position}
        onChangeEnabled={setIsRecoverEnabled}
        onItemChange={onItemChange}
      />
    </tbody>
  );
};

export default memo(PhlegmaticItem);

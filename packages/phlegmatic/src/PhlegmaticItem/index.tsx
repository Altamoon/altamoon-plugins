import React, { memo, ReactElement } from 'react';
import { format } from 'd3-format';
import { Badge } from 'reactstrap';
import { TradingPosition } from 'biduul-types';
import { useValue } from 'use-change';

import useItem from '../lib/useItem';
import { PhlegmaticPosition } from '../types';
import PullProfit from './PullProfit';
import TakeProfit from './TakeProfit';
import StopLoss from './StopLoss';
import ReduceLoss from './ReduceLoss';
import { PHLEGMATIC } from '../lib/storeSelectors';

const formatNumber = (n: number, ignorePrecision?: boolean) => format(n < 10 && !ignorePrecision ? ',.4f' : ',.2f')(n);
const formatPercent = format(',.1f');
const textClassName = (value: number) => {
  if (!value) return '';

  return value > 0 ? 'text-success' : 'text-danger';
};

interface Props {
  isDefault: boolean;
  position?: TradingPosition
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
  const pnlType = useValue(PHLEGMATIC, 'pnlType');
  const pnl = position?.[pnlType] ?? 0;
  const pnlPercent = position?.[pnlType === 'truePnl' ? 'truePnlPercent' : 'pnlPercent'] ?? 0;

  return (
    <tbody>
      <tr>
        <td
          rowSpan={5}
          className={!isPullProfitEnabled && !isTakeProfitEnabled && !isReduceLossEnabled && !isStopLossEnabled ? 'text-muted' : ''}
        >
          {isDefault && <strong>Default</strong>}
          {!isDefault && !position && <em className="text-danger">Unknown position error</em>}
          {!isDefault && !!position && (
            <>
              <p>
                {position.initialAmt}
                {' '}
                {position.baseAsset}
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
        isEnabled={isPullProfitEnabled}
        item={item}
        onChangeEnabled={setIsPullProfitEnabled}
        onItemChange={onItemChange}
      />
      <TakeProfit
        isEnabled={isTakeProfitEnabled}
        item={item}
        onChangeEnabled={setIsTakeProfitEnabled}
        onItemChange={onItemChange}
      />
      <StopLoss
        isEnabled={isStopLossEnabled}
        item={item}
        onChangeEnabled={setIsStopLossEnabled}
        onItemChange={onItemChange}
      />
      <ReduceLoss
        isEnabled={isReduceLossEnabled}
        item={item}
        onChangeEnabled={setIsReduceLossEnabled}
        onItemChange={onItemChange}
      />
    </tbody>
  );
};

export default memo(PhlegmaticItem);

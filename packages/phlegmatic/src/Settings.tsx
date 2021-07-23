import React, { Dispatch, ReactElement } from 'react';
import isType from './lib/isType';
import { PnlPercentType } from './types';

interface Props {
  pnlType: PnlPercentType;
  setPnlType: Dispatch<PnlPercentType>;
}

const Settings = ({ pnlType, setPnlType }: Props): ReactElement => (
  <>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="phlegmatic_pnl_type" className="form-label">PNL percentage type</label>
    <select
      id="phlegmatic_pnl_type"
      className="form-control"
      value={pnlType}
      onChange={({ target }) => setPnlType(target.value as Props['pnlType'])}
    >
      <option value={isType<PnlPercentType>('pnlPositionPercent')}>ROI (Return on Investment)</option>
      <option value={isType<PnlPercentType>('pnlBalancePercent')}>ROW (Return on Wallet)</option>
    </select>
  </>
);

export default Settings;

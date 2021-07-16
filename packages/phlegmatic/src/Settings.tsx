import React, { Dispatch, ReactElement } from 'react';
import { PnlType } from './types';

interface Props {
  pnlType: PnlType;
  setPnlType: Dispatch<PnlType>;
}

const Settings = ({ pnlType, setPnlType }: Props): ReactElement => (
  <>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="phlegmatic_pnl_type" className="form-label">PNL type</label>
    <select
      id="phlegmatic_pnl_type"
      className="form-control"
      value={pnlType}
      onChange={({ target }) => setPnlType(target.value as Props['pnlType'])}
    >
      <option value="pnl">Position PNL</option>
      <option value="truePnl">True PNL</option>
    </select>
  </>
);

export default Settings;

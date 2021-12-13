import React, { ReactElement } from 'react';

import StyledToggle from './StyledToggle';

interface Props {
  id: string;
  checkedLabel: string;
  uncheckedLabel: string;
  className?: string;
  isChecked: boolean;
  onChange: (v: boolean) => void;
}

const Toggle = ({
  id, checkedLabel, uncheckedLabel, className, isChecked, onChange,
}: Props): ReactElement => (
  <StyledToggle className={className}>
    <input id={id} checked={isChecked} type="checkbox" onChange={({ target }) => onChange(target.checked)} />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={id}>
      <div className="switch" data-checked={checkedLabel} data-unchecked={uncheckedLabel} />
    </label>
  </StyledToggle>
);

export default Toggle;

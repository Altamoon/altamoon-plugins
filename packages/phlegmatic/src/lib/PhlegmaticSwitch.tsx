import React, { memo, ReactElement, ReactNode } from 'react';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import tooltipRef from './tooltipRef';

interface Props {
  id?: string;
  isChecked: boolean;
  label: ReactNode;
  isValid: boolean;
  onChange: (isChecked: boolean) => void;
}

const PhlegmaticSwitch = ({
  id, isValid, isChecked, label, onChange,
}: Props): ReactElement => (
  <>
    <label htmlFor={id ? `${id}_input` : undefined} className="form-check form-switch d-inline-block">
      <input
        id={id ? `${id}_input` : undefined}
        className="form-check-input cursor-pointer"
        type="checkbox"
        checked={isChecked}
        onChange={({ target }) => onChange(target.checked)}
      />
      {' '}
      {label}
    </label>
    <span className="ms-2" ref={tooltipRef({ title: 'The algorithm has errors' })} hidden={!isChecked || isValid}>
      <ExclamationCircleFill className="text-danger" />
    </span>
  </>
);

export default memo(PhlegmaticSwitch);

import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

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
  onChange: (value: number | null) => void;
}

const MiniNumberInput = ({ value, isEnabled, onChange }: Props): ReactElement => {
  const [valueStr, setValueStr] = useState(value?.toString() ?? '');

  return (
    <Input
      className={`form-control d-inline${(valueStr && !Number.isNaN(+valueStr)) || !isEnabled ? '' : ' is-invalid'}`}
      value={valueStr}
      style={{ width: `${Math.max(30, (valueStr.length + 1) * 10)}px` }}
      onChange={({ target }) => {
        setValueStr(target.value);
        onChange(target.value && !Number.isNaN(+target.value) ? +target.value : null);
      }}
    />
  );
};

export default MiniNumberInput;

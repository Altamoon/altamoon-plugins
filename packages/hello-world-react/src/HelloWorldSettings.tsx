import React, { Dispatch, ReactElement } from 'react';

interface Props {
  btnSize: '' | 'sm' | 'lg';
  setBtnSize: Dispatch<'' | 'sm' | 'lg'>;
}

const HelloWorldSettings = ({ btnSize, setBtnSize }: Props): ReactElement => (
  <>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="hello_world_react_btn_size" className="form-label">Button Size</label>
    <select
      className="form-control"
      value={btnSize}
      onChange={({ target }) => setBtnSize(target.value as Props['btnSize'])}
    >
      <option value="sm">Small</option>
      <option value="">Normal</option>
      <option value="lg">Large</option>
    </select>
  </>
);

export default HelloWorldSettings;

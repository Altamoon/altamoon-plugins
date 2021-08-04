import React, { Dispatch, ReactElement } from 'react';

interface Props {
  soundsOn: boolean;
  setSoundsOn: Dispatch<boolean>;
}

const Settings = ({ soundsOn, setSoundsOn }: Props): ReactElement => (
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      checked={soundsOn}
      onChange={({ target }) => setSoundsOn(target.checked)}
      id="phlegmaticSoundsOn"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className="form-check-label" htmlFor="phlegmaticSoundsOn">
      Sounds on
    </label>
  </div>
);

export default Settings;

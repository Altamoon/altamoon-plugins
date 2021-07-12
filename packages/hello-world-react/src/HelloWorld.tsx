import React, { ReactElement, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { hot } from 'react-hot-loader/root';

import HelloWorldSettings from './HelloWorldSettings';

interface Props {
  settingsElement: HTMLElement;
  createOrder: (side: 'BUY' | 'SELL', quantity: number) => void;
  listenSettingsSave: (handler: () => void) => (() => void)
  listenSettingsCancel: (handler: () => void) => (() => void)
}

const HelloWorld = ({
  settingsElement, createOrder, listenSettingsSave, listenSettingsCancel,
}: Props): ReactElement => {
  const [qty, setQty] = useState('0');
  const [btnSize, setBtnSize] = useState<'' | 'sm' | 'lg'>(localStorage.helloWorldReactButonSize ?? '');

  useEffect(() => listenSettingsSave(() => {
    // save
    localStorage.helloWorldReactButonSize = btnSize;
  }));

  useEffect(() => listenSettingsCancel(() => {
    // reset
    setBtnSize(localStorage.helloWorldReactButonSize);
  }));

  return (
    <>
      {createPortal((
        <HelloWorldSettings btnSize={btnSize} setBtnSize={setBtnSize} />
      ), settingsElement)}
      <div className="row">
        <div className="col-12 mb-1">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="hello_world_react_qty" className="form-label">Quantity</label>
          <input
            id="hello_world_react_qty"
            type="text"
            placeholder="Quantity"
            className="form-control"
            value={qty}
            onChange={({ target }) => setQty(target.value)}
          />
        </div>
        <div className="col-6 d-grid">
          <button
            type="button"
            className={`btn btn-success mt-3 btn-block${btnSize ? ` btn-${btnSize}` : ''}`}
            disabled={!+qty}
            onClick={() => {
              if (+qty) createOrder('BUY', +qty);
            }}
          >
            Buy
          </button>
        </div>
        <div className="col-6 d-grid">
          <button
            type="button"
            className={`btn btn-sell mt-3 btn-block${btnSize ? ` btn-${btnSize}` : ''}`}
            disabled={!+qty}
            onClick={() => {
              if (+qty) createOrder('SELL', +qty);
            }}
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
};

export default hot(HelloWorld);

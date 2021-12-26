/* eslint-disable jsx-a11y/label-has-associated-control */
import * as t from 'altamoon-types';
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Input } from 'reactstrap';
import { useValue } from 'use-change';

const WhaleCalculator = () => {
  const totalWalletBalance = useValue(({ account }: t.RootStore) => account, 'totalWalletBalance');
  const dailyPnlPercent = (useValue(({ stats }: t.RootStore) => stats, 'dailyPnlPercent') || 0) * 100;
  const [perDay, setPerDay] = useState((dailyPnlPercent || 0).toFixed(2));
  const [initial, setInitial] = useState((totalWalletBalance || 0).toFixed(2));
  const getResult = (days: number) => {
    let balance = +initial || 0;
    for (let i = 0; i <= days; i += 1) {
      balance *= ((+perDay || 0) / 100) + 1;
    }
    return balance;
  };

  useEffect(() => { setPerDay(dailyPnlPercent.toFixed(2)); }, [dailyPnlPercent]);
  useEffect(() => { setInitial(totalWalletBalance.toFixed(2)); }, [totalWalletBalance]);

  const calcPercent = (b: number) => {
    const percent = (b / (+initial || 0) - 1) * 100 || 0;
    return (percent > 0 ? '+' : '') + (+percent.toFixed(1)).toLocaleString();
  };
  const formatNumber = (n: number) => (+n.toFixed(2)).toLocaleString();

  const week = getResult(7);
  const month = getResult(30);
  const season = getResult(90);
  const halfYear = getResult(180);
  const year = getResult(365);

  return (
    <div>
      <label htmlFor="whalePercentPerDay" className="mb-1">% per day</label>
      <Input id="whalePercentPerDay" type="text" className="mb-3" value={perDay} onChange={({ target }) => setPerDay(target.value)} />
      <label htmlFor="whaleInitialBalance" className="mb-1">Initial balance $</label>
      <Input id="whaleInitialBalance" type="text" className="mb-3" value={initial} onChange={({ target }) => setInitial(target.value)} />

      <ul>
        <li>
          <label>7 days:</label>
          {' '}
          <span>{formatNumber(week)}</span>
          {' '}
          (
          <span>{calcPercent(week)}</span>
          %)
        </li>
        <li>
          <label>30 days:</label>
          {' '}
          <span>{formatNumber(month)}</span>
          {' '}
          (
          <span>{calcPercent(month)}</span>
          %)
        </li>
        <li>
          <label>90 days:</label>
          {' '}
          <span>{formatNumber(season)}</span>
          {' '}
          (
          <span>{calcPercent(season)}</span>
          %)
        </li>
        <li>
          <label>180 days:</label>
          {' '}
          <span>{formatNumber(halfYear)}</span>
          {' '}
          (
          <span>{calcPercent(halfYear)}</span>
          %)
        </li>
        <li>
          <label>365 days:</label>
          {' '}
          <span>{formatNumber(year)}</span>
          {' '}
          (
          <span>{calcPercent(year)}</span>
          %)
        </li>
      </ul>
    </div>
  );
};

export default hot(WhaleCalculator);

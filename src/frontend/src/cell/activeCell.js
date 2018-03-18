import React from 'react';

export default ({ row, isChosen, chooseRow }) => (
  <div
    className={`cell ${isChosen ? 'is-chosen' : ''} is-active`}
    onClick={() => chooseRow(row.id)}
  />
);

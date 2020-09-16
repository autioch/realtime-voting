import React from 'react';

export default ({ isChosen }) => (
  <div
    className={`cell ${isChosen ? 'is-chosen' : ''}`}
  />
);

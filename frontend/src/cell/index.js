import React from 'react';
import InactiveCell from './inactiveCell';
import ActiveCell from './activeCell';

import './styles.css';

export default ({ row, col, choices, currentId, chooseRow }) => {
  const isChosen = choices[col.id] && choices[col.id][row.id];

  if (col.id === currentId) {
    return <ActiveCell row={row} isChosen={isChosen} chooseRow={chooseRow}/>;
  }

  return <InactiveCell isChosen={isChosen} />;
};

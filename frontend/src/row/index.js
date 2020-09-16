import React from 'react';
import Cell from '../cell';

import './styles.css';

export default ({ row, cols, chooseRow, choices, currentId }) => (
  <div className="row">
    <div className="row__label">{row.label}</div>
    {cols.map((col) =>
      <Cell
        key={col.id}
        row={row}
        col={col}
        choices={choices}
        currentId={currentId}
        chooseRow={chooseRow}
      />
    )}
  </div>
);

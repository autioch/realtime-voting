import React from 'react';

export default ({ col, renameCol }) => (
  <div className="cell">
    <input className="col__input" value={col.label} onChange={(ev) => renameCol(ev.target.value)}/>
  </div>
);

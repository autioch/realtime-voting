import React from 'react';

export default ({ col, renameCol, exitCol }) => (
  <div className="cell">
    <input className="col__input" value={col.label} onChange={(ev) => renameCol(ev.target.value)}/>
    <span className="col__exit" onClick={exitCol}>X</span>
  </div>
);

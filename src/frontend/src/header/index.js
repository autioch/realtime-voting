import React from 'react';
import ActiveHeader from './activeHeader';
import InactiveHeader from './inactiveHeader';

export default ({ col, currentId, renameCol, exitCol }) => {
  if (col.id === currentId) {
    return <ActiveHeader col={col} renameCol={renameCol} exitCol={exitCol}/>;
  }

  return <InactiveHeader col={col} />;
};

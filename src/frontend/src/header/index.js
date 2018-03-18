import React from 'react';
import ActiveHeader from './activeHeader';
import InactiveHeader from './inactiveHeader';

export default ({ col, currentId, renameCol }) => {
  if (col.id === currentId) {
    return <ActiveHeader col={col} renameCol={renameCol}/>;
  }

  return <InactiveHeader col={col} />;
};

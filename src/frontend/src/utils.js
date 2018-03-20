const LOCAL_STORAGE_KEY = 'realtimeVoting.colCredentials';

export function recoverColCredentials() {
  const colCredentials = localStorage.getItem(LOCAL_STORAGE_KEY);

  return colCredentials ? JSON.parse(colCredentials) : null;
}

export function storeColCredentials({ id, label, token }) {
  const colCredentials = JSON.stringify({
    id,
    label,
    token
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, colCredentials);
}

export function removeColCredentials() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function objectToQueryString(obj = {}) {
  return Object
    .entries(obj)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');
}

export function renameCol(cols, colId, label) {
  return cols.map((col) => {
    if (col.id !== colId) {
      return col;
    }

    return {
      ...col,
      label
    };
  });
}

export function chooseRow(choices, colId, rowId) {
  return {
    ...choices,
    [colId]: rowId
  };
}

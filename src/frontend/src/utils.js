export function recoverColCredentials() {
  const colCredentials = localStorage.getItem('realtimeVoting.colCredentials');

  return colCredentials ? JSON.parse(colCredentials) : undefined; // eslint-disable-line no-undefined
}

export function storeColCredentials({ id, label, token }) {
  const colCredentials = JSON.stringify({
    id,
    label,
    token
  });

  localStorage.setItem('realtimeVoting.colCredentials', colCredentials);
}

export function objectToQueryString(obj = {}) {
  return Object
    .entries(obj)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');
}

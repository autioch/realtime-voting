/* global io */
const socket = io();
const restaurantsEl = document.querySelector('#restaurants');
const messageEl = document.querySelector('#message');
const historyEl = document.querySelector('#history');

document.querySelector('#submit').onclick = () => {
  socket.emit('chat message', (messageEl.value || '').trim());
  messageEl.value = '';
};

socket.on('chat message', (msg) => {
  const li = document.createElement('li');

  li.textContent = msg;

  historyEl.append(li);
});

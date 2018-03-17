const { info, error, empty } = require('qb-log');
const socketIo = require('socket.io');
const http = require('http');
const { join } = require('path');
const express = require('express');
const restaurants = require('./restaurants');

let nextId = 1;

module.exports = class App {
  constructor({ port }) {
    const app = express();

    app.use(express.static(join(__dirname, '..', 'static')));

    const server = http.Server(app);// eslint-disable-line new-cap

    this.users = [];
    this.io = socketIo(server);
    this.io.on('connection', (socket) => this.connectUser(socket));

    server.listen(port, () => info(`Listening on PORT ${port}`));
  }

  connectUser(socket) {
    const user = this.addUser();

    socket.on('disconnect', () => this.exitUser(user));
    socket.on('user:rename', (token, newNick) => this.renameUser(token, user, newNick));
    socket.on('restaurant:select', (token, restaurantId) => this.selectRestaurant(token, user, restaurantId));

    socket.emit('user:connected', user.id, user.token);
    this.io.emit('user:added', user.id, user.nick);
    socket.emit('restaurant:list', restaurants);
    socket.emit('user:list', this.users.map(({ id, nick }) => ({
      id,
      nick
    })));
  }

  addUser() {
    const user = {
      id: nextId++, // eslint-disable-line no-plusplus
      nick: 'Anonymous',
      token: Math.random().toString() + Math.random().toString()
    };

    this.users.push(user);

    info('User connected', user.id);

    return user;
  }

  validateUser(user, offeredToken) {
    if (user.token !== offeredToken) {
      error('User authentication failed', user.id, user.nick);
      empty(user.token, offeredToken);
      const hackingUser = this.users.find((hacker) => hacker.token === offeredToken);

      if (hackingUser) {
        error('Hacker identified by a token', user.id, user.nick);
      } else {
        error('Unkown token');
      }

      return false;
    }

    return true;
  }

  renameUser(token, user, newNick) {
    if (!this.validateUser(user, token)) {
      return;
    }
    user.nick = newNick;
    this.io.emit('user:renamed', user.id, newNick);
    info('User disconnected', user.id, user.nick, newNick);
  }

  selectRestaurant(token, user, restaurantId) {
    if (!this.validateUser(user, token)) {
      return;
    }
    this.io.emit('restaurant:selected', user.id, restaurantId);
    info('Restaurant selected', user.nick, restaurantId);
  }

  exitUser(userToRemove) {
    this.users = this.users.filter((user) => user !== userToRemove);
    this.io.emit('user:exit', userToRemove.id);
    info('User disconnected', userToRemove.id, userToRemove.nick);
  }
};

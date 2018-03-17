/* eslint-disable no-console */
import React, { Component } from 'react';
import io from 'socket.io-client';

export default class App extends Component {
  state = {
    token: '',
    users: [],
    nick: '',
    id: null,
    restaurants: [],
    choices: {}
  }

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:9090');
    this.socket.on('user:connected', this.connectUser.bind(this));
    this.socket.on('user:added', this.addUser.bind(this));
    this.socket.on('restaurant:list', this.setRestaurantList.bind(this));
    this.socket.on('user:list', this.setUserList.bind(this));
    this.socket.on('user:renamed', this.renameUser.bind(this));
    this.socket.on('restaurant:selected', this.restaurantSelected.bind(this));
    this.socket.on('user:exit', this.removeUser.bind(this));
  }

  connectUser(id, token) {
    console.log('connectUser');
    this.setState({
      token,
      id
    });
  }

  addUser(id, nick) {
    console.log('addUser');
    this.setState({
      users: this.state.users.concat({
        id,
        nick
      })
    });
  }

  setRestaurantList(restaurantList) {
    console.log('setRestaurantList');
    this.setState({
      restaurants: restaurantList
    });
  }

  setUserList(userList) {
    console.log('setUserList');
    this.setState({
      users: userList
    });
  }

  renameUser(id, nick) {
    console.log('renameUser');
    const newUsers = this.state.users.map((us) => {
      if (us.id !== id) {
        return us;
      }

      return {
        id,
        nick
      };
    });

    this.setState({
      users: newUsers
    });
  }

  restaurantSelected(userId, restaurantId) {
    console.log('restaurantSelected');

    this.setState({
      choices: {
        ...this.state.choices,
        [userId]: restaurantId
      }
    });
  }

  removeUser(id) {
    console.log('removeUser');
    this.setState({
      users: this.state.users.filter((user) => user.id !== id)
    });
  }

  selectRestaurant(id) {
    console.log('selectRestaurant');
    this.socket.emit('restaurant:select', this.state.token, id);
  }

  render() {
    const { restaurants, users, choices, id } = this.state;

    return (
      <div className="app">
        <div className="restaurant">
          <div className="restaurant-label"> </div>
          {users.map((user) =>
            <div key={user.id} className="user">
              <div className="user-nick">{user.nick}</div>
            </div>
          )}
        </div>
        {restaurants.map((restaurant) =>
          <div key={restaurant.id} className="restaurant">
            <div className="restaurant-label">{restaurant.label}</div>
            {users.map((user) =>
              <div
                key={user.id}
                className={`user ${choices[user.id] && (choices[user.id] === restaurant.id) ? 'is-chosen' : ''} ${user.id === id ? 'is-current' : ''}`}
                onClick={user.id === id ? () => this.selectRestaurant(restaurant.id) : () => {}}
              >
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

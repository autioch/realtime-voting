/* eslint-disable no-console */
/* eslint max-len: [error, 140] */
import React, { Component } from 'react';
import io from 'socket.io-client';
import Row from './row';
import Header from './header';
import { debounce } from 'lodash';
import { recoverColCredentials, storeColCredentials } from './utils';

export default class App extends Component {
  state = {
    token: '',
    cols: [],
    rows: [],
    label: '',
    choices: {},
    id: null
  }

  constructor(props) {
    super(props);

    this.exitCol = this.exitCol.bind(this);
    this.renameCol = this.renameCol.bind(this);
    this.chooseRow = this.chooseRow.bind(this);
    this.emitRenameCol = debounce(this.emitRenameCol.bind(this), 500); // eslint-disable-line no-magic-numbers

    this.socket = io('http://localhost:9090', {
      query: recoverColCredentials()
    });
    this.socket.on('col:connected', this.connectCol.bind(this));
    this.socket.on('choices', this.setChoices.bind(this));

    /* ROWS */
    this.socket.on('row:list', this.setRowList.bind(this));
    this.socket.on('row:chosen', this.rowChosen.bind(this));

    /* COLUMNS */
    this.socket.on('col:list', this.setColList.bind(this));
    this.socket.on('col:added', this.colAdded.bind(this));
    this.socket.on('col:renamed', this.colRenamed.bind(this));
    this.socket.on('col:removed', this.colRemoved.bind(this));
  }

  connectCol(colCredentials) {
    this.setState(colCredentials);
  }

  componentDidUpdate() {
    storeColCredentials(this.state);
  }

  setChoices(choices) {
    this.setState({
      choices
    });
  }

  /* ROWS */

  setRowList(rows) {
    this.setState({
      rows
    });
  }

  rowChosen(colId, rowId) {
    this.setState({
      choices: {
        ...this.state.choices,
        [colId]: rowId
      }
    });
  }

  chooseRow(id) {
    this.socket.emit('row:choose', this.state.token, this.state.id, id);
  }

  /* COLUMNS */

  setColList(cols) {
    this.setState({
      cols
    });
  }

  colAdded(id, label) {
    this.setState({
      cols: this.state.cols.concat({
        id,
        label
      })
    });
  }

  colRenamed(id, label) {
    this.setState({
      cols: this.state.cols.map((us) => {
        if (us.id !== id) {
          return us;
        }

        return {
          id,
          label
        };
      })
    });
  }

  renameCol(label) {
    const { cols, id } = this.state;

    this.setState({
      label,
      cols: cols.map((us) => {
        if (us.id !== id) {
          return us;
        }

        return {
          id,
          label
        };
      })
    });

    this.emitRenameCol();
  }

  emitRenameCol() {
    this.socket.emit('col:rename', this.state.token, this.state.id, this.state.label);
  }

  exitCol() {
    this.socket.emit('col:exit');
    this.setState({
      cols: [],
      rows: []
    });
  }

  colRemoved(id) {
    this.setState({
      cols: this.state.cols.filter((col) => col.id !== id)
    });
  }

  /* RENDER */

  render() {
    const { rows, cols, choices, id } = this.state;

    return (
      <div className="app">
        <div className="row">
          <div className="row__label"></div>
          {cols.map((col) => <Header key={col.id} col={col} currentId={id} renameCol={this.renameCol} exitCol={this.exitCol} />)}
        </div>
        {rows.map((row) => <Row key={row.id} row={row} cols={cols} chooseRow={this.chooseRow} choices={choices} currentId={id} />)}
      </div>
    );
  }
}

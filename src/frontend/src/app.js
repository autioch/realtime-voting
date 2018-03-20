/* eslint max-len: [error, 140] */
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import io from 'socket.io-client';
import { debounce } from 'lodash';
import { recoverColCredentials, storeColCredentials, removeColCredentials, renameCol, chooseRow } from './utils';
import Row from './row';
import Header from './header';
import EVENTS from './events';

export default class App extends Component {
  state = {
    cols: [],
    rows: [],
    choices: {},
    credentials: {}
  }

  constructor(props) {
    super(props);
    this.emitRenameCol = debounce(this.emitRenameCol, 500); // eslint-disable-line no-magic-numbers
    this.socket = io('http://localhost:9090', {
      query: recoverColCredentials()
    });
    this.socket.on(EVENTS.CHOICES, this.setChoices);
    this.socket.on(EVENTS.ROW_LIST, this.setRowList);
    this.socket.on(EVENTS.COL_LIST, this.setColList);
    this.socket.on(EVENTS.COL_CONNECTED, this.connectCol);
  }

  @autobind
  connectCol(credentials) {
    this.setState({
      credentials
    });

    storeColCredentials(credentials);
  }

  @autobind
  setChoices(choices) {
    this.setState({
      choices
    });
  }

  @autobind
  setRowList(rows) {
    this.setState({
      rows
    });
  }

  @autobind
  setColList(cols) {
    this.setState({
      cols
    });
  }

  @autobind
  renameCol(label) {
    this.setState({
      credentials: {
        ...this.state.credentials,
        label
      },
      cols: renameCol(this.state.cols, this.state.credentials.id, label)
    });
    this.emitRenameCol();
  }

  @autobind
  emitRenameCol() {
    this.socket.emit(EVENTS.COL_RENAME, this.state.credentials, this.state.credentials.label);
  }

  @autobind
  chooseRow(rowId) {
    this.setState({
      choices: chooseRow(this.state.choices, this.state.credentials.id, rowId)
    });
    this.socket.emit(EVENTS.ROW_CHOOSE, this.state.credentials, rowId);
  }

  @autobind
  exitCol() {
    this.setState({
      cols: []
    });
    removeColCredentials();
    this.socket.emit(EVENTS.COL_EXIT, this.state.credentials);
  }

  render() {
    const { rows, cols, choices, credentials: { id } } = this.state;

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

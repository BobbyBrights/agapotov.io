import React, { Component } from 'react';
import "./NewFont/fonts.css";
import './App.css'
import Routers from './routers'

class App extends Component {
  render() {
    return (
      <div className="App">
          <Routers/>
      </div>
    );
  }
}

export default App;

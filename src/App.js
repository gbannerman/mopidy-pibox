import React, { Component } from 'react';
import './style/App.css';
import Search from './components/Search.jsx';
import Home from './components/Home.jsx'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
var Mopidy = require("mopidy");
var mopidy;
var loading = true;

export class App extends Component {

  componentDidMount() {
    mopidy = new Mopidy();
    mopidy.on("state:online", function () {
      loading = false;
    });
    mopidy.on("event:trackPlaybackEnded", function () {
      // TODO Play from playlist
    });
  }

  render() {

    return (
      <div className="App">
        { !loading && 
        <Router>
          <div>
            <ul>
              <li><Link className="Link" to="/">Home</Link></li>
              <li><Link className="Link" to="/search">Search</Link></li>
            </ul>

            <Route exact path="/" component={Home}/>
            <Route path="/search" component={Search}/>
          </div>
        </Router>
      }
      </div>
    );
  }
}

export function getMopidy() {
  return mopidy;
}



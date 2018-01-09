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
var loading = false;

// TODO Make this state^

export class App extends Component {

    constructor(props) {
      super(props);
      this.state = {
        nowPlaying: null,
        tracklist: []
      };
    }

  componentDidMount() {
    mopidy = new Mopidy();
    mopidy.on("state:online", () => {
    console.debug("Mopidy: CONNECTED");
      loading = false;
    });
    mopidy.on("event:trackPlaybackEnded",() => {
      // TODO Play from playlist
    });
    mopidy.on("event:trackPlaybackStarted", (tlTrack) => {
      console.log("PLAYBACK STARTED");
      this.setState({nowPlaying: tlTrack.track});
    });
    mopidy.on("event:tracklistChanged", () => {
      console.log("TRACKLIST CHANGED");
      mopidy.tracklist.getTracks().done((tracklist) => {
        console.log(tracklist);
        this.setState({tracklist: tracklist});
      });
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

            <Route 
              exact 
              path="/" 
              render={ () => 
                <Home 
                  nowPlaying={this.state.nowPlaying}  
                  tracklist={this.state.tracklist} /> 
              } />
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



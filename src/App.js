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
      nowPlaying: {
        name: "Test Title",
        artists: [{name: "Test Artist"}],
        album: {name: "Test Album"}
      },
      imageUrl: "https://i.scdn.co/image/cc8f153161d0a16761db976882614563d2f9e988",
      tracklist: [],
    };
  }

  updateTracklist() {
    mopidy.tracklist.getTracks().done((tracklist) => {
      this.setState({tracklist: tracklist});
    });
  }

  updateNowPlaying() {
    mopidy.playback.getCurrentTrack().done((track) => {
      this.setState({nowPlaying: track});
      mopidy.library.getImages([track.uri]).done((result) => {
        this.setState({imageUrl: result[track.uri][0].uri});
      });
    });
  }

  componentDidMount() {
    mopidy = new Mopidy();
    mopidy.on("state:online", () => {
    console.debug("Mopidy: CONNECTED");
      this.updateTracklist();
      this.updateNowPlaying();
      loading = false;
    });
    mopidy.on("event:trackPlaybackEnded",() => {
      // TODO Play from playlist
    });
    mopidy.on("event:streamTitleChanged", () => {
      console.log("TITLE CHANGED");
      this.updateNowPlaying();
      this.updateTracklist();
    });
    mopidy.on("event:playbackStateChanged", () => {
      console.log("PLAYBACK STATE CHANGED");
      this.updateNowPlaying();
      this.updateTracklist();
    });
    mopidy.on("event:tracklistChanged", () => {
      console.log("TRACKLIST CHANGED");
      this.updateTracklist();
    });
  }

  render() {

    return (
      <div className="App">
        { !loading && 
        <Router>
          <div>
            <ul>
              <li><Link className="Link" to="./">Home</Link></li>
              <li><Link className="Link" to="./search">Search</Link></li>
            </ul>

            <Route 
              exact 
              path="./" 
              render={ () => 
                <Home 
                  nowPlaying={this.state.nowPlaying}  
                  tracklist={this.state.tracklist} 
                  image={this.state.imageUrl} /> 
              } />
            <Route path="./search" component={Search}/>
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



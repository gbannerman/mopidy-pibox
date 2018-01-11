import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import './style/App.css';
import Search from './components/Search.jsx';
import Home from './components/Home.jsx'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
var Mopidy = require("mopidy");
var Spinner = require('react-spinkit');
var mopidy;

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nowPlaying: {
        name: "Test Title",
        artists: [{name: "Test Artist"}],
        album: {name: "Test Album"}
      },
      playing: false,
      imageUrl: null,
      tracklist: [],
      loading: false
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
      if (track) {
        mopidy.library.getImages([track.uri]).done((result) => {
          this.setState({imageUrl: result[track.uri][0].uri});
        });
      } else {
        this.setState({imageUrl: null});
      }
    });
  }

  updatePlaybackState() {
    mopidy.playback.getState().done((playbackState) => {
      if (playbackState === "playing") {
        this.setState({playing: true});
      } else {
        this.setState({playing: false});
      }
    });
  }

  componentDidMount() {
    mopidy = new Mopidy();
    mopidy.on("state:online", () => {
    console.debug("Mopidy: CONNECTED");
      mopidy.tracklist.setConsume(true);
      this.updateTracklist();
      this.updateNowPlaying();
      this.updatePlaybackState();
      this.setState({loading: false});
    });
    mopidy.on("event:playbackStateChanged", (playbackState) => {
      if (playbackState.new_state === "playing") {
        this.setState({playing: true});
      } else {
        this.setState({playing: false});
      }
      this.updateNowPlaying();
      this.updateTracklist();
    });
    mopidy.on("event:tracklistChanged", () => {
      this.updateTracklist();
    });
  }

  render() {

    if (this.state.loading) {
      return(
        <div className="App">
          <div className="loading">
            <h1>pibox</h1>
            <Spinner name="double-bounce" />
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <ToastContainer autoClose={2000} />
        <Router>
          <div>
            <ul>
              <li><Link className="Link" to="/pibox/">Home</Link></li>
              <li><Link className="Link" to="/pibox/search">Search</Link></li>
            </ul>

            <Route 
              exact 
              path="/pibox/" 
              render={ () => 
                <Home 
                  nowPlaying={this.state.nowPlaying} 
                  tracklist={this.state.tracklist} 
                  image={this.state.imageUrl} 
                  playing={this.state.playing} /> 
              } />
            <Route path="/pibox/search" component={Search}/>
          </div>
        </Router>
      </div>
    );
  }
}

export function getMopidy() {
  return mopidy;
}



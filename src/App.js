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
      playing: false,
      imageUrl: null,
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
      if (track) {
        mopidy.library.getImages([track.uri]).done((result) => {
          this.setState({imageUrl: result[track.uri][0].uri});
        });
      } else {
        this.setState({imageUrl: null);
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

  queueFromPlaylist() {
    console.log("Attempting to queue from playlist");
    mopidy.playlists.getItems('spotify:user:gavinbannerman:playlist:79inBfAlnfUB7i5kRthmWL').done((playlist) => {
      let trackReference = playlist[0];
      mopidy.tracklist.add(null, null, null, [trackReference.uri]).done(() => {
        console.log("Track auto-queued");
      });
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
    mopidy.on("event:playbackStateChanged", (playbackState) => {
      console.log("PLAYBACK STATE CHANGED");
      if (playbackState.new_state === "playing") {
        this.setState({playing: true});
      } else {
        this.setState({playing: false});
      }
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
      }
      </div>
    );
  }
}

export function getMopidy() {
  return mopidy;
}



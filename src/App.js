import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import './style/App.css';
import SearchOverlay from './components/SearchOverlay.jsx';
import Home from './components/Home.jsx'
import * as mopidy from './reducers/ducks/mopidy';
import * as playback from './reducers/ducks/playback';
import * as search from './reducers/ducks/search';
import * as tracklist from './reducers/ducks/tracklist';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
var Mopidy = require("mopidy");
var Spinner = require('react-spinkit');
var mopidyService;

export class App extends Component {

  updateTracklist() {
    mopidyService.tracklist.getTracks().done((tracklist) => {
      this.props.updateTracklist(tracklist);
    });
  }

  updateNowPlaying() {
    mopidyService.playback.getCurrentTrack().done((track) => {
      this.props.updateNowPlayingTrack(track);
      if (track) {
        mopidyService.library.getImages([track.uri]).done((result) => {
          this.props.updateNowPlayingImage(result[track.uri][0].uri);
        });
      } else {
        this.props.updateNowPlayingImage(null);
      }
    });
  }

  updatePlaybackState() {
    mopidyService.playback.getState().done((playbackState) => {
      this.props.updatePlaybackState(playbackState);
    });
  }

  componentDidMount() {
    mopidyService = new Mopidy();
    mopidyService.on("state:online", () => {
      console.debug("Mopidy: CONNECTED");
      mopidyService.tracklist.setConsume(true);
      this.updateTracklist();
      this.updateNowPlaying();
      this.updatePlaybackState();
      this.props.updateMopidyConnected(true);
    });
    mopidyService.on("state:offline", () => {
      console.debug("Mopidy: DISCONNECTED");
      this.props.updateMopidyConnected(false);
    });
    mopidyService.on("reconnectionPending", () => {
      console.debug("Mopidy: RECONNECTION PENDING");
      this.props.updateMopidyConnected(false);
    });
    mopidyService.on("reconnecting", () => {
      console.debug("Mopidy: RECONNECTING");
      this.props.updateMopidyConnected(false);
    });
    mopidyService.on("event:playbackStateChanged", (playbackState) => {
      console.debug("Mopidy: PLAYBACK STATE CHANGED");
      this.props.updatePlaybackState(playbackState.new_state);
      this.updateNowPlaying();
      this.updateTracklist();
    });
    mopidyService.on("event:tracklistChanged", () => {
      this.updateTracklist();
    });
  }

  render() {

    if (!this.props.mopidy.connected) {
      return(
        <div className="App">
          <div className="loading">
            <h1>pibox</h1>
            <Spinner fadeIn="quarter" name="double-bounce" />
          </div>
        </div>
      );
    }

    return (
      <Router>
        <MuiThemeProvider>
          <div className="App">
            <ToastContainer autoClose={3000} hideProgressBar={true} pauseOnHover={false} closeButton={false} />
              <div>
                <Home 
                  playback={this.props.playback} 
                  tracklist={this.props.tracklist} /> 
                <Route 
                  path="/pibox/search" 
                  render={ () =>
                    <SearchOverlay 
                      search={this.props.search}
                      playbackState={this.props.playback.state} 
                      tracklist={this.props.tracklist} 
                      onSearch={this.props.performSearch}
                      queueTrack={this.props.queueTrack}/>
                  } />
              </div>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

function mapStateToProps(state) {
    return {
      playback: state.playback,
      mopidy: state.mopidy,
      tracklist: state.tracklist,
      search: state.search
    };
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateTracklist: tracklist.updateTracklist,
    updateNowPlayingTrack: playback.updateNowPlayingTrack,
    updateNowPlayingImage: playback.updateNowPlayingImage,
    updatePlaybackState: playback.updatePlaybackState,
    updateMopidyConnected: mopidy.updateMopidyConnected,
    performSearch: search.search,
    queueTrack: search.queueTrack
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

export function getMopidy() {
  return mopidyService;
}



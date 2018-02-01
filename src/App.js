import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Fingerprint2 from 'fingerprintjs2';
import './style/App.css';
import SearchOverlay from './components/SearchOverlay.jsx';
import Home from './components/Home.jsx'
import * as mopidy from './reducers/ducks/mopidy';
import * as playback from './reducers/ducks/playback';
import * as search from './reducers/ducks/search';
import * as tracklist from './reducers/ducks/tracklist';
import Reboot from 'material-ui/Reboot';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
var Mopidy = require("mopidy");
var Spinner = require('react-spinkit');
var mopidyService;

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: orange,
    error: red
  }
});

export class App extends Component {

  updateTracklist() {
    mopidyService.tracklist.getTracks().done((tracklist) => {
      tracklist.map((track) => {
        track.fetching = false;
        track.voted = false;
        return track;
      });
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
      new Fingerprint2().get((fingerprint) => {
        this.props.updateFingerprint(fingerprint);
      });
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
        <div>
          <Reboot />
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <ToastContainer 
                position={toast.POSITION.BOTTOM_CENTER}
                autoClose={3000} 
                hideProgressBar={true} 
                pauseOnHover={false} 
                closeButton={false} />
                <div>
                  <Home
                    voteToSkip={this.props.voteToSkip}
                    mopidy={this.props.mopidy}
                    playback={this.props.playback} 
                    tracklist={this.props.tracklist} /> 
                  <Route 
                    path="/pibox/search/"
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
        </div>
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
    updateFingerprint: mopidy.updateFingerprint,
    performSearch: search.search,
    queueTrack: search.queueTrack,
    voteToSkip: tracklist.voteToSkip
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

export function getMopidy() {
  return mopidyService;
}



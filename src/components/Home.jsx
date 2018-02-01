import React from 'react';
import NowPlaying from './NowPlaying.jsx';
import Tracklist from './Tracklist.jsx';
import '../style/Home.css';
import { Link } from 'react-router-dom';
import Search from 'material-ui-icons/Search';

export default class Home extends React.Component {

	render() {

		const iconStyle = {
      width: 45,
      height: 45
    }

		return (
			<div className="home">
        <ul>
        	<li className="nav-item-title"><h2 className="nav-title">pibox</h2></li>
        	<li className="nav-item-search"><Link className="Link" to="/pibox/search/"><Search style={iconStyle}/></Link></li>
        </ul>
	      <NowPlaying playback={this.props.playback} />
	      <Tracklist mopidy={this.props.mopidy} tracks={this.props.tracklist} display={3} voteToSkip={this.props.voteToSkip}/>
			</div>
		);
	}
}
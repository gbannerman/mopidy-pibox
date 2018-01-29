import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from './configure-store';

const developmentBuild = process.env.NODE_ENV === 'development';

if (developmentBuild) {
	var mockTracklist = [
		{
			name: 'Break It',
			artists: [{name: 'Danny Brown'}, {name: 'Purity Ring'}],
			album: {name: 'Old'}
		},
		{
			name: 'Neighbors',
			artists: [{name: 'J. Cole'}],
			album: {name: '4 Your Eyez Only'}
		},
		{
			name: 'Ttktv',
			artists: [{name: 'Injury Reserve'}],
			album: {name: 'Live from the Dentist Office'}
		}
	];
	var mockNowPlayingTrack = {
		name: '25 Bucks',
		artists: [{name: 'Danny Brown'}, {name: 'Purity Ring'}],
		album: {name: 'Old'}
	};
	var mockNowPlayingImage = "https://i.scdn.co/image/8d625b3c2e7bbbcc3d4275d4ece08093556b362a";
}

const app = document.getElementById('root');

const store = configureStore({
	mopidy: {
		connected: developmentBuild,
		fingerprint: null
	},
	playback: {
		track: mockNowPlayingTrack,
		image: mockNowPlayingImage,
		state: developmentBuild ? 'paused' : 'stopped'
	},
	search: {
		fetching: false,
		results: [],
		error: null
	},
	tracklist: mockTracklist
});

ReactDOM.render(
	<Provider store={store} >
		<App />
	</Provider>
	, app);
	
registerServiceWorker();

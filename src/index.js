import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from './configure-store';

const app = document.getElementById('root');

const store = configureStore({
	mopidy: {
		connected: false
	},
	playback: {
		track: null,
		image: null,
		state: 'STOPPED'
	},
	search: {
		fetching: false,
		term: '',
		results: [],
		error: null
	},
	tracklist: []
});

ReactDOM.render(
	<Provider store={store} >
		<App />
	</Provider>
	, app);
	
registerServiceWorker();
